import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

const DEFAULT_STATUS = {
    selfPromotion: false,
    linkedinBot: false,
    emailSequences: false,
    viralEngine: true,
    autoEngage: false,
    shopifyBroadcast: false,
    crm_sync: false,
};

/**
 * GET /api/god-mode/status
 * Returns current God Mode feature flags for the authenticated user's organization.
 */
export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { organizationId: true }
        });

        if (!user?.organizationId) {
            return NextResponse.json({ status: DEFAULT_STATUS });
        }

        // @ts-ignore — godModeConfig added to schema, Prisma client will regenerate on next build
        let aiProfile = await (prisma.aIProfile as any).findUnique({
            where: { organizationId: user.organizationId }
        });

        if (!aiProfile) {
            // @ts-ignore — godModeConfig added to schema
            aiProfile = await (prisma.aIProfile as any).create({
                data: {
                    organizationId: user.organizationId,
                    godModeConfig: JSON.stringify(DEFAULT_STATUS)
                }
            });
        }

        let status = DEFAULT_STATUS;
        if (aiProfile?.godModeConfig) {
            try {
                status = { ...DEFAULT_STATUS, ...JSON.parse(aiProfile.godModeConfig) };
            } catch { /* use defaults */ }
        }

        return NextResponse.json({ status });
    } catch (error: any) {
        console.error('[GOD MODE STATUS]', error);
        // Fallback: return defaults without DB errors blocking the UI
        return NextResponse.json({ status: DEFAULT_STATUS });
    }
}
