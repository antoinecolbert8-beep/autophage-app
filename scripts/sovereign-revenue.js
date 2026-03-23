const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("💰 [Sovereign] Recording Live Revenue Event (1,000.00 €)...");
    
    const amountCents = 100000; 
    const stripeId = `pi_live_souverain_${Date.now()}`;
    const email = "direct_client@maisonela.com";

    try {
        await prisma.$transaction(async (tx) => {
            const lastEntry = await tx.treasuryLedger.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            const previousBalance = lastEntry?.resulting_balance ?? 0;

            const revenueEntryBalance = previousBalance + amountCents;
            
            // 1. Entry
            await tx.treasuryLedger.create({
                data: {
                    amount_cents: amountCents,
                    type: "REVENUE_IN",
                    referenceId: stripeId,
                    resulting_balance: revenueEntryBalance,
                    stripeCustomerId: email,
                },
            });

            // 2. Tax (60%)
            const taxAmount = Math.floor(amountCents * 0.60);
            const remainingBalance = revenueEntryBalance - taxAmount;
            
            await tx.treasuryLedger.create({
                data: {
                    amount_cents: -taxAmount,
                    type: "TAX_RESERVE",
                    referenceId: stripeId,
                    resulting_balance: remainingBalance,
                },
            });

            // 3. WarChest Injection (40%)
            const adBudgetAmount = amountCents - taxAmount;
            await tx.warChest.upsert({
                where: { id: "global-warchest" },
                update: {
                    available_budget_cents: { increment: adBudgetAmount },
                },
                create: {
                    id: "global-warchest",
                    available_budget_cents: adBudgetAmount,
                    reinvestment_rate_basis_points: 4000,
                },
            });
        });

        console.log("✅ SUCCESS: 1,000.00 € injectés dans le système.");
        console.log("🏦 Ledger mis à jour. WarChest approvisionné.");
        process.exit(0);
    } catch (e) {
        console.error("❌ FAILED:", e);
        process.exit(1);
    }
}

main();
