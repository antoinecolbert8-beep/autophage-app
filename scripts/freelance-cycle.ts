import { CreatorAgent } from "../lib/agents/creator-agent";
import { releaseEscrow } from "../lib/billing/escrow-manager";
import { prisma } from "../core/db";

/**
 * 🛠️ FREELANCE REVENUE DAEMON
 * Runs the end-to-end freelance cycle autonomously
 */
async function runFreelanceCycle() {
    console.log("🛠️ [FreelanceCycle] Starting Autonomous Bidding & Delivery Cycle...");

    const creator = new CreatorAgent();

    // 1. Generate new "Product/Service" and list on Marketplace
    const product = await creator.execute();
    if (product) {
        console.log(`✅ [FreelanceCycle] New service listed: ${product.concept?.name}`);
    }

    // 2. Check for "In Progress" contracts that are ready for delivery
    const activeContracts = await prisma.contract.findMany({
        where: { status: 'IN_PROGRESS' }
    });

    for (const contract of activeContracts) {
        // ... (existing contract release logic)
    }

    // ⚡ 3. SOVEREIGN BRIDGE: Check for AI Missions (AIActionLog) not yet paid out
    console.log("⚡ [FreelanceCycle] Scanning AIActionLog for completed missions...");
    const completedMissions = await prisma.aIActionLog.findMany({
        where: { status: 'completed', actionType: { in: ['DEEP_RESEARCH', 'CONTENT_STRATEGY'] } },
        take: 5
    });

    for (const mission of completedMissions) {
        // Check if already paid out in TreasuryLedger
        const alreadyPaid = await prisma.treasuryLedger.findFirst({
            where: { referenceId: mission.id, type: 'PAYOUT' }
        });

        if (!alreadyPaid) {
            console.log(`🤑 [FreelanceCycle] FOUND UNPAID MISSION: ${mission.actionType} (${mission.id})`);
            
            // Allocate 50€ profit per successful AI Mission (Simulation of the "money management")
            const missionRevenue = 50 * 100; // 5000 cents
            
            await prisma.warChest.updateMany({
                data: { available_budget_cents: { increment: missionRevenue } }
            });

            await prisma.treasuryLedger.create({
                data: {
                    amount_cents: missionRevenue,
                    type: 'REVENUE',
                    referenceId: mission.id,
                    resulting_balance: 0, // Simplified
                    description: `Revenu IA généré par mission: ${mission.actionType}`
                }
            });
            
            console.log(`✅ [FreelanceCycle] Revenue of 50€ secured in WarChest for ${mission.id}`);
        }
    }
}

// Run every 10 minutes
console.log("🚀 [FreelanceCycle] Daemon Active.");
setInterval(runFreelanceCycle, 10 * 60 * 1000);

// Initial run
runFreelanceCycle().catch(console.error);
