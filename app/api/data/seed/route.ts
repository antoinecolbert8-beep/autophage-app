import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { popularKeywordsDataset } from '@/lib/data-ingestion';

// Seed database with public SEO dataset
export async function POST(request: NextRequest) {
    try {
        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID required' },
                { status: 400 }
            );
        }

        // Import popular keywords dataset
        const keywords = await Promise.all(
            popularKeywordsDataset.map((kw) =>
                prisma.keywordOpportunity.create({
                    data: {
                        projectId,
                        keyword: kw.keyword,
                        volume: kw.volume,
                        difficulty: kw.difficulty,
                        intent: kw.intent,
                        cluster: categorizeKeyword(kw.keyword),
                        priority: calculatePriority(kw.volume, kw.difficulty),
                        status: 'pending',
                    },
                })
            )
        );

        return NextResponse.json({
            success: true,
            imported: keywords.length,
            message: `${keywords.length} keywords imported from public dataset`,
        });
    } catch (error) {
        console.error('Error seeding data:', error);
        return NextResponse.json(
            { error: 'Failed to seed database' },
            { status: 500 }
        );
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
    // Higher volume + lower difficulty = higher priority
    const volumeScore = Math.min(volume / 1000, 50);
    const difficultyScore = (100 - difficulty) / 2;
    return Math.min(Math.round(volumeScore + difficultyScore), 100);
}
