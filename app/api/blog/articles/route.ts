import { NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/articles
 * Returns all published articles for public blog
 */
export async function GET() {
    try {
        const articles = await prisma.contentAsset.findMany({
            where: {
                publishedAt: {
                    not: null
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                metaDescription: true,
                publishedAt: true,
                wordCount: true,
                semanticScore: true
            },
            orderBy: {
                publishedAt: 'desc'
            },
            take: 50
        });

        return NextResponse.json({
            success: true,
            articles
        });

    } catch (error: any) {
        console.error('Blog API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
