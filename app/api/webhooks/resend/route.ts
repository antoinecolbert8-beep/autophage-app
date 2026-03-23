import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/db';
import { PulseEngine } from '@/lib/realtime-pulse';
import { triggerAutomation } from '@/lib/automations';

/**
 * 📧 RESEND WEBHOOK HANDLER
 * Captures email events and triggers high-agency responses
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        console.log('📬 [Resend Webhook]', payload.type);

        const { type, data } = payload;
        const emailId = data['email_id'] || data['id'];
        
        // 1. Find the associated lead/prospect
        const lead = await prisma.lead.findFirst({
            where: { metadata: { contains: emailId } }
        });

        if (!lead) {
            return NextResponse.json({ status: 'ignored', reason: 'Lead not found for this email ID' });
        }

        const prospectName = lead.name || 'Inconnu';

        // 2. Alert the System/User
        if (type === 'email.opened') {
            PulseEngine.notifyEngagement('OPEN', prospectName);
            await prisma.actionHistory.create({
                data: {
                    userId: 'SYSTEM',
                    platform: 'EMAIL',
                    action: 'PROSPECT_OPENED_EMAIL',
                    context: JSON.stringify({ leadId: lead.id, emailId })
                }
            });
        }

        if (type === 'email.clicked') {
            PulseEngine.notifyEngagement('CLICK', prospectName);
            
            // ⚡ HIGH AGENCY: Trigger immediate automated follow-up
            console.log(`🚀 [Conversion] Prospect ${prospectName} a cliqué. Activation du follow-up...`);
            
            await triggerAutomation('EMAIL_FOLLOWUP', {
                leadId: lead.id,
                trigger: 'CLICK',
                delayMinutes: 0 // Immediate or scheduled
            });
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('❌ [Resend Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
