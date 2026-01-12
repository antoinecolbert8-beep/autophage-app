import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAuthorityContent, createContentAsset } from '@/lib/content/authority-engine';

export async function POST(request: NextRequest) {
    try {
        const { projectId, keyword, wordCount, leadPersona } = await request.json();

        if (!projectId || !keyword) {
            return NextResponse.json(
                { error: 'projectId and keyword required' },
                { status: 400 }
            );
        }

        console.log(`🚀 Generating authority content for: ${keyword}`);

        // Generate content using multi-perspective synthesis
        const contentData = await createContentAsset(projectId, keyword, wordCount || 1500);

        // Store in database
        const contentAsset = await prisma.contentAsset.create({
            data: contentData,
        });

        return NextResponse.json({
            success: true,
            content: contentAsset,
            message: `Authority content generated: ${contentAsset.wordCount} words`,
        });
    } catch (error) {
        console.error('Error generating content:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}

// Get content assets for a project
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json(
                { error: 'projectId required' },
                { status: 400 }
            );
        }

        const contents = await prisma.contentAsset.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ contents });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}
