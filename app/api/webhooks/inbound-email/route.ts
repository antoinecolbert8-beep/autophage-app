import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/db';
import { PulseEngine } from '@/lib/realtime-pulse';
import { triggerAutomation } from '@/lib/automations';

import { SovereignBrain } from '@/lib/sovereign-brain';

/**
 * 📧 GMAIL INBOUND WEBHOOK (Sovereign Edition)
 * Processed via ELA Brain with Reflection & Cryptographic Archiving
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const { from, body, subject } = payload;

        console.log(`📬 [InboundEmail] Réponse de: ${from}`);

        // 1. Identification
        const emailMatch = from.match(/<(.+)>|(\S+@\S+\.\S+)/);
        const email = emailMatch ? (emailMatch[1] || emailMatch[2]) : from;

        const lead = await prisma.lead.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });

        const leadId = lead ? lead.id : 'unknown';

        // 🧠 PHASE 1: REFLECTION
        const reflection = await SovereignBrain.reflect({ from, body, subject });

        // 🛡️ PHASE 2: ARCHIVAGE CRYPTO (Binaire ELA)
        await SovereignBrain.archive({ from, body, subject }, reflection, leadId);

        if (!lead) {
            return NextResponse.json({ status: 'archived', reason: 'Lead not found, sovereignly stored' });
        }

        // 3. Update Status
        await prisma.lead.update({
            where: { id: lead.id },
            data: { stage: 'engaged', updatedAt: new Date() }
        });

        // 🚀 PHASE 3: EXECUTION
        const execution = await SovereignBrain.execute(lead.id, reflection);

        return NextResponse.json({ 
            status: 'ok', 
            brain_state: 'REFLECTED',
            archived: true,
            execution: execution.success
        });

    } catch (error) {
        console.error('❌ [InboundEmail] Sovereign Error:', error);
        return NextResponse.json({ error: 'System Instability' }, { status: 500 });
    }
}
