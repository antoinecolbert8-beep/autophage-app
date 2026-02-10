import { db as prisma } from "@/core/db";
import { CachedAnalytics } from '../cached-analytics';

export type SovereigntyTitle = 'Digital Serf' | 'Digital Architect' | 'Sovereign Entity' | 'Master Orchestrator' | 'God Mode';

export interface SovereigntyMetrics {
    score: number;
    title: SovereigntyTitle;
    rank: number;
    multipliers: {
        consistency: number;
        domination: number;
    };
    nextMilestone: number;
}

export class SovereigntyManager {

    /**
     * Calculate absolute sovereignty score for an organization
     */
    static async calculateScore(orgId: string): Promise<SovereigntyMetrics> {
        const cacheKey = `sovereignty:${orgId}`;
        const { Cache } = await import('../cache');

        // ⚡ HYPER-FLUX: Redis Cache HIT
        const cached = await Cache.get<SovereigntyMetrics>(cacheKey);
        if (cached) return cached;

        // 1. Get Base Data (Parallelized)
        const [org, leadsCount] = await Promise.all([
            prisma.organization.findUnique({
                where: { id: orgId },
                include: { users: { select: { id: true } } }
            }),
            prisma.lead.count({ where: { organizationId: orgId } })
        ]);

        if (!org) return {
            score: 0,
            title: 'Digital Serf',
            rank: 0,
            multipliers: { consistency: 1, domination: 1 },
            nextMilestone: 100
        };

        const userIds = org.users.map(u => u.id);

        // Fetch metrics in parallel
        const [postsCount, posts] = await Promise.all([
            prisma.post.count({
                where: { userId: { in: userIds }, status: 'published' }
            }),
            prisma.post.findMany({
                where: { userId: { in: userIds }, status: 'published' },
                select: { id: true }
            })
        ]);

        // Revenue in cents
        const revenueCents = (org.mrr || 0) * 100;

        // Parallel engagement fetching
        const engagementResults = await Promise.all(posts.map(post =>
            prisma.contentStat.findFirst({
                where: { postId: post.id },
                orderBy: { collectedAt: 'desc' }
            })
        ));

        let totalEngagement = 0;
        for (const stats of engagementResults) {
            if (stats) {
                totalEngagement += (stats.views || 0) + (stats.likes || 0) + (stats.comments || 0);
            }
        }

        // 2. Algorithm
        const revScore = (revenueCents / 1000) * 5;
        const leadScore = leadsCount * 25;
        const postScore = postsCount * 15;
        const engScore = (totalEngagement / 100) * 10;

        let rawScore = revScore + leadScore + postScore + engScore;

        // 3. Multipliers
        const multipliers = {
            consistency: postsCount > 5 ? 1.2 : 1.0,
            domination: leadsCount > 10 ? 1.5 : 1.0
        };

        const finalScore = Math.min(1000, Math.floor(rawScore * multipliers.consistency * multipliers.domination));

        // 4. Determine Title
        let title: SovereigntyTitle = 'Digital Serf';
        if (finalScore > 900) title = 'God Mode';
        else if (finalScore > 600) title = 'Master Orchestrator';
        else if (finalScore > 300) title = 'Sovereign Entity';
        else if (finalScore > 100) title = 'Digital Architect';

        const thresholds = [100, 300, 600, 900, 1000];
        const nextMilestone = thresholds.find(t => t > finalScore) || 1000;

        const result = {
            score: finalScore,
            title,
            rank: rawScore > 0 ? 1 : 0,
            multipliers,
            nextMilestone
        };

        // ⚡ HYPER-FLUX: Redis Cache SET (5 min TTL)
        await Cache.set(cacheKey, result, 300);

        return result;
    }
}
