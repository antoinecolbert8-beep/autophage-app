import axios from 'axios';

/**
 * PLATFORM ANALYTICS - Real-time Metrics Collection
 * Replaces Math.random() simulations with actual API calls
 */

export interface PostMetrics {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    clicks?: number;
    engagementRate?: number;
}

export class PlatformAnalytics {

    /**
     * LINKEDIN ANALYTICS
     */
    static async getLinkedInMetrics(postUrn: string): Promise<PostMetrics> {
        const token = process.env.LINKEDIN_ACCESS_TOKEN;

        if (!token) {
            console.warn('[Analytics] LinkedIn token missing, returning zeros');
            return this.getZeroMetrics();
        }

        try {
            // LinkedIn Analytics API
            const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/statistics`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            const totalShares = data.totalShareStatistics?.shareCount || 0;
            const likes = data.totalLikeStatistics?.likedByCurrentUser ? 1 : 0; // Simplified
            const comments = data.totalCommentStatistics?.totalComments || 0;

            // LinkedIn doesn't directly expose impression count without Campaign Manager
            // For organic posts, we estimate based on network size
            const estimatedViews = (totalShares + likes + comments) * 10; // Conservative multiplier

            return {
                views: estimatedViews,
                likes: data.totalLikeStatistics?.totalLikes || 0,
                comments: comments,
                shares: totalShares,
                clicks: data.totalClickStatistics?.clicks || 0,
                engagementRate: this.calculateEngagement(estimatedViews, likes + comments + totalShares)
            };

        } catch (error: any) {
            console.error('[Analytics] LinkedIn API error:', error.response?.data || error.message);
            return this.getZeroMetrics();
        }
    }

    /**
     * TWITTER/X ANALYTICS
     */
    static async getTwitterMetrics(tweetId: string): Promise<PostMetrics> {
        const token = process.env.TWITTER_BEARER_TOKEN;

        if (!token) {
            console.warn('[Analytics] Twitter token missing, returning zeros');
            return this.getZeroMetrics();
        }

        try {
            // Twitter API v2 - Tweet Metrics
            const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const metrics = response.data.data.public_metrics;

            return {
                views: metrics.impression_count || 0,
                likes: metrics.like_count || 0,
                comments: metrics.reply_count || 0,
                shares: metrics.retweet_count + (metrics.quote_count || 0),
                clicks: 0, // Requires Analytics API tier
                engagementRate: this.calculateEngagement(
                    metrics.impression_count,
                    metrics.like_count + metrics.reply_count + metrics.retweet_count
                )
            };

        } catch (error: any) {
            console.error('[Analytics] Twitter API error:', error.response?.data || error.message);
            return this.getZeroMetrics();
        }
    }

    /**
     * META (FACEBOOK/INSTAGRAM) ANALYTICS
     */
    static async getMetaMetrics(postId: string, platform: 'facebook' | 'instagram'): Promise<PostMetrics> {
        const token = process.env.FB_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!token) {
            console.warn('[Analytics] Meta token missing, returning zeros');
            return this.getZeroMetrics();
        }

        try {
            // Meta Graph API - Post Insights
            const fields = platform === 'instagram'
                ? 'impressions,reach,engagement,likes,comments,shares,saved'
                : 'impressions,reactions,comments,shares';

            const url = `https://graph.facebook.com/v18.0/${postId}/insights?metric=${fields}&access_token=${token}`;

            const response = await axios.get(url);
            const insights = response.data.data;

            // Parse insights (format varies)
            const metrics: any = {};
            insights.forEach((insight: any) => {
                metrics[insight.name] = insight.values[0].value;
            });

            return {
                views: metrics.impressions || metrics.reach || 0,
                likes: metrics.likes || metrics.reactions || 0,
                comments: metrics.comments || 0,
                shares: metrics.shares || 0,
                saves: metrics.saved || 0,
                engagementRate: this.calculateEngagement(
                    metrics.impressions || metrics.reach,
                    (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
                )
            };

        } catch (error: any) {
            console.error('[Analytics] Meta API error:', error.response?.data || error.message);
            return this.getZeroMetrics();
        }
    }

    /**
     * UNIFIED METRICS FETCHER
     */
    static async getMetrics(platform: string, postId: string): Promise<PostMetrics> {
        switch (platform.toUpperCase()) {
            case 'LINKEDIN':
                return this.getLinkedInMetrics(postId);
            case 'TWITTER':
            case 'X_PLATFORM':
                return this.getTwitterMetrics(postId);
            case 'FACEBOOK':
                return this.getMetaMetrics(postId, 'facebook');
            case 'INSTAGRAM':
                return this.getMetaMetrics(postId, 'instagram');
            default:
                console.warn(`[Analytics] Unsupported platform: ${platform}`);
                return this.getZeroMetrics();
        }
    }

    /**
     * UTILITIES
     */
    private static calculateEngagement(views: number, interactions: number): number {
        if (views === 0) return 0;
        return (interactions / views) * 100;
    }

    private static getZeroMetrics(): PostMetrics {
        return {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            saves: 0,
            clicks: 0,
            engagementRate: 0
        };
    }

    /**
     * BATCH FETCH FOR MULTIPLE POSTS
     */
    static async batchFetchMetrics(posts: Array<{ platform: string; externalId: string; id: string }>): Promise<Map<string, PostMetrics>> {
        const results = new Map<string, PostMetrics>();

        // Process in parallel but with rate limiting
        const chunks = this.chunk(posts, 5); // 5 concurrent requests max

        for (const chunk of chunks) {
            const promises = chunk.map(async (post) => {
                if (!post.externalId) return;
                const metrics = await this.getMetrics(post.platform, post.externalId);
                results.set(post.id, metrics);
            });

            await Promise.all(promises);

            // Rate limit: wait 1s between batches
            if (chunks.indexOf(chunk) < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    }

    private static chunk<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
