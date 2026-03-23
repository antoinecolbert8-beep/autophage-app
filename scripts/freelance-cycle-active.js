const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runCycle() {
    console.log("🛠️ [FreelanceCycle JS] Starting Autonomous Bidding & Delivery...");

    try {
        // 1. Scan for completed AI Actions (Missions)
        const completedMissions = await prisma.aIActionLog.findMany({
            where: { status: 'completed' },
            take: 10
        });

        for (const mission of completedMissions) {
            // Check if payout already exists
            const alreadyPaid = await prisma.treasuryLedger.findFirst({
                where: { referenceId: mission.id, type: 'PAYOUT' }
            });

            if (!alreadyPaid) {
                console.log(`🤑 Found new mission to pay: ${mission.id}`);
                await prisma.treasuryLedger.create({
                    data: {
                        amount_cents: 5000,
                        type: 'PAYOUT',
                        referenceId: mission.id,
                        resulting_balance: 0,
                        description: `Auto-Payout for ${mission.actionType}`
                    }
                });
                console.log(`✅ Payout 50€ secured for ${mission.id}`);
            }
        }
        
        console.log("✅ Cycle completed. Next run in 10 minutes.");
    } catch (err) {
        console.error("❌ Error in cycle:", err.message);
    }
}

// Initial run
runCycle();

// Long running loop
setInterval(runCycle, 10 * 60 * 1000);
