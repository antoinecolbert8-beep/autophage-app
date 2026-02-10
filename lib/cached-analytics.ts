import { Cache, CacheKeys, CacheTTL } from './cache';
import { db as prisma } from "@/core/db";

/**
 * CACHED ANALYTICS
 * High-performance analytics with Redis caching
 */

export class CachedAnalytics {

    /**
     * Get user analytics with caching
     */
    static async getUserAnalytics(userId: string, timeframe: '7d' | '30d' | '90d' = '7d') {
        return Cache.getOrSet(
            CacheKeys.analytics(userId, timeframe),
            async () => {
                console.log(`[Analytics] Fetching fresh data for user ${userId}`);

                const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
                const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

                // Get user to find organizationId
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { organizationId: true }
                });

                if (!user) throw new Error('User not found');
                const orgId = user.organizationId;

                // Posts published
                const postsCount = await prisma.post.count({
                    where: {
                        userId,
                        publishedAt: { gte: since },
                        status: 'published'
                    }
                });

                // Get posts for stats aggregation
                const posts = await prisma.post.findMany({
                    where: {
                        userId,
                        publishedAt: { gte: since },
                        status: 'published'
                    },
                    select: { id: true, performance_score: true, platform: true, content: true }
                });

                // Total engagement from ContentStat
                let totalEngagement = 0;
                for (const post of posts) {
                    const stats = await prisma.contentStat.findFirst({
                        where: { postId: post.id },
                        orderBy: { collectedAt: 'desc' }
                    });
                    if (stats) {
                        totalEngagement += (stats.views || 0) + (stats.likes || 0) + (stats.comments || 0) + (stats.shares || 0);
                    }
                }

                // Leads generated (filtered by organizationId)
                const leadsCount = await prisma.lead.count({
                    where: {
                        organizationId: orgId,
                        createdAt: { gte: since }
                    }
                });

                // Hot leads
                const hotLeadsCount = await prisma.lead.count({
                    where: {
                        organizationId: orgId,
                        createdAt: { gte: since },
                        score: { gte: 70 }
                    }
                });

                // Revenue from TreasuryLedger (type REVENUE_IN)
                const ledgerEntries = await prisma.treasuryLedger.findMany({
                    where: {
                        createdAt: { gte: since },
                        type: 'REVENUE_IN'
                    },
                    select: { amount_cents: true }
                });

                const totalRevenue = ledgerEntries.reduce((sum, entry) => sum + (entry.amount_cents || 0), 0) / 100;

                // Top performing post
                const topPost = posts.length > 0
                    ? posts.reduce((prev, current) => (prev.performance_score > current.performance_score) ? prev : current)
                    : null;

                let topPostWithStats = null;
                if (topPost) {
                    const stats = await prisma.contentStat.findFirst({
                        where: { postId: topPost.id },
                        orderBy: { collectedAt: 'desc' }
                    });
                    topPostWithStats = {
                        ...topPost,
                        views: stats?.views || 0,
                        likes: stats?.likes || 0
                    };
                }

                return {
                    timeframe,
                    postsPublished: postsCount,
                    totalEngagement,
                    leadsGenerated: leadsCount,
                    hotLeads: hotLeadsCount,
                    revenue: totalRevenue,
                    topPost: topPostWithStats,
                    avgPerformanceScore: posts.length > 0
                        ? posts.reduce((sum, p) => sum + (p.performance_score || 0), 0) / posts.length
                        : 0
                };
            },
            CacheTTL.MEDIUM // 5 minutes
        );
    }

    /**
     * Get post metrics with caching
     */
    static async getPostMetrics(postId: string) {
        return Cache.getOrSet(
            CacheKeys.postMetrics(postId),
            async () => {
                const post = await prisma.post.findUnique({
                    where: { id: postId },
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                });

                if (!post) return null;

                const stats = await prisma.contentStat.findFirst({
                    where: { postId: post.id },
                    orderBy: { collectedAt: 'desc' }
                });

                return {
                    id: post.id,
                    platform: post.platform,
                    content: post.content,
                    views: stats?.views || 0,
                    likes: stats?.likes || 0,
                    comments: stats?.comments || 0,
                    shares: stats?.shares || 0,
                    performanceScore: post.performance_score || 0,
                    publishedAt: post.publishedAt,
                    author: post.user?.name
                };
            },
            CacheTTL.LONG // 30 minutes
        );
    }

    /**
     * Get platform-wide metrics
     */
    static async getPlatformMetrics(platform: string) {
        return Cache.getOrSet(
            CacheKeys.platformMetrics(platform),
            async () => {
                const posts = await prisma.post.findMany({
                    where: {
                        platform,
                        status: 'published',
                        publishedAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    },
                    select: {
                        id: true,
                        performance_score: true
                    }
                });

                let totalViews = 0;
                let totalLikes = 0;
                for (const post of posts) {
                    const stats = await prisma.contentStat.findFirst({
                        where: { postId: post.id },
                        orderBy: { collectedAt: 'desc' }
                    });
                    if (stats) {
                        totalViews += (stats.views || 0);
                        totalLikes += (stats.likes || 0);
                    }
                }

                const totalPosts = posts.length;
                const avgScore = totalPosts > 0
                    ? posts.reduce((sum, p) => sum + (p.performance_score || 0), 0) / totalPosts
                    : 0;

                return {
                    platform,
                    totalPosts,
                    totalViews,
                    totalLikes,
                    avgPerformanceScore: avgScore,
                    engagementRate: totalViews > 0 ? (totalLikes / totalViews) * 100 : 0
                };
            },
            CacheTTL.MEDIUM
        );
    }

    /**
     * Invalidate user cache
     */
    static async invalidateUserCache(userId: string) {
        await Cache.deletePattern(`analytics:${userId}:*`);
        await Cache.deletePattern(`user:${userId}:*`);
        console.log(`[Analytics] Invalidated cache for user ${userId}`);
    }

    /**
     * Invalidate post cache
     */
    static async invalidatePostCache(postId: string) {
        await Cache.delete(CacheKeys.postMetrics(postId));
        console.log(`[Analytics] Invalidated cache for post ${postId}`);
    }
}
