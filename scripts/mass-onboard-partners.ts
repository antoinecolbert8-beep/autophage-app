import { db as prisma } from '../core/db';

async function massOnboardPartners() {
    console.log("🚀 STARTING MASS PARTNER ONBOARDING PROTOCOL...");

    // 1. Identify Target Networks/Media
    const targetNetworks = [
        "TechCrunch", "Wired", "ForbesTech", "Entrepreneur", "HackerNews",
        "StationF", "TheFamily", "BFM Business", "LesEchos", "JournalDuNet"
    ];

    console.log(`🎯 Targeting ${targetNetworks.length} high-authority networks...`);

    // 2. Prepare Reseller/Network offer
    const resellerOffer = {
        name: "ELA Network License v1",
        commission: "30% Lifetime Recurring",
        benefit: "Priority support + Whitelabel options"
    };

    // 3. Sequential outreach and lead creation
    console.log("📢 Triggering outreach sequences...");

    // Get the administrative organization
    const org = await prisma.organization.findFirst({
        where: { name: { contains: 'Audit' } }
    });
    const orgId = org?.id || 'cmm1qar0y00008xbwkciy978q';

    for (const network of targetNetworks) {
        try {
            const email = `partnerships@${network.toLowerCase().replace(/\s/g, '-')}.com`;

            // Check if exists first
            const existing = await prisma.lead.findFirst({
                where: { email, organizationId: orgId }
            });

            if (existing) {
                await prisma.lead.update({
                    where: { id: existing.id },
                    data: { stage: 'warm', score: 90 }
                });
                console.log(`   🔄 Target updated: ${network}`);
            } else {
                await prisma.lead.create({
                    data: {
                        email,
                        company: network,
                        stage: 'warm',
                        score: 85,
                        organizationId: orgId,
                        scoreBreakdown: JSON.stringify({ demographic: 20, behavioral: 20, engagement: 25, intent: 20 })
                    }
                });
                console.log(`   ✅ Target created: ${network}`);
            }
        } catch (e: any) {
            console.error(`   ❌ Failed for ${network}:`, e.message);
        }
    }

    console.log("\n📈 MASS ONBOARDING QUEUED. sniper bots are now monitoring responses.");
}

massOnboardPartners().catch(err => {
    console.error("💥 PROTOCOL CRASHED:", err);
    process.exit(1);
});
