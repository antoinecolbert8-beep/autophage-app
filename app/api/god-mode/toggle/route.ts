import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

const VALID_FEATURES = [
    'selfPromotion',
    'linkedinBot',
    'emailSequences',
    'viralEngine',
    'autoEngage',
    'shopifyBroadcast',
    'crm_sync'
];

/**
 * POST /api/god-mode/toggle
 * Updates a specific God Mode feature toggle for the authenticated user's organization.
 * Body: { feature: string, enabled: boolean }
 */
export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !VALID_FEATURES.includes(body.feature)) {
        return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    const { feature, enabled } = body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { organizationId: true, role: true }
        });

        if (!user?.organizationId) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Get existing config
        const aiProfile = await prisma.aIProfile.findUnique({
            where: { organizationId: user.organizationId }
        });

        let currentConfig: Record<string, boolean> = {};

        if (aiProfile?.godModeConfig) {
            try {
                currentConfig = JSON.parse(aiProfile.godModeConfig);
            } catch { /* empty */ }
        }

        // Update the specific feature
        currentConfig[feature] = !!enabled;

        if (aiProfile) {
            await prisma.aIProfile.update({
                where: { organizationId: user.organizationId },
                data: { godModeConfig: JSON.stringify(currentConfig) }
            });
        } else {
            await prisma.aIProfile.create({
                data: {
                    organizationId: user.organizationId,
                    godModeConfig: JSON.stringify(currentConfig)
                }
            });
        }

        // Log the toggle action (non-blocking)
        await prisma.usageLog.create({
            data: {
                organizationId: user.organizationId,
                actionType: 'GOD_MODE_TOGGLE',
                creditsUsed: 0,
                metadata: JSON.stringify({ feature, enabled, actor: token.email })
            }
        }).catch(() => {/* Non-blocking */ });

        console.log(`[GOD MODE] Toggle: ${feature} = ${enabled} by ${token.email}`);

        return NextResponse.json({
            success: true,
            feature,
            enabled: !!enabled,
            message: enabled
                ? `${feature} activé avec précision chirurgicale.`
                : `${feature} mis en pause.`
        });
    } catch (error: any) {
        console.error('[GOD MODE TOGGLE]', error);
        return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 });
    }
}
