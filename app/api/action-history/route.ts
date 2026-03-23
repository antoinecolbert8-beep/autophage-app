import { NextResponse } from 'next/server';
import { db as prisma } from '@/core/db';

/**
 * API Route: /api/action-history
 * Utilisé par les bots Python pour logger leurs actions dans la DB
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, platform, action, targetId, context } = body;

        if (!userId || !platform || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Création du log dans ActionHistory (Log utilisateur)
        const history = await prisma.actionHistory.create({
            data: {
                userId,
                platform,
                action,
                targetId,
                context: context ? JSON.stringify(context) : null,
                status: 'completed'
            }
        });

        // 2. Parallèlement, log dans AIActionLog pour la War Room si c'est une action métier
        await prisma.aIActionLog.create({
            data: {
                actionType: action,
                entityType: platform,
                entityId: targetId || 'unknown',
                status: 'completed',
                decisionReasoning: `Bot autonomous action logged via API for user ${userId}`,
                executedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, id: history.id });

    } catch (error: any) {
        console.error("❌ Error logging action-history:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
