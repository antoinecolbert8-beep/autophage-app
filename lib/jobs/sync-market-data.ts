import { prisma } from '@/lib/prisma';
import { fetchRedditInsights, fetchHackerNewsInsights, popularKeywordsDataset } from '@/lib/data-ingestion';

// Background job to sync market data
export async function syncMarketData(organizationId: string) {
    console.log(`Starting market data sync for org: ${organizationId}`);

    try {
        // 1. Import public keyword dataset
        const projects = await prisma.project.findMany({
            where: { organizationId },
        });

        for (const project of projects) {
            // Add popular keywords related to project industry
            const relevantKeywords = popularKeywordsDataset.filter(kw =>
                Math.random() > 0.7 // Random sampling for demo
            );

            for (const kw of relevantKeywords) {
                await prisma.keywordOpportunity.upsert({
                    where: {
                        // Use a composite unique key
                        id: `${project.id}-${kw.keyword}`,
                    },
                    create: {
                        projectId: project.id,
                        keyword: kw.keyword,
                        volume: kw.volume,
                        difficulty: kw.difficulty,
                        intent: kw.intent,
                        cluster: categorizeKeyword(kw.keyword),
                        priority: calculatePriority(kw.volume, kw.difficulty),
                        status: 'pending',
                    },
                    update: {
                        volume: kw.volume,
                        difficulty: kw.difficulty,
                    },
                });
            }
        }

        // 2. Fetch trending topics from Reddit
        const trendingTopics = ['saas', 'marketing automation', 'ai tools', 'seo'];
        for (const topic of trendingTopics) {
            const redditData = await fetchRedditInsights(topic);
            const hnData = await fetchHackerNewsInsights(topic);

            // Store in analytics
            await prisma.analyticsSnapshot.create({
                data: {
                    organizationId,
                    period: 'daily',
                    timestamp: new Date(),
                    metrics: JSON.stringify({
                        topic,
                        redditMentions: redditData.length,
                        hnMentions: hnData.length,
                        trending: redditData.length > 10,
                    }),
                },
            });
        }

        console.log('Market data sync completed');
        return { success: true };
    } catch (error) {
        console.error('Error syncing market data:', error);
        return { success: false, error };
    }
}

function categorizeKeyword(keyword: string): string {
    if (keyword.includes('marketing') || keyword.includes('email')) return 'Marketing';
    if (keyword.includes('seo') || keyword.includes('content')) return 'SEO';
    if (keyword.includes('ai') || keyword.includes('automation')) return 'AI & Automation';
    if (keyword.includes('ecommerce') || keyword.includes('shopify')) return 'E-commerce';
    if (keyword.includes('crm') || keyword.includes('software')) return 'SaaS Tools';
    return 'General';
}

function calculatePriority(volume: number, difficulty: number): number {
    const volumeScore = Math.min(volume / 1000, 50);
    const difficultyScore = (100 - difficulty) / 2;
    return Math.min(Math.round(volumeScore + difficultyScore), 100);
}

// Run sync on a schedule (this would be called by a cron job)
export async function runDailySync() {
    const orgs = await prisma.organization.findMany({
        where: { status: 'active' },
    });

    for (const org of orgs) {
        await syncMarketData(org.id);
    }
}
