import { db } from "@/core/db";
import { Prisma } from "@prisma/client";

export class LedgerService {
    static async handleIncome(amountCents: number) {
        return this.recordRevenue(amountCents, `INTERNAL_CREDIT_${Date.now()}_${Math.random()}`);
    }

    static async recordRevenue(amountCents: number, stripePaymentId: string, stripeCustomerId?: string) {
        return db.$transaction(async (tx) => {
            const lastEntry = await tx.treasuryLedger.findFirst({
                orderBy: { createdAt: 'desc' },
            });
            const previousBalance = lastEntry?.resulting_balance ?? 0;

            // 1. Revenue In
            const revenueBalance = previousBalance + amountCents;
            await tx.treasuryLedger.create({
                data: {
                    amount_cents: amountCents,
                    type: "REVENUE_IN",
                    referenceId: stripePaymentId,
                    resulting_balance: revenueBalance,
                    stripeCustomerId: stripeCustomerId,
                },
            });

            const taxAmount = Math.floor(amountCents * 0.60);
            const adBudgetAmount = amountCents - taxAmount;

            // 2. Tax Reserve
            const taxBalance = revenueBalance - taxAmount;
            await tx.treasuryLedger.create({
                data: {
                    amount_cents: -taxAmount,
                    type: "TAX_RESERVE",
                    referenceId: stripePaymentId,
                    resulting_balance: taxBalance,
                },
            });

            // 3. Update WarChest
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
    }

    /**
     * Records Ad Spend and updates Ledger.
     */
    static async recordAdSpend(amount: number, adSetId: string, tx?: Prisma.TransactionClient) {
        const database = tx || db;
        return await database.treasuryLedger.create({
            data: {
                type: 'AD_SPEND_OUT',
                amount_cents: -amount,
                referenceId: adSetId,
                resulting_balance: 0,
                stripeCustomerId: null
            }
        });
    }
}

