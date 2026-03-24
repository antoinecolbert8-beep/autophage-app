import Stripe from 'stripe';
import { prisma } from '../../core/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * 💸 ESCROW MANAGER
 * Finalizes contracts and releases funds to autonomous sellers
 */
export async function releaseEscrow(contractId: string) {
    console.log(`💸 [EscrowManager] Releasing funds for contract: ${contractId}`);

    const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: { seller: true }
    });

    if (!contract || contract.status !== 'IN_PROGRESS') {
        throw new Error("Contract not found or not in progress.");
    }

    // 1. Calculate Payout (e.g., 80% to seller, 20% ELA Fee)
    const platformFeePercent = 0.20;
    const totalAmount = contract.totalAmount;
    const payoutAmount = totalAmount * (1 - platformFeePercent);

    try {
        // 2. REAL STRIPE TRANSFER (If seller has an account)
        let stripeTransferId = `po_auto_${Date.now()}`;
        if (contract.seller.stripeAccountId) {
            console.log(`📡 [EscrowManager] Initiating real Stripe Transfer to: ${contract.seller.stripeAccountId}`);
            const transfer = await stripe.transfers.create({
                amount: Math.round(payoutAmount * 100),
                currency: 'eur',
                destination: contract.seller.stripeAccountId,
                description: `ELA Payout: Contract ${contract.id}`,
                metadata: { contractId: contract.id }
            });
            stripeTransferId = transfer.id;
        } else {
            console.warn(`⚠️ [EscrowManager] No Stripe Account ID for ${contract.seller.name}. Fund release is LEDGER-ONLY.`);
        }

        // 2. Update WarChest (Deduct from Reserved or Available for Payout)
        const warChest = await prisma.warChest.findFirst();
        if (warChest) {
            await prisma.warChest.update({
                where: { id: warChest.id },
                data: {
                    available_budget_cents: { decrement: Math.round(payoutAmount * 100) },
                    total_spent_cents: { increment: Math.round(payoutAmount * 100) }
                }
            });
        }

        // 3. Log in TreasuryLedger (The Legacy Store)
        await prisma.treasuryLedger.create({
            data: {
                amount_cents: Math.round(payoutAmount * 100),
                type: 'PAYOUT',
                referenceId: contractId,
                resulting_balance: (warChest?.available_budget_cents || 0) - Math.round(payoutAmount * 100),
                description: `Paiement Freelance pour contrat: ${contract.id}`
            }
        });

        // 4. Update Contract & Transactions
        await prisma.contract.update({
            where: { id: contractId },
            data: { status: 'COMPLETED' }
        });

        await prisma.transaction.create({
            data: {
                contractId: contract.id,
                userId: contract.sellerId,
                type: 'PAYOUT',
                amount: payoutAmount,
                currency: 'EUR',
                status: 'COMPLETED',
                stripeChargeId: stripeTransferId
            }
        });

        console.log(`✅ [EscrowManager] Payout of ${payoutAmount}€ released to ${contract.seller.name}`);
        return { success: true, amount: payoutAmount };

    } catch (error: any) {
        console.error(`❌ [EscrowManager] Payout failed:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * 🤖 RELEASE AUTONOMOUS PAYOUT
 * Payout for AI-driven missions without a specific B2B contract
 */
export async function releaseAutonomousPayout(missionId: string, actionType: string) {
    console.log(`🤖 [EscrowManager] Releasing autonomous payout for mission: ${missionId}`);

    const payoutAmount = 50.00; // Fixed rate per mission

    try {
        const recipient = await prisma.user.findFirst({
            where: { isAutonomous: true }
        }) || await prisma.user.findFirst({
            where: { role: 'admin' }
        });

        if (!recipient) throw new Error("No recipient found for autonomous payout.");

        // 1. REAL STRIPE TRANSFER (If recipient has an account)
        let stripeTransferId = `po_auto_${Date.now()}`;
        if (recipient.stripeAccountId) {
            try {
                console.log(`📡 [EscrowManager] Initiating real Stripe Transfer to: ${recipient.stripeAccountId}`);
                const transfer = await stripe.transfers.create({
                    amount: Math.round(payoutAmount * 100),
                    currency: 'eur',
                    destination: recipient.stripeAccountId,
                    description: `ELA Autonomous Payout: ${actionType}`,
                    metadata: { missionId }
                });
                stripeTransferId = transfer.id;
            } catch (stripeErr: any) {
                if (stripeErr.message.includes("own account")) {
                    console.warn(`💳 [EscrowManager] Self-transfer detected (Live Bridge). Ledger remains the source of truth.`);
                    stripeTransferId = `po_self_${Date.now()}`;
                } else {
                    throw stripeErr;
                }
            }
        } else {
            console.warn(`⚠️ [EscrowManager] No Stripe Account ID for ${recipient.name}. Fund release is LEDGER-ONLY.`);
        }

        // 2. Update WarChest
        const warChest = await prisma.warChest.findFirst() || await prisma.warChest.create({
            data: { id: "global-warchest", available_budget_cents: 0 }
        });

        if (warChest.available_budget_cents < Math.round(payoutAmount * 100)) {
            console.error(`🛑 [EscrowManager] Insufficient WarChest funds: ${warChest.available_budget_cents} cents. Payout aborted.`);
            return { success: false, error: "WarChest insuffisant. En attente de revenus clients." };
        }

        if (warChest) {
            await prisma.warChest.update({
                where: { id: warChest.id },
                data: {
                    available_budget_cents: { decrement: Math.round(payoutAmount * 100) },
                    total_spent_cents: { increment: Math.round(payoutAmount * 100) }
                }
            });
        }

        // 3. Log in TreasuryLedger
        await prisma.treasuryLedger.create({
            data: {
                amount_cents: Math.round(payoutAmount * 100),
                type: 'PAYOUT',
                referenceId: missionId,
                resulting_balance: (warChest?.available_budget_cents || 0) - Math.round(payoutAmount * 100),
                description: `Auto-Payout pour mission ${actionType}`
            }
        });

        return { success: true, amount: payoutAmount };

    } catch (error: any) {
        console.error(`❌ [EscrowManager] Autonomous payout failed:`, error.message);
        return { success: false, error: error.message };
    }
}
