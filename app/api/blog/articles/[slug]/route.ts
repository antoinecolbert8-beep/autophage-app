import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/blog/articles/[slug]
 * Returns individual article by slug
 */
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const article = await prisma.contentAsset.findFirst({
            where: {
                slug: params.slug,
                publishedAt: {
                    not: null
                }
            },
            select: {
                title: true,
                content: true,
                metaDescription: true,
                publishedAt: true,
                wordCount: true
            }
        });

        if (!article) {
            return NextResponse.json({
                success: false,
                error: 'Article not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            article
        });

    } catch (error: any) {
        console.error('Blog article API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
