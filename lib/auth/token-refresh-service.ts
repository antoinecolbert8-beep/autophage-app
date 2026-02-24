import axios from 'axios';
import { db as prisma } from "@/core/db";
import { fortress } from "@/lib/security/fortress";

/**
 * ⚡ TOKEN REFRESH SERVICE (Sealed Architecture)
 * Gère la rotation automatique des tokens pour éviter les expirations à J+60.
 */
export class TokenRefreshService {
    /**
     * Vérifie et rafraîchit toutes les intégrations proches d'expirer (< 7 jours)
     */
    static async refreshAll(organizationId?: string): Promise<{ succeeded: number; failed: number }> {
        const now = new Date();
        const refreshThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        const where: any = {
            status: 'active',
            provider: { in: ['LINKEDIN', 'FACEBOOK', 'INSTAGRAM'] },
            OR: [
                { tokenExpiresAt: { lte: refreshThreshold } },
                { tokenExpiresAt: null } // Safety: refresh if unknown
            ]
        };

        if (organizationId) where.organizationId = organizationId;

        const integrations = await prisma.integration.findMany({ where });
        console.log(`🔄 Found ${integrations.length} integrations to refresh.`);

        let succeeded = 0;
        let failed = 0;

        for (const integration of integrations) {
            try {
                const success = await this.refresh(integration.id);
                if (success) succeeded++;
                else failed++;
            } catch (error) {
                console.error(`❌ Global refresh failed for ${integration.id}:`, error);
                failed++;
            }
        }

        return { succeeded, failed };
    }

    /**
     * Rafraîchit une intégration spécifique
     */
    static async refresh(integrationId: string): Promise<boolean> {
        const integration = await prisma.integration.findUnique({
            where: { id: integrationId }
        });

        if (!integration) return false;

        // Decrypt current credentials
        let creds: any = {};
        try {
            creds = await fortress.decrypt(integration.credentials);
        } catch (e) {
            console.error(`❌ Decryption failed for ${integrationId}:`, e);
            return false;
        }

        // Decrypt refresh token if exists
        let refreshToken: string | undefined;
        if (integration.refreshToken) {
            refreshToken = await fortress.decrypt(integration.refreshToken);
        }

        let result: { accessToken: string; refreshToken?: string; expiresIn: number } | null = null;

        try {
            if (integration.provider === 'LINKEDIN') {
                result = await this.executeLinkedInRefresh(refreshToken || creds.accessToken);
            } else if (integration.provider === 'FACEBOOK' || integration.provider === 'INSTAGRAM') {
                result = await this.executeMetaRefresh(creds.accessToken);
            }

            if (result) {
                // Enforce re-encryption via Fortress
                const encryptedCreds = await fortress.encrypt({
                    ...creds,
                    accessToken: result.accessToken,
                });

                const updateData: any = {
                    credentials: encryptedCreds,
                    tokenExpiresAt: new Date(Date.now() + result.expiresIn * 1000),
                    requiresReauth: false,
                    status: 'active'
                };

                if (result.refreshToken) {
                    updateData.refreshToken = await fortress.encrypt(result.refreshToken);
                }

                await prisma.integration.update({
                    where: { id: integrationId },
                    data: updateData
                });

                console.log(`✅ [${integration.provider}] Token rotated for ${integrationId}`);
                return true;
            }
        } catch (error: any) {
            console.error(`❌ [${integration.provider}] Refresh failed for ${integrationId}:`, error.response?.data || error.message);

            // Mark for reauth if failed multiple times (implicitly handled by cron or manual check)
            await prisma.integration.update({
                where: { id: integrationId },
                data: { requiresReauth: true }
            });

            // TODO: Send email alert via Twilio/Resend
        }

        return false;
    }

    /**
     * LinkedIn OAuth 2.0 Token Exchange (Refresh)
     * Note: LinkedIn refresh tokens are valid for 1 year.
     */
    private static async executeLinkedInRefresh(refreshTokenOrAccess: string) {
        // LinkedIn doesn't always provide a refresh_token depending on scopes.
        // If we have one, we exchange it. If not, text-based re-auth is needed.
        // Endpoints: POST https://www.linkedin.com/oauth/v2/accessToken

        if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
            throw new Error("Missing LinkedIn Client ID/Secret for refresh");
        }

        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshTokenOrAccess,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in || 5184000 // 60 days default
        };
    }

    /**
     * Meta (Facebook/Instagram) Long-Lived Token Refresh
     * GET https://graph.facebook.com/v19.0/oauth/access_token
     */
    private static async executeMetaRefresh(accessToken: string) {
        if (!process.env.FB_APP_ID || !process.env.FB_APP_SECRET) {
            throw new Error("Missing Meta App ID/Secret for refresh");
        }

        const response = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.FB_APP_ID,
                client_secret: process.env.FB_APP_SECRET,
                fb_exchange_token: accessToken
            }
        });

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in || 5184000 // 60 days default
        };
    }
}
