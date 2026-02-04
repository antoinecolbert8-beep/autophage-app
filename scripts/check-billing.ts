import { prisma } from '../lib/prisma';

async function checkBilling() {
    console.log("🕵️ Checking Billing & Credit Consumption...\n");

    const org = await prisma.organization.findFirst();
    if (!org) {
        console.error("❌ No organization found.");
        return;
    }

    console.log(`🏢 Organization: ${org.name}`);
    console.log(`🪙 Credit Balance: ${org.creditBalance}`);
    console.log(`💰 MRR: ${org.mrr}€`);
    console.log(`📈 Plan Tier: ${org.tier}`);

    console.log("\n📊 Recently Consumed Credits (UsageLog):");
    const logs = await prisma.usageLog.findMany({
        where: { organizationId: org.id },
        orderBy: { timestamp: 'desc' },
        take: 5
    });

    if (logs.length === 0) {
        console.log("   (No usage logs found yet)");
    } else {
        logs.forEach(log => {
            console.log(`   - [${log.timestamp.toISOString()}] ${log.actionType}: -${log.creditsUsed} credits`);
        });
    }

    console.log("\n💳 Recent Credit Purchases:");
    const purchases = await prisma.creditPurchase.findMany({
        where: { organizationId: org.id },
        orderBy: { timestamp: 'desc' },
        take: 3
    });

    purchases.forEach(p => {
        console.log(`   - [${p.timestamp.toISOString()}] +${p.credits} credits (Paid: ${p.amountPaid || 0}€)`);
    });
}

checkBilling()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
