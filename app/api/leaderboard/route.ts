/**
 * GET /api/leaderboard
 * Retourne le snapshot hebdomadaire du classement (généré chaque dimanche par cron).
 * ?period=current → snapshot de la semaine courante
 * ?period=2026-W08 → snapshot d'une semaine spécifique
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

export const dynamic = 'force-dynamic';

function getCurrentISOWeek(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(
        ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const period = searchParams.get('period') === 'current'
        ? getCurrentISOWeek()
        : searchParams.get('period') || getCurrentISOWeek();

    // 1. Tenter le snapshot pré-généré (rapide)
    const snapshot = await prisma.leaderboardSnapshot.findUnique({
        where: { period },
    });

    if (snapshot) {
        return NextResponse.json({
            period,
            topPublishers: JSON.parse(snapshot.topPublishers),
            topReferrers: JSON.parse(snapshot.topReferrers),
            generatedAt: snapshot.generatedAt,
            fromCache: true,
        });
    }

    // 2. Aucun snapshot → génération live (pour la semaine courante uniquement)
    if (period !== getCurrentISOWeek()) {
        return NextResponse.json({ period, topPublishers: [], topReferrers: [], fromCache: false });
    }

    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [publisherStats, referrerStats] = await Promise.all([
        // Top publishers : agrégé par userId via les posts de la semaine
        prisma.post.groupBy({
            by: ['userId'],
            where: { status: 'published', publishedAt: { gte: since7d } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        }),

        // Top referrers : par nombre de filleuls actifs
        prisma.referral.groupBy({
            by: ['referrerId'],
            where: { status: 'active' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        }),
    ]);

    // Hydrater avec les noms
    const userIds = [...new Set([
        ...publisherStats.map((s) => s.userId),
        ...referrerStats.map((s) => s.referrerId),
    ])];

    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, avatar: true, referralTier: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const topPublishers = publisherStats.map((s, idx) => ({
        rank: idx + 1,
        userId: s.userId,
        name: userMap[s.userId]?.name || 'Anonyme',
        avatar: userMap[s.userId]?.avatar || null,
        postCount: s._count.id,
    }));

    const topReferrers = referrerStats.map((s, idx) => ({
        rank: idx + 1,
        userId: s.referrerId,
        name: userMap[s.referrerId]?.name || 'Anonyme',
        avatar: userMap[s.referrerId]?.avatar || null,
        activeReferrals: s._count.id,
        tier: userMap[s.referrerId]?.referralTier || 0,
    }));

    return NextResponse.json({
        period,
        topPublishers,
        topReferrers,
        generatedAt: new Date().toISOString(),
        fromCache: false,
    });
}

// ── Cron handler: POST /api/leaderboard (appelé chaque dimanche à 23:59 UTC) ──

export async function POST(req: NextRequest) {
    // Protégé par le secret cron interne
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const period = getCurrentISOWeek();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [publisherStats, referrerStats] = await Promise.all([
        prisma.post.groupBy({
            by: ['userId'],
            where: { status: 'published', publishedAt: { gte: since7d } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        }),
        prisma.referral.groupBy({
            by: ['referrerId'],
            where: { status: 'active' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        }),
    ]);

    const userIds = [...new Set([
        ...publisherStats.map((s) => s.userId),
        ...referrerStats.map((s) => s.referrerId),
    ])];
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, avatar: true, referralTier: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const topPublishers = publisherStats.map((s, idx) => ({
        rank: idx + 1,
        userId: s.userId,
        name: userMap[s.userId]?.name || 'Anonyme',
        avatar: userMap[s.userId]?.avatar || null,
        postCount: s._count.id,
    }));

    const topReferrers = referrerStats.map((s, idx) => ({
        rank: idx + 1,
        userId: s.referrerId,
        name: userMap[s.referrerId]?.name || 'Anonyme',
        avatar: userMap[s.referrerId]?.avatar || null,
        activeReferrals: s._count.id,
        tier: userMap[s.referrerId]?.referralTier || 0,
    }));

    // Mise à jour des statuts 'churned' : filleuls sans post payant depuis 30j
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeReferrals = await prisma.referral.findMany({
        where: { status: 'active' },
        select: { refereeId: true, id: true },
    });

    const refereesWithRecentActivity = await prisma.post.groupBy({
        by: ['userId'],
        where: {
            userId: { in: activeReferrals.map((r) => r.refereeId) },
            status: 'published',
            publishedAt: { gte: since30d },
        },
        _count: { id: true },
    });

    const activeRefereeIds = new Set(refereesWithRecentActivity.map((r) => r.userId));
    const churnedIds = activeReferrals
        .filter((r) => !activeRefereeIds.has(r.refereeId))
        .map((r) => r.id);

    if (churnedIds.length > 0) {
        await prisma.referral.updateMany({
            where: { id: { in: churnedIds } },
            data: { status: 'churned' },
        });
    }

    // Persister le snapshot
    await prisma.leaderboardSnapshot.upsert({
        where: { period },
        create: {
            period,
            topPublishers: JSON.stringify(topPublishers),
            topReferrers: JSON.stringify(topReferrers),
        },
        update: {
            topPublishers: JSON.stringify(topPublishers),
            topReferrers: JSON.stringify(topReferrers),
            generatedAt: new Date(),
        },
    });

    return NextResponse.json({
        success: true,
        period,
        churned: churnedIds.length,
        topPublishers: topPublishers.length,
        topReferrers: topReferrers.length,
    });
}
