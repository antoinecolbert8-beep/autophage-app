import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { enqueueSocialPost } from '@/lib/queue/social-queue';
import { db as prisma } from '@/core/db';
import { consumeCredits } from '@/lib/billing';

/**
 * 🚀 POST /api/posts/enqueue
 * Déclenche une publication asynchrone via BullMQ.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const organizationId = (session.user as any).organizationId;

    try {
        const { content, platforms, mediaUrls } = await req.json();

        // ── ARCHITECTURE SCELLÉE : Garde-fou financier ──────────────────────
        const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { status: true }
        });

        if (org?.status !== 'active') {
            return NextResponse.json({
                error: `Action suspendue. Statut organisation : ${org?.status || 'inconnu'}. Veuillez régulariser votre abonnement.`
            }, { status: 403 });
        }

        // ── ARCHITECTURE SCELLÉE : Débit de crédits ────────────────────────
        const billing = await consumeCredits(organizationId, 'POST_PUBLISH');
        if (!billing.success) {
            return NextResponse.json({
                error: 'Crédits insuffisants.',
                remaining: billing.remaining,
                required: 10 // Cost of POST_PUBLISH
            }, { status: 402 });
        }
        // ───────────────────────────────────────────────────────────────────
        // ───────────────────────────────────────────────────────────────────

        if (!content || !platforms || !Array.isArray(platforms)) {
            return NextResponse.json({ error: 'Missing content or platforms array' }, { status: 400 });
        }

        const jobId = await enqueueSocialPost({
            post: {
                content,
                mediaUrls,
                platform: platforms[0], // Lead platform
            },
            platforms,
            organizationId: (session.user as any).organizationId
        });

        console.log(`🚀 Job enqueued: ${jobId} for user ${session.user.email}`);

        return NextResponse.json({
            success: true,
            jobId,
            status: 'queued',
            message: 'Publication en cours de traitement asynchrone.'
        });

    } catch (error: any) {
        console.error("❌ Enqueue error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
