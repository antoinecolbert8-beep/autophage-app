import Stripe from 'stripe';
import { db as prisma } from "@/core/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

/**
 * REVENUE AUTOPILOT
 * Système autonome de gestion des flux monétaires
 * Version optimisée pour l'Architecture Zéro Maintenance
 */

export interface RevenueStream {
    id: string;
    name: string;
    type: 'subscription' | 'one_time' | 'revenue_share' | 'commission';
    amount: number;
    currency: string;
    splits?: Array<{
        userId: string;
        percentage: number;
    }>;
}

export class RevenueAutopilot {

    /**
     * Configuration des flux de revenus divisibles
     */
    static async createRevenueStream(params: {
        name: string;
        type: RevenueStream['type'];
        amount: number;
        ownerIds: string[];
        splitPercentages: number[];
    }): Promise<RevenueStream> {
        const { name, type, amount, ownerIds, splitPercentages } = params;

        const totalPercentage = splitPercentages.reduce((sum, p) => sum + p, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error('Split percentages must sum to 100%');
        }

        const splits = ownerIds.map((userId, idx) => ({
            userId,
            percentage: splitPercentages[idx]
        }));

        console.log(`[Revenue] Created stream "${name}" with ${splits.length} beneficiaries`);

        return {
            id: 'stream_' + Date.now(),
            name,
            type,
            amount,
            currency: 'EUR',
            splits
        };
    }

    /**
     * Traitement automatique des paiements entrants
     */
    static async processIncomingPayment(params: {
        streamId: string;
        amount: number;
        customerId: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        const { streamId, amount } = params;

        console.log(`[Revenue] Processing €${amount} for stream ${streamId}`);

        const splits = params.metadata?.splits ? JSON.parse(params.metadata.splits) : [];

        if (!splits || splits.length === 0) {
            console.warn('[Revenue] No splits configured for this stream');
            return;
        }

        for (const split of splits) {
            const splitAmount = (amount * split.percentage) / 100;
            await this.creditOrganizationBalance(split.userId, splitAmount);
        }

        console.log(`[Revenue] Distributed €${amount} across ${splits.length} beneficiaries`);
    }

    /**
     * Crédit du solde de l'organisation (Wallet centralisé)
     */
    private static async creditOrganizationBalance(userId: string, amount: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, organizationId: true }
        });

        if (!user || !user.organizationId) {
            console.error(`[Revenue] User or Organization not found for ${userId}`);
            return;
        }

        // Convertir en crédits (1€ = 10 crédits)
        const credits = Math.round(amount * 10);

        // Mise à jour de l'organisation
        await prisma.organization.update({
            where: { id: user.organizationId },
            data: {
                creditBalance: { increment: credits }
            }
        });

        console.log(`[Revenue] Credited ${credits} credits (€${amount}) to Org ${user.organizationId} (from ${user.email})`);
    }

    /**
     * Facturation automatique récurrente
     */
    static async autoInvoicing(): Promise<void> {
        console.log('[Revenue] Running auto-invoicing cycle...');

        const activeSubscriptions = await prisma.subscription.findMany({
            where: { status: 'active' },
            include: { user: true }
        });

        for (const subscription of activeSubscriptions) {
            try {
                if (!subscription.currentPeriodEnd) continue;

                const now = new Date();
                const daysUntilEnd = Math.ceil(
                    (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (daysUntilEnd <= 3 && subscription.user.stripeCustomerId) {
                    const customer = await stripe.customers.retrieve(subscription.user.stripeCustomerId);
                    if (!customer.deleted) {
                        console.log(`[Revenue] Renewal check for ${subscription.user.email}`);
                    }
                }
            } catch (error) {
                console.error(`[Revenue] Failed to check subscription ${subscription.id}:`, error);
            }
        }
    }

    /**
     * Analytics financiers en temps réel basés sur l'organisation
     */
    static async getRevenueAnalytics(): Promise<{
        totalRevenue: number;
        activeSubscriptions: number;
        mrr: number;
    }> {
        const activeOrgs = await prisma.organization.findMany({
            where: { status: 'active' },
            select: { mrr: true }
        });

        const activeSubscriptions = activeOrgs.length;
        const mrr = activeOrgs.reduce((sum, org) => sum + (org.mrr || 0), 0);

        return {
            totalRevenue: mrr, // Approximation based on active MRR
            activeSubscriptions,
            mrr
        };
    }

    /**
     * Création d'un lien de paiement divisible
     */
    static async createDivisiblePaymentLink(params: {
        productName: string;
        amount: number;
        beneficiaries: Array<{ userId: string; percentage: number }>;
    }): Promise<string> {
        const { productName, amount, beneficiaries } = params;

        const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error('Beneficiary percentages must sum to 100%');
        }

        const stream = await this.createRevenueStream({
            name: productName,
            type: 'revenue_share',
            amount,
            ownerIds: beneficiaries.map(b => b.userId),
            splitPercentages: beneficiaries.map(b => b.percentage)
        });

        const product = await stripe.products.create({ name: productName });
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: amount * 100,
            currency: 'eur'
        });

        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            metadata: {
                streamId: stream.id,
                splitEnabled: 'true',
                splits: JSON.stringify(beneficiaries)
            }
        });

        console.log(`[Revenue] Created divisible payment link for "${productName}"`);
        return paymentLink.url;
    }

    /**
     * Calcul des revenus par utilisateur (simplifié)
     */
    static async getUserRevenue(userId: string): Promise<{
        totalEarned: number;
        pendingPayouts: number;
    }> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw new Error('User not found');

        return {
            totalEarned: 0,
            pendingPayouts: 0
        };
    }
}
