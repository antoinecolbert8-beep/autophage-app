import axios from 'axios';
import { generateText } from '@/lib/ai/vertex';

/**
 * TRENDING TOPIC SCRAPER
 * Identifies trending topics from multiple sources to align content with current trends
 */

export interface TrendingTopic {
    topic: string;
    source: 'reddit' | 'linkedin' | 'google_trends' | 'twitter';
    score: number;
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
}

export class TrendingTopicScraper {

    /**
     * Get trending topics from all sources
     */
    static async getTrendingTopics(): Promise<TrendingTopic[]> {
        const topics: TrendingTopic[] = [];

        // Fetch from multiple sources in parallel
        const [redditTopics, googleTrends, twitterTopics] = await Promise.all([
            this.getRedditTrends(),
            this.getGoogleTrends(),
            this.getTwitterTrends()
        ]);

        topics.push(...redditTopics, ...googleTrends, ...twitterTopics);

        // Sort by score
        topics.sort((a, b) => b.score - a.score);

        console.log(`[Trending] Found ${topics.length} trending topics`);
        return topics.slice(0, 10); // Top 10
    }

    /**
     * Reddit Trending (r/entrepreneur, r/SaaS, r/startups)
     */
    private static async getRedditTrends(): Promise<TrendingTopic[]> {
        const subreddits = ['entrepreneur', 'SaaS', 'startups', 'artificial'];
        const topics: TrendingTopic[] = [];

        for (const subreddit of subreddits) {
            try {
                const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`;
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'ELA Trending Bot/1.0'
                    }
                });

                const posts = response.data.data.children;

                for (const post of posts) {
                    const data = post.data;
                    topics.push({
                        topic: data.title,
                        source: 'reddit',
                        score: data.score,
                        keywords: await this.extractKeywords(data.title),
                        sentiment: 'neutral'
                    });
                }
            } catch (error) {
                console.warn(`[Trending] Reddit ${subreddit} scraping failed:`, error);
            }
        }

        return topics;
    }

    /**
     * Google Trends API
     */
    private static async getGoogleTrends(): Promise<TrendingTopic[]> {
        // Using google-trends-api package or similar
        // For MVP, we return simulated data

        const trendingKeywords = [
            'AI automation',
            'ChatGPT business',
            'Lead generation AI',
            'SaaS growth hacks',
            'Marketing automation 2026'
        ];

        return trendingKeywords.map((keyword, idx) => ({
            topic: keyword,
            source: 'google_trends' as const,
            score: 100 - (idx * 10),
            keywords: keyword.split(' '),
            sentiment: 'positive' as const
        }));
    }

    /**
     * Twitter Trending Topics
     */
    private static async getTwitterTrends(): Promise<TrendingTopic[]> {
        const token = process.env.TWITTER_BEARER_TOKEN;

        if (!token) {
            console.warn('[Trending] Twitter token missing');
            return [];
        }

        try {
            // Twitter API v2 - Trending Topics
            const url = 'https://api.twitter.com/2/trends/place.json?id=1'; // Worldwide

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const trends = response.data[0]?.trends || [];

            return trends.slice(0, 10).map((trend: any) => ({
                topic: trend.name,
                source: 'twitter' as const,
                score: trend.tweet_volume || 1000,
                keywords: [trend.name],
                sentiment: 'neutral' as const
            }));

        } catch (error) {
            console.warn('[Trending] Twitter trends failed:', error);
            return [];
        }
    }

    /**
     * Extract keywords from text using AI
     */
    private static async extractKeywords(text: string): Promise<string[]> {
        const prompt = `Extract 3-5 main keywords from this text. Return as comma-separated list:\n\n"${text}"`;

        try {
            const response = await generateText(prompt, { temperature: 0.3 });
            return response.split(',').map(k => k.trim()).filter(k => k.length > 0);
        } catch (error) {
            return [];
        }
    }

    /**
     * Generate content aligned with trending topic
     */
    static async generateTrendingPost(platform: string): Promise<string> {
        const topics = await this.getTrendingTopics();

        if (topics.length === 0) {
            console.warn('[Trending] No topics found, using fallback');
            return "L'IA Agentique transforme le B2B SaaS en 2026";
        }

        const topTopic = topics[0];
        console.log(`[Trending] Using trending topic: ${topTopic.topic}`);

        const { ViralEngine } = await import('@/lib/viral-engine');

        const content = await ViralEngine.generateViralPost({
            topic: `${topTopic.topic} dans le contexte B2B SaaS`,
            platform,
            style: 'educational'
        });

        return content;
    }

    /**
     * Check if our topic aligns with trends
     */
    static async isTopicTrending(topic: string): Promise<boolean> {
        const trends = await this.getTrendingTopics();

        const topicLower = topic.toLowerCase();

        return trends.some(trend => {
            const trendLower = trend.topic.toLowerCase();
            return trendLower.includes(topicLower) || topicLower.includes(trendLower);
        });
    }

    /**
     * Get trending hashtags
     */
    static async getTrendingHashtags(platform: string): Promise<string[]> {
        const topics = await this.getTrendingTopics();

        // Convert topics to hashtags
        const hashtags = topics
            .flatMap(t => t.keywords)
            .filter(k => k.length > 3)
            .map(k => `#${k.replace(/\s+/g, '')}`)
            .slice(0, 10);

        // Add platform-specific trending tags
        const platformTags: Record<string, string[]> = {
            'LINKEDIN': ['#B2B', '#SaaS', '#AI', '#GrowthHacking'],
            'X_PLATFORM': ['#AI', '#Tech', '#BuildInPublic'],
            'INSTAGRAM': ['#entrepreneur', '#startup', '#tech']
        };

        return [...new Set([...hashtags, ...(platformTags[platform] || [])])];
    }
}
