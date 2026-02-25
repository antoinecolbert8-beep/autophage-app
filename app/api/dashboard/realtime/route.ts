/**
 * GET /api/dashboard/realtime
 * Pilier 2 — Dashboard Temps Réel
 * Cache Redis (TTL 60s) pour éviter de saturer la DB à chaque F5.
 * Retourne: posts récents, KPIs live, activité par plateforme.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

export const dynamic = 'force-dynamic';

// Redis optionnel — fallback DB si non configuré
let redis: any = null;
try {
    const { Redis } = require('ioredis');
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
    });
} catch {
    // Redis non disponible — mode dégradé (toujours fonctionnel)
}

async function cacheGet(key: string): Promise<any | null> {
    try {
        if (!redis) return null;
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
    } catch {
        return null;
    }
}

async function cacheSet(key: string, data: any, ttlSeconds = 60): Promise<void> {
    try {
        if (!redis) return;
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
    } catch {
        // Cache miss non-bloquant
    }
}

async function buildRealtimePayload(orgId: string, userId: string) {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentPosts, recentActions, org, weeklyEngagement] = await Promise.all([
        // 5 derniers posts publiés
        prisma.post.findMany({
            where: { userId, status: 'published' },
            orderBy: { publishedAt: 'desc' },
            take: 5,
            select: {
                id: true,
                platform: true,
                content: true,
                externalId: true,
                publishedAt: true,
                performance_score: true,
                stats: {
                    orderBy: { collectedAt: 'desc' },
                    take: 1,
                    select: { views: true, likes: true, comments: true, shares: true },
                },
            },
        }),

        // Dernières actions (commentaires reçus, publications)
        prisma.actionHistory.findMany({
            where: { userId, createdAt: { gte: since24h } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { id: true, platform: true, action: true, context: true, createdAt: true },
        }),

        // KPIs organisationnels
        prisma.organization.findUnique({
            where: { id: orgId },
            select: {
                mrr: true,
                creditBalance: true,
                tier: true,
                _count: { select: { leads: true } },
            },
        }),

        // Engagement total sur 7 jours
        prisma.contentStat.aggregate({
            where: { post: { userId }, collectedAt: { gte: since7d } },
            _sum: { views: true, likes: true, comments: true, shares: true },
        }),
    ]);

    // Commentaires extraits des actions (action = 'COMMENT_RECEIVED')
    const recentComments = recentActions
        .filter((a) => a.action === 'COMMENT_RECEIVED')
        .map((a) => {
            let ctx: any = {};
            try { ctx = JSON.parse(a.context || '{}'); } catch { }
            return {
                id: a.id,
                platform: a.platform,
                text: ctx.text || '',
                author: ctx.author || 'Anonyme',
                aiReply: ctx.aiReply || null,
                createdAt: a.createdAt,
            };
        });

    return {
        recentPosts: recentPosts.map((p) => ({
            id: p.id,
            platform: p.platform,
            preview: p.content.slice(0, 120) + (p.content.length > 120 ? '…' : ''),
            externalId: p.externalId,
            publishedAt: p.publishedAt,
            performanceScore: p.performance_score,
            latestStats: p.stats[0] || { views: 0, likes: 0, comments: 0, shares: 0 },
        })),
        recentComments,
        recentActivity: recentActions.slice(0, 5).map((a) => ({
            id: a.id,
            platform: a.platform,
            action: a.action,
            createdAt: a.createdAt,
        })),
        kpis: {
            mrr: org?.mrr ?? 0,
            creditBalance: org?.creditBalance ?? 0,
            tier: org?.tier ?? 'starter',
            totalLeads: org?._count?.leads ?? 0,
            weeklyViews: weeklyEngagement._sum.views ?? 0,
            weeklyLikes: weeklyEngagement._sum.likes ?? 0,
            weeklyComments: weeklyEngagement._sum.comments ?? 0,
            weeklyShares: weeklyEngagement._sum.shares ?? 0,
            totalEngagement:
                (weeklyEngagement._sum.views ?? 0) +
                (weeklyEngagement._sum.likes ?? 0) * 10 +
                (weeklyEngagement._sum.comments ?? 0) * 20 +
                (weeklyEngagement._sum.shares ?? 0) * 50,
        },
        generatedAt: new Date().toISOString(),
    };
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, organizationId: true },
        });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const cacheKey = `dashboard:realtime:${user.organizationId}`;

        // Tenter le cache Redis d'abord
        const cached = await cacheGet(cacheKey);
        if (cached) {
            return NextResponse.json({ ...cached, fromCache: true });
        }

        // Générer le payload frais
        const payload = await buildRealtimePayload(user.organizationId, user.id);

        // Mettre en cache 60 secondes
        await cacheSet(cacheKey, payload, 60);

        return NextResponse.json({ ...payload, fromCache: false });
    } catch (error) {
        console.error('[realtime] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
