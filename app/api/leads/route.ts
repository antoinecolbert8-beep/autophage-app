import { NextRequest, NextResponse } from 'next/server'
import { scoreLeadQuality } from '@/lib/ai/vertex'
import { prisma } from '@/lib/prisma'
import { PrivacyShield } from '@/lib/security/privacy'

export async function POST(request: NextRequest) {
    try {
        const { organizationId, email, name, company, industry, phone } = await request.json()

        if (!organizationId || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 🛡️ [GDPR] Protect PII
        const protectedEmail = await PrivacyShield.protect(email);
        const protectedName = name ? await PrivacyShield.protect(name) : null;
        const protectedPhone = phone ? await PrivacyShield.protect(phone) : null;

        // Score the lead using AI (we use the RAW data for AI)
        const scoreData = await scoreLeadQuality({
            email,
            company,
            industry,
        })

        // Create lead in database
        const lead = await prisma.lead.create({
            data: {
                organizationId,
                email: protectedEmail,
                name: protectedName,
                phone: protectedPhone,
                company,
                score: scoreData.totalScore,
                scoreBreakdown: JSON.stringify(scoreData),
                stage: scoreData.totalScore > 70 ? 'hot' : scoreData.totalScore > 40 ? 'warm' : 'cold',
                isEncrypted: true
            },
        })

        return NextResponse.json({
            success: true,
            lead: {
                ...lead,
                email, // Return raw for immediate UI update
                name
            },
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

        // 🛡️ [GDPR] Reveal PII for authorized UI
        const revealedLeads = await Promise.all(leads.map(async (l) => ({
            ...l,
            email: await PrivacyShield.reveal(l.email),
            name: l.name ? await PrivacyShield.reveal(l.name) : l.name,
            phone: l.phone ? await PrivacyShield.reveal(l.phone) : l.phone,
        })));

        return NextResponse.json({ leads: revealedLeads })
    } catch (error) {
        console.error('Error fetching leads:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        )
    }
}
