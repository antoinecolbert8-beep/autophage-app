import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1. Fetch Recent Posts
        const posts = await prisma.post.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // 2. Fetch ContentStats
        const postIds = posts.map(p => p.id);
        const stats = await prisma.contentStat.findMany({
            where: { postId: { in: postIds } },
            orderBy: { collectedAt: 'desc' }
        });

        // 3. Calculate Aggregates
        const totalPosts = posts.length;
        const publishedPosts = posts.filter(p => p.status === 'published');
        const avgScore = publishedPosts.length > 0
            ? publishedPosts.reduce((sum, p) => sum + p.performance_score, 0) / publishedPosts.length
            : 0;

        const totalEngagement = stats.reduce((sum, s) => sum + s.likes + s.comments + s.shares, 0);
        const totalViews = stats.reduce((sum, s) => sum + s.views, 0);

        // 4. Platform Breakdown
        const platformStats = publishedPosts.reduce((acc, post) => {
            if (!acc[post.platform]) {
                acc[post.platform] = { count: 0, totalScore: 0, avgScore: 0 };
            }
            acc[post.platform].count++;
            acc[post.platform].totalScore += post.performance_score;
            return acc;
        }, {} as Record<string, { count: number; totalScore: number; avgScore: number }>);

        Object.keys(platformStats).forEach(platform => {
            platformStats[platform].avgScore = platformStats[platform].totalScore / platformStats[platform].count;
        });

        // 5. AI Recommendations
        const recommendations = await generateRecommendations(posts, stats);

        // 6. Combine posts with their stats
        const postsWithStats = posts.map(post => {
            const postStats = stats.filter(s => s.postId === post.id);
            const latestStat = postStats[0];

            return {
                ...post,
                metrics: latestStat ? {
                    views: latestStat.views,
                    likes: latestStat.likes,
                    comments: latestStat.comments,
                    shares: latestStat.shares,
                    saves: latestStat.saves,
                    clicks: latestStat.clicks
                } : null
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                posts: postsWithStats,
                summary: {
                    totalPosts,
                    published: publishedPosts.length,
                    failed: posts.filter(p => p.status === 'failed').length,
                    avgScore: Math.round(avgScore * 10) / 10,
                    totalEngagement,
                    totalViews
                },
                platformBreakdown: platformStats,
                recommendations
            }
        });

    } catch (error) {
        console.error('[Analytics API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

/**
 * Generate AI-powered recommendations based on performance patterns
 */
async function generateRecommendations(posts: any[], stats: any[]): Promise<string[]> {
    const recommendations: string[] = [];

    // 1. Best Performing Platform
    const platformScores: Record<string, number[]> = {};
    posts.filter(p => p.status === 'published').forEach(post => {
        if (!platformScores[post.platform]) platformScores[post.platform] = [];
        platformScores[post.platform].push(post.performance_score);
    });

    const platformAvgs = Object.entries(platformScores).map(([platform, scores]) => ({
        platform,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length
    })).sort((a, b) => b.avg - a.avg);

    if (platformAvgs.length > 0) {
        recommendations.push(`🏆 Meilleure plateforme: ${platformAvgs[0].platform} (Score moyen: ${platformAvgs[0].avg.toFixed(1)})`);
    }

    // 2. Timing Analysis
    const hourlyPerformance: Record<number, number[]> = {};
    posts.filter(p => p.publishedAt).forEach(post => {
        const hour = new Date(post.publishedAt).getUTCHours();
        if (!hourlyPerformance[hour]) hourlyPerformance[hour] = [];
        hourlyPerformance[hour].push(post.performance_score);
    });

    const bestHour = Object.entries(hourlyPerformance)
        .map(([hour, scores]) => ({
            hour: parseInt(hour),
            avg: scores.reduce((a, b) => a + b, 0) / scores.length
        }))
        .sort((a, b) => b.avg - a.avg)[0];

    if (bestHour) {
        recommendations.push(`⏰ Meilleure heure: ${bestHour.hour}:00 UTC (Score: ${bestHour.avg.toFixed(1)})`);
    }

    // 3. Engagement Trend
    const recentStats = stats.slice(0, 10);
    const olderStats = stats.slice(10, 20);
    if (recentStats.length > 0 && olderStats.length > 0) {
        const recentEngagement = recentStats.reduce((sum, s) => sum + s.likes + s.comments, 0) / recentStats.length;
        const olderEngagement = olderStats.reduce((sum, s) => sum + s.likes + s.comments, 0) / olderStats.length;

        if (recentEngagement > olderEngagement * 1.2) {
            recommendations.push(`📈 Engagement en hausse: +${Math.round((recentEngagement / olderEngagement - 1) * 100)}%`);
        } else if (recentEngagement < olderEngagement * 0.8) {
            recommendations.push(`⚠️ Engagement en baisse: ${Math.round((1 - recentEngagement / olderEngagement) * 100)}%. Considérer de nouveaux angles de contenu.`);
        }
    }

    // 4. Low Performance Warning
    const lowScorePosts = posts.filter(p => p.performance_score > 0 && p.performance_score < 50);
    if (lowScorePosts.length > posts.length * 0.3) {
        recommendations.push(`⚠️ ${lowScorePosts.length} posts avec score < 50. Optimiser le timing et la qualité du contenu.`);
    }

    // 5. Content Length Analysis
    const shortPosts = posts.filter(p => p.content && p.content.length < 200);
    const longPosts = posts.filter(p => p.content && p.content.length > 500);
    const shortAvg = shortPosts.reduce((sum, p) => sum + p.performance_score, 0) / (shortPosts.length || 1);
    const longAvg = longPosts.reduce((sum, p) => sum + p.performance_score, 0) / (longPosts.length || 1);

    if (longAvg > shortAvg * 1.3) {
        recommendations.push(`📝 Les posts longs (>500 chars) performent mieux (+${Math.round((longAvg / shortAvg - 1) * 100)}%)`);
    }

    return recommendations;
}
