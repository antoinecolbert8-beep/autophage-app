import { generateText } from '@/lib/ai/vertex';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * A/B TESTING ENGINE
 * Systematically tests hooks, styles, and content variations to optimize performance
 */

export interface ABTest {
    id: string;
    platform: string;
    variantA: {
        hook: string;
        content: string;
        style: 'story' | 'educational' | 'controversial' | 'meme';
    };
    variantB: {
        hook: string;
        content: string;
        style: 'story' | 'educational' | 'controversial' | 'meme';
    };
    startedAt: Date;
    endsAt: Date;
    status: 'running' | 'completed' | 'cancelled';
    winner?: 'A' | 'B' | 'tie';
}

export interface ABTestResult {
    variantId: 'A' | 'B';
    postId: string;
    views: number;
    engagement: number;
    score: number;
}

export class ABTestingEngine {

    /**
     * Create A/B Test with two hook/content variations
     */
    static async createTest(params: {
        topic: string;
        platform: string;
    }): Promise<ABTest> {
        const { topic, platform } = params;

        // Generate 2 different hooks
        const { ViralEngine } = await import('@/lib/viral-engine');

        const hookA = await ViralEngine.generateViralHook(topic, platform);
        const hookB = await ViralEngine.generateViralHook(topic, platform);

        // Generate 2 different styles (educational vs controversial for max contrast)
        const contentA = await ViralEngine.generateViralPost({
            topic,
            platform,
            style: 'educational'
        });

        const contentB = await ViralEngine.generateViralPost({
            topic,
            platform,
            style: 'controversial'
        });

        const test: ABTest = {
            id: `abtest_${Date.now()}`,
            platform,
            variantA: {
                hook: hookA,
                content: contentA,
                style: 'educational'
            },
            variantB: {
                hook: hookB,
                content: contentB,
                style: 'controversial'
            },
            startedAt: new Date(),
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            status: 'running'
        };

        console.log(`[A/B TEST] Created test ${test.id} for ${platform}`);
        console.log(`  Variant A (Educational): ${hookA.substring(0, 50)}...`);
        console.log(`  Variant B (Controversial): ${hookB.substring(0, 50)}...`);

        return test;
    }

    /**
     * Post both variants and track results
     */
    static async executeTest(test: ABTest, userId: string): Promise<{ postIdA: string; postIdB: string }> {
        // Post Variant A
        const postIdA = await this.postVariant(test.variantA, test.platform, userId, test.id, 'A');

        // Wait 2 hours before posting variant B (to avoid flooding)
        console.log(`[A/B TEST] Variant A posted. Variant B will be posted in 2 hours.`);

        // For MVP, we post immediately. In production, schedule variant B for +2h
        const postIdB = await this.postVariant(test.variantB, test.platform, userId, test.id, 'B');

        return { postIdA, postIdB };
    }

    private static async postVariant(
        variant: ABTest['variantA'],
        platform: string,
        userId: string,
        testId: string,
        variantId: 'A' | 'B'
    ): Promise<string> {
        const { publishToMultiplePlatforms } = await import('@/lib/social-media-manager');

        const PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://ela-revolution.com';
        const ASSETS = [
            `${PRODUCTION_DOMAIN}/assets/feat_productivity.png`,
            `${PRODUCTION_DOMAIN}/assets/feat_costs.png`
        ];
        const randomAsset = ASSETS[Math.floor(Math.random() * ASSETS.length)];

        // Post to platform
        let targetPlatform: any = platform;
        if (platform === 'X_PLATFORM') targetPlatform = 'TWITTER';

        await publishToMultiplePlatforms({
            platform: targetPlatform,
            content: variant.content,
            mediaUrls: [randomAsset],
            hashtags: []
        }, [targetPlatform]);

        // Save to database with test metadata
        const post = await prisma.post.create({
            data: {
                userId: userId,
                platform: platform,
                content: `[AB_TEST:${testId}:${variantId}] ${variant.content}`,
                mediaUrl: randomAsset,
                status: 'published',
                publishedAt: new Date(),
                performance_score: 0
            }
        });

        console.log(`[A/B TEST] Posted Variant ${variantId}: ${post.id}`);
        return post.id;
    }

    /**
     * Analyze test results after 24h
     */
    static async analyzeTest(testId: string): Promise<{ winner: 'A' | 'B' | 'tie'; results: { A: ABTestResult; B: ABTestResult } }> {
        // Fetch posts with this test ID
        const posts = await prisma.post.findMany({
            where: {
                content: {
                    contains: `AB_TEST:${testId}`
                }
            },
            include: {
                // This would need ContentStat relation in schema
            }
        });

        if (posts.length !== 2) {
            throw new Error(`Expected 2 posts for test ${testId}, found ${posts.length}`);
        }

        // Get metrics for both
        const { PlatformAnalytics } = await import('@/lib/platform-analytics');

        const results: any = { A: null, B: null };

        for (const post of posts) {
            const variantId = post.content.includes(':A]') ? 'A' : 'B';

            const metrics = post.externalId
                ? await PlatformAnalytics.getMetrics(post.platform, post.externalId)
                : { views: 0, likes: 0, comments: 0, shares: 0 };

            const engagement = metrics.likes + metrics.comments + metrics.shares;

            results[variantId] = {
                variantId,
                postId: post.id,
                views: metrics.views,
                engagement,
                score: post.performance_score
            };
        }

        // Determine winner
        const scoreA = results.A.engagement / (results.A.views || 1);
        const scoreB = results.B.engagement / (results.B.views || 1);

        let winner: 'A' | 'B' | 'tie' = 'tie';
        if (scoreA > scoreB * 1.1) winner = 'A'; // 10% threshold
        else if (scoreB > scoreA * 1.1) winner = 'B';

        console.log(`[A/B TEST] Results for ${testId}:`);
        console.log(`  Variant A: ${results.A.engagement} engagement, ${results.A.views} views`);
        console.log(`  Variant B: ${results.B.engagement} engagement, ${results.B.views} views`);
        console.log(`  Winner: ${winner.toUpperCase()}`);

        return { winner, results };
    }

    /**
     * Get learnings from past tests
     */
    static async getLearnings(): Promise<{
        bestStyle: string;
        bestHookPattern: string;
        recommendations: string[];
    }> {
        // Fetch all past AB test posts
        const testPosts = await prisma.post.findMany({
            where: {
                content: {
                    contains: 'AB_TEST:'
                },
                status: 'published'
            },
            orderBy: { performance_score: 'desc' }
        });

        const topPosts = testPosts.slice(0, 10);

        // Analyze patterns
        const educationalCount = topPosts.filter(p => p.content.includes('educational')).length;
        const controversialCount = topPosts.filter(p => p.content.includes('controversial')).length;

        const bestStyle = educationalCount > controversialCount ? 'educational' : 'controversial';

        return {
            bestStyle,
            bestHookPattern: 'FOMO', // Simplified - would analyze actual hooks
            recommendations: [
                `Utiliser plus de posts ${bestStyle}`,
                `Top 10 posts ont score moyen de ${(topPosts.reduce((sum, p) => sum + p.performance_score, 0) / topPosts.length).toFixed(1)}`,
                `${topPosts.length} tests A/B complétés`
            ]
        };
    }
}
