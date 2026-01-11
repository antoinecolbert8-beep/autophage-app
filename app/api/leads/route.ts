import { NextRequest, NextResponse } from 'next/server'
import { scoreLeadQuality } from '@/lib/ai/vertex'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { organizationId, email, name, company, industry } = await request.json()

        if (!organizationId || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Score the lead using AI
        const scoreData = await scoreLeadQuality({
            email,
            company,
            industry,
        })

        // Create lead in database
        const lead = await prisma.lead.create({
            data: {
                organizationId,
                email,
                name,
                company,
                score: scoreData.totalScore,
                scoreBreakdown: JSON.stringify(scoreData),
                stage: scoreData.totalScore > 70 ? 'hot' : scoreData.totalScore > 40 ? 'warm' : 'cold',
            },
        })

        return NextResponse.json({
            success: true,
            lead,
            scoreData
        })
    } catch (error) {
        console.error('Error creating lead:', error)
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const organizationId = searchParams.get('organizationId')

        if (!organizationId) {
            return NextResponse.json(
                { error: 'Missing organizationId' },
                { status: 400 }
            )
        }

        const leads = await prisma.lead.findMany({
            where: { organizationId },
            include: {
                touchpoints: { take: 5, orderBy: { createdAt: 'desc' } },
                conversions: true,
            },
            orderBy: { score: 'desc' },
            take: 100,
        })

        return NextResponse.json({ leads })
    } catch (error) {
        console.error('Error fetching leads:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        )
    }
}
