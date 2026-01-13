import { NextRequest, NextResponse } from 'next/server';
import { fetchRedditInsights, fetchHackerNewsInsights, fetchWikipediaData } from '@/lib/data-ingestion';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const topic = searchParams.get('topic');
        const source = searchParams.get('source') || 'all';

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic parameter required' },
                { status: 400 }
            );
        }

        const insights: any = {
            topic,
            sources: {},
        };

        // Reddit insights
        if (source === 'all' || source === 'reddit') {
            insights.sources.reddit = await fetchRedditInsights(topic);
        }

        // Hacker News insights
        if (source === 'all' || source === 'hackernews') {
            insights.sources.hackerNews = await fetchHackerNewsInsights(topic);
        }

        // Wikipedia data
        if (source === 'all' || source === 'wikipedia') {
            insights.sources.wikipedia = await fetchWikipediaData(topic);
        }

        // Analyze sentiment and extract keywords
        const analysis = analyzeInsights(insights);

        return NextResponse.json({
            success: true,
            insights,
            analysis,
        });
    } catch (error) {
        console.error('Error fetching insights:', error);
        return NextResponse.json(
            { error: 'Failed to fetch insights' },
            { status: 500 }
        );
    }
}

function analyzeInsights(insights: any) {
    const redditPosts = insights.sources.reddit || [];
    const hnPosts = insights.sources.hackerNews || [];

    return {
        totalMentions: redditPosts.length + hnPosts.length,
        avgRedditScore: redditPosts.reduce((sum: number, p: any) => sum + p.score, 0) / (redditPosts.length || 1),
        avgHNPoints: hnPosts.reduce((sum: number, p: any) => sum + p.points, 0) / (hnPosts.length || 1),
        trending: redditPosts.length > 10 || hnPosts.length > 5,
        summary: insights.sources.wikipedia?.extract || 'No summary available',
    };
}
