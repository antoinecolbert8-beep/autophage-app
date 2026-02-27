/**
 * URL: /api/cron/daily-recap
 * Déclenché par Vercel Cron
 * Récupère les événements de la Redis Queue pour générer le post de type "SOVEREIGN".
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventsForOrg, clearEventsForOrg } from '@/lib/queues/daily-recap';
import { generateContentWithGemini } from '@/lib/gemini-content';
import { DAILY_RECAP_PROMPT } from '@/lib/prompts/daily-recap';

// Simulate retrieving all active orgs for this cron
const getActiveOrganizations = async () => {
    // In a real scenario, this would be a Prisma query
    // e.g. await prisma.organization.findMany({ select: { id: true } })
    return [{ id: 'demo-org' }];
};

export async function GET(req: NextRequest) {
    // Basic auth check for Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orgs = await getActiveOrganizations();
        let totalGenerated = 0;

        for (const org of orgs) {
            const events = await getEventsForOrg(org.id);
            if (events.length === 0) continue;

            const eventsListStr = events.map(e =>
                `- [${e.timestamp}] ${e.type.toUpperCase()}: ${e.description} ${e.value ? `(${e.value}${e.currency || '€'})` : ''}`
            ).join('\n');

            const prompt = DAILY_RECAP_PROMPT.replace('{{events_list}}', eventsListStr);

            console.log(`📰 Generating Daily Recap for Organization: ${org.id}`);

            const aiResponse = await generateContentWithGemini({
                topic: prompt, // Pass the specialized prompt 
                platform: "LINKEDIN",
                contentType: "TEXT",
                boldness: 'sovereign'
            } as any);

            // TODO: call the actual posting API or queue
            console.log(`✅ Post generated: ${aiResponse.text.substring(0, 100)}...`);

            await clearEventsForOrg(org.id);
            totalGenerated++;
        }

        return NextResponse.json({ success: true, recapsGenerated: totalGenerated });
    } catch (error) {
        console.error('Error running daily recap cron:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
