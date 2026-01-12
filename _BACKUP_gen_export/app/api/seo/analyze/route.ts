import { NextRequest, NextResponse } from 'next/server'
import { analyzeKeywords } from '@/lib/ai/vertex'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { projectId, domain, industry } = await request.json()

        if (!projectId || !domain || !industry) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Call Vertex AI to analyze keywords
        const keywordData = await analyzeKeywords(domain, industry)

        if (!Array.isArray(keywordData)) {
            throw new Error('Invalid response from AI')
        }

        // Store in database
        const keywords = await Promise.all(
            keywordData.map((kw: any) =>
                prisma.keywordOpportunity.create({
                    data: {
                        projectId,
                        keyword: kw.keyword,
                        volume: kw.searchVolume,
                        difficulty: kw.difficulty,
                        intent: kw.intent,
                        cluster: kw.cluster,
                        priority: kw.priority,
                        status: 'pending',
                    },
                })
            )
        )

        return NextResponse.json({
            success: true,
            count: keywords.length,
            keywords
        })
    } catch (error) {
        console.error('Error analyzing keywords:', error)
        return NextResponse.json(
            { error: 'Failed to analyze keywords' },
            { status: 500 }
        )
    }
}
