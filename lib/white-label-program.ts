import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * WHITE-LABEL & RESELLER PROGRAM
 * Branding custom + Revenue sharing
 */

export interface WhiteLabelConfig {
    resellerId: string;
    brandName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    customDomain?: string;
    supportEmail: string;
    termsUrl?: string;
    privacyUrl?: string;
}

export interface RevenueShare {
    resellerId: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    percentage: number; // 30-50%
    monthlyRevenue: number;
    totalEarned: number;
}

export class WhiteLabelProgram {

    private static revenueTiers = {
        'bronze': { minClients: 0, percentage: 30 },
        'silver': { minClients: 10, percentage: 35 },
        'gold': { minClients: 25, percentage: 40 },
        'platinum': { minClients: 50, percentage: 50 }
    };

    /**
     * Création d'un compte revendeur
     */
    static async createReseller(params: {
        email: string;
        companyName: string;
        brandName: string;
    }): Promise<{ resellerId: string; onboardingUrl: string }> {
        const { email, companyName, brandName } = params;

        console.log(`[White-Label] Creating reseller: ${companyName}`);

        // Créer organisation revendeur
        const reseller = await prisma.organization.create({
            data: {
                name: companyName,
                domain: brandName.toLowerCase().replace(/\s+/g, '-') + '.ela-reseller.com',
                tier: 'reseller'
            }
        });

        // Générer custom domain
        const customDomain = `${brandName.toLowerCase().replace(/\s+/g, '')}.ela.app`;

        console.log(`[White-Label] Reseller created: ${reseller.id}`);
        console.log(`[White-Label] Custom domain: ${customDomain}`);

        return {
            resellerId: reseller.id,
            onboardingUrl: `https://app.ela.com/reseller/onboard/${reseller.id}`
        };
    }

    /**
     * Configuration du branding
     */
    static async configureBranding(config: WhiteLabelConfig): Promise<void> {
        const { resellerId, brandName, logo, primaryColor, secondaryColor } = config;

        console.log(`[White-Label] Configuring branding for ${brandName}`);

        // Enregistrer config dans DB
        // En production: stockage dans S3 + CDN pour les assets

        // Générer CSS custom
        const customCSS = `
:root {
    --brand-primary: ${primaryColor};
    --brand-secondary: ${secondaryColor};
}

.brand-logo {
    background-image: url('${logo}');
}
        `.trim();

        console.log(`[White-Label] Branding configured for ${resellerId}`);
    }

    /**
     * Provision d'un sous-domaine
     */
    static async provisionSubdomain(resellerId: string, subdomain: string): Promise<string> {
        // En production: Cloudflare API ou Vercel Domains
        const fullDomain = `${subdomain}.ela.app`;

        console.log(`[White-Label] Provisioning subdomain: ${fullDomain}`);

        // Configure DNS, SSL certificate, routing
        // ...

        return fullDomain;
    }

    /**
     * Calcul du revenue share
     */
    static async calculateRevenueShare(resellerId: string): Promise<RevenueShare> {
        // Récupérer tous les clients du revendeur
        const clients = await prisma.organization.count({
            where: {
                // parentResellerId: resellerId - si champ existe
            }
        });

        // Déterminer tier basé sur nombre de clients
        let tier: RevenueShare['tier'] = 'bronze';
        if (clients >= 50) tier = 'platinum';
        else if (clients >= 25) tier = 'gold';
        else if (clients >= 10) tier = 'silver';

        const percentage = this.revenueTiers[tier].percentage;

        // Calculer revenue du mois
        // En production: query Stripe pour les paiements attribuables
        const monthlyRevenue = 0; // Placeholder

        const totalEarned = monthlyRevenue * (percentage / 100);

        return {
            resellerId,
            tier,
            percentage,
            monthlyRevenue,
            totalEarned
        };
    }

    /**
     * Dashboard revendeur
     */
    static async getResellerDashboard(resellerId: string): Promise<{
        clients: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
        commission: number;
        tier: string;
        nextTierRequirement: string;
    }> {
        const revenueShare = await this.calculateRevenueShare(resellerId);

        const clients = await prisma.organization.count();
        const activeSubscriptions = await prisma.subscription.count({
            where: { status: 'active' }
        });

        const nextTier = this.getNextTier(revenueShare.tier);

        return {
            clients,
            activeSubscriptions,
            monthlyRevenue: revenueShare.monthlyRevenue,
            commission: revenueShare.totalEarned,
            tier: revenueShare.tier,
            nextTierRequirement: nextTier
        };
    }

    private static getNextTier(currentTier: RevenueShare['tier']): string {
        const tiers: RevenueShare['tier'][] = ['bronze', 'silver', 'gold', 'platinum'];
        const currentIndex = tiers.indexOf(currentTier);

        if (currentIndex === tiers.length - 1) {
            return 'Vous êtes au niveau maximum !';
        }

        const nextTier = tiers[currentIndex + 1];
        const requirement = this.revenueTiers[nextTier].minClients;

        return `${requirement} clients pour atteindre ${nextTier.toUpperCase()} (${this.revenueTiers[nextTier].percentage}% commission)`;
    }

    /**
     * Support tier system
     */
    static getSupportTier(revenueShare: RevenueShare): {
        responseTime: string;
        channels: string[];
        dedicatedManager: boolean;
    } {
        switch (revenueShare.tier) {
            case 'platinum':
                return {
                    responseTime: '2h',
                    channels: ['Email', 'Phone', 'Slack', 'WhatsApp'],
                    dedicatedManager: true
                };
            case 'gold':
                return {
                    responseTime: '4h',
                    channels: ['Email', 'Phone', 'Slack'],
                    dedicatedManager: true
                };
            case 'silver':
                return {
                    responseTime: '8h',
                    channels: ['Email', 'Phone'],
                    dedicatedManager: false
                };
            default:
                return {
                    responseTime: '24h',
                    channels: ['Email'],
                    dedicatedManager: false
                };
        }
    }

    /**
     * Génération de liens d'affiliation
     */
    static generateAffiliateLink(resellerId: string, campaign?: string): string {
        const baseUrl = 'https://ela.com/signup';
        const params = new URLSearchParams({
            ref: resellerId,
            ...(campaign && { utm_campaign: campaign })
        });

        return `${baseUrl}?${params.toString()}`;
    }
}
