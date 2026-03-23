import { prisma } from "../core/db";

async function diagnose() {
    console.log("🔍 [DIAGNOSTIC] Checking ELA Revenue Swarm Status...");

    // 1. Check Leads
    const leadCount = await prisma.lead.count();
    const recentLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(`📊 Lead Count: ${leadCount}`);
    console.log("🆕 Recent Leads:", recentLeads.map(l => ({ name: l.name, stage: l.stage, createdAt: l.createdAt })));

    // 2. Check Touchpoints (Emails sent)
    const touchpointCount = await prisma.touchpoint.count();
    const recentTouchpoints = await prisma.touchpoint.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(`📧 Touchpoint Count: ${touchpointCount}`);
    console.log("📩 Recent Touchpoints:", recentTouchpoints.map(t => ({ type: t.type, createdAt: t.createdAt, message: t.message.substring(0, 50) + "..." })));

    // 3. Check for Stripe Links in touchpoints
    const stripeTouchpoints = recentTouchpoints.filter(t => t.message.includes('stripe.com'));
    console.log(`🔗 Touchpoints with Stripe Links: ${stripeTouchpoints.length}`);

    // 4. Check Agent Actions
    const agentActions = await prisma.actionHistory.count({
        where: { userId: 'SYSTEM' }
    });
    console.log(`🤖 Total Agent Actions: ${agentActions}`);

    if (touchpointCount === 0 || leadCount === 0) {
        console.warn("⚠️ [REVENUE_BLOCKER] No leads or touchpoints found. Swarm might be idle.");
    }
}

diagnose().catch(console.error);
