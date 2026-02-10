import { db as prisma } from "@/core/db";

/**
 * FREQUENCY OPTIMIZER
 * Dynamically adjusts posting frequency based on engagement performance
 */

export class FrequencyOptimizer {

    // Optimal frequencies per platform (posts per day)
    private static BASE_FREQUENCIES: Record<string, number> = {
        'LINKEDIN': 2,      // 2x/day for B2B
        'X_PLATFORM': 5,    // 5x/day for Twitter
        'INSTAGRAM': 1.5,   // 1-2x/day
        'FACEBOOK': 1,      // 1x/day
        'SNAPCHAT': 3       // 3x/day for stories
    };

    /**
     * Get optimal posting frequency for platform based on performance
     */
    static async getOptimalFrequency(platform: string): Promise<number> {
        const baseFreq = this.BASE_FREQUENCIES[platform] || 1;

        // Analyze recent performance
        const performance = await this.analyzePerformance(platform);

        // Adjust based on engagement
        let multiplier = 1.0;

        if (performance.avgEngagementRate > 5) {
            multiplier = 1.5; // Increase frequency if high engagement
        } else if (performance.avgEngagementRate < 2) {
            multiplier = 0.7; // Decrease if low engagement
        }

        const optimized = Math.round(baseFreq * multiplier * 10) / 10;
        console.log(`[Frequency] ${platform}: ${baseFreq} → ${optimized} posts/day (${performance.avgEngagementRate}% engagement)`);

        return optimized;
    }

    /**
     * Analyze recent performance metrics
     */
    private static async analyzePerformance(platform: string): Promise<{
        avgEngagementRate: number;
        avgScore: number;
        totalPosts: number;
    }> {
        const recentPosts = await prisma.post.findMany({
            where: {
                platform,
                publishedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                },
                status: 'published'
            }
        });

        if (recentPosts.length === 0) {
            return { avgEngagementRate: 0, avgScore: 0, totalPosts: 0 };
        }

        // Calculate from ContentStats
        const stats = await prisma.contentStat.findMany({
            where: {
                postId: {
                    in: recentPosts.map(p => p.id)
                }
            }
        });

        const totalEngagement = stats.reduce((sum, s) => sum + s.likes + s.comments + s.shares, 0);
        const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
        const avgEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

        const avgScore = recentPosts.reduce((sum, p) => sum + p.performance_score, 0) / recentPosts.length;

        return {
            avgEngagementRate,
            avgScore,
            totalPosts: recentPosts.length
        };
    }

    /**
     * Get optimal posting times for platform
     */
    static getOptimalTimes(platform: string): number[] {
        // Already defined in self-promotion.ts, but can be enhanced here
        const optimalHours: Record<string, number[]> = {
            'LINKEDIN': [8, 9, 12, 17],      // Morning, lunch, evening commute
            'X_PLATFORM': [9, 13, 15, 18, 21], // Multiple times throughout day
            'INSTAGRAM': [11, 13, 19],       // Lunch, afternoon, evening
            'FACEBOOK': [12, 15, 18],        // Lunch, afternoon, evening
            'SNAPCHAT': [16, 20, 22]         // After school/work
        };

        return optimalHours[platform] || [9, 14, 19];
    }

    /**
     * Calculate how many posts to schedule today
     */
    static async getPostsToScheduleToday(platform: string): Promise<number> {
        const frequency = await this.getOptimalFrequency(platform);

        // Check how many already posted today
        const postsToday = await prisma.post.count({
            where: {
                platform,
                publishedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                },
                status: 'published'
            }
        });

        const remaining = Math.ceil(frequency) - postsToday;
        return Math.max(0, remaining);
    }

    /**
     * Schedule posts at optimal times
     */
    static async scheduleOptimalPosts(platform: string): Promise<Date[]> {
        const postsNeeded = await this.getPostsToScheduleToday(platform);
        const optimalHours = this.getOptimalTimes(platform);

        const scheduledTimes: Date[] = [];
        const now = new Date();

        for (let i = 0; i < postsNeeded; i++) {
            const hourIndex = i % optimalHours.length;
            const hour = optimalHours[hourIndex];

            const scheduleTime = new Date();
            scheduleTime.setUTCHours(hour, 0, 0, 0);

            // If time has passed today, don't schedule
            if (scheduleTime > now) {
                scheduledTimes.push(scheduleTime);
            }
        }

        console.log(`[Frequency] Scheduled ${scheduledTimes.length} posts for ${platform}`);
        return scheduledTimes;
    }
}
