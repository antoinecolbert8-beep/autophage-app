import { PrismaClient } from '@prisma/client';
import { CachedAnalytics } from '../cached-analytics';

const prisma = new PrismaClient();

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
        // 1. Get Base Data
        const org = await prisma.organization.findUnique({
            where: { id: orgId },
            include: {
                users: { select: { id: true } }
            }
        });

        if (!org) throw new Error('Organization not found');

        const userIds = org.users.map(u => u.id);

        // Fetch metrics (7 days)
        const postsCount = await prisma.post.count({
            where: { userId: { in: userIds }, status: 'published' }
        });

        const leadsCount = await prisma.lead.count({
            where: { organizationId: orgId }
        });

        // Revenue in cents
        const revenueCents = (org.mrr || 0) * 100;

        // Engagement aggregation
        const posts = await prisma.post.findMany({
            where: { userId: { in: userIds }, status: 'published' },
            select: { id: true }
        });

        let totalEngagement = 0;
        for (const post of posts) {
            const stats = await prisma.contentStat.findFirst({
                where: { postId: post.id },
                orderBy: { collectedAt: 'desc' }
            });
            if (stats) {
                totalEngagement += (stats.views || 0) + (stats.likes || 0) + (stats.comments || 0);
            }
        }

        // 2. Algorithm
        // Weighting: Revenue (50%), Leads (30%), Posting (10%), Engagement (10%)
        const revScore = (revenueCents / 1000) * 5; // 10€ = 50 pts
        const leadScore = leadsCount * 25; // 1 lead = 25 pts
        const postScore = postsCount * 15; // 1 post = 15 pts
        const engScore = (totalEngagement / 100) * 10; // 100 views/likes = 10 pts

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

        // 5. Calculate Milestones
        const thresholds = [100, 300, 600, 900, 1000];
        const nextMilestone = thresholds.find(t => t > finalScore) || 1000;

        return {
            score: finalScore,
            title,
            rank: rawScore > 0 ? 1 : 0, // In prod, compare with other orgs
            multipliers,
            nextMilestone
        };
    }
}
