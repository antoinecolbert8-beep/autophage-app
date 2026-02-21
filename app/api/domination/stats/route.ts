import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const [keywords, content, actions] = await Promise.all([
            prisma.keywordOpportunity.count({ where: { status: 'in-progress' } }),
            prisma.contentAsset.count({ where: { publishedAt: { not: null } } }),
            prisma.aIActionLog.count({ where: { status: 'completed' } }),
        ]);

        const recentActions = await prisma.aIActionLog.findMany({
            where: { status: 'completed' },
            orderBy: { executedAt: 'desc' },
            take: 10,
        });

        return NextResponse.json({
            workerStatus: 'running', // Get from Redis in production
            dominationScore: Math.min((keywords / 100) * 100, 100),
            keywordsCaptured: keywords,
            contentPublished: content,
            actionsExecuted: actions,
            estimatedReach: keywords * 10000,
            apex: { status: 'running', tasksCompleted: content },
            snap: { status: 'running', tasksCompleted: actions },
            pulse: { status: 'running', tasksCompleted: Math.floor(actions / 2) },
            recentActions: recentActions.map(a => ({
                type: a.actionType,
                message: `${a.actionType}: ${a.entityType} ${a.entityId.slice(0, 8)}`,
                timestamp: a.executedAt?.toISOString().split('T')[1].slice(0, 8) || 'now',
            })),
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
