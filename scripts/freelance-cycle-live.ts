import { prisma } from "../core/db";
import { releaseAutonomousPayout } from "../lib/billing/escrow-manager";

async function runCycle() {
    console.log("🛠️ [FreelanceCycle TS] Starting Autonomous Bidding & Delivery...");

    try {
        // 1. Scan for completed AI Actions (Missions)
        const completedMissions = await prisma.aIActionLog.findMany({
            where: { status: 'completed' },
            take: 10
        });

        for (const mission of completedMissions) {
            // Check if payout already exists in TreasuryLedger
            const alreadyPaid = await prisma.treasuryLedger.findFirst({
                where: { referenceId: mission.id, type: 'PAYOUT' }
            });

            if (!alreadyPaid) {
                console.log(`🤑 Found new mission to pay: ${mission.id} - ${mission.actionType}`);
                
                // RELEASE REAL PAYOUT
                const result = await releaseAutonomousPayout(mission.id, mission.actionType);
                
                if (result.success) {
                    console.log(`✅ Payout ${result.amount}€ secured & released for ${mission.id}`);
                } else {
                    console.error(`⚠️ Payout failed for ${mission.id}: ${result.error}`);
                }
            }
        }
        
        console.log("✅ Cycle completed. Next run in 10 minutes.");
    } catch (err: any) {
        console.error("❌ Error in cycle:", err.message);
    }
}

// Single execution for script use, or setInterval for daemon
runCycle().then(() => {
    // If running as daemon:
    setInterval(runCycle, 10 * 60 * 1000);
});
