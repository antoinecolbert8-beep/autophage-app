import Stripe from 'stripe';
import { db as prisma } from "@/core/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

/**
 * REVENUE AUTOPILOT
 * Système autonome de gestion des flux monétaires
 * Version simplifiée compatible avec le schéma Prisma existant
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

        // Validation: somme des % = 100
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

        // Récupérer splits depuis metadata
        const splits = params.metadata?.splits ? JSON.parse(params.metadata.splits) : [];

        if (!splits || splits.length === 0) {
            console.warn('[Revenue] No splits configured for this stream');
            return;
        }

        // Distribuer automatiquement selon les splits
        for (const split of splits) {
            const splitAmount = (amount * split.percentage) / 100;
            await this.creditUserBalance(split.userId, splitAmount);
        }

        console.log(`[Revenue] Distributed €${amount} across ${splits.length} beneficiaries`);
    }

    /**
     * Crédit du solde utilisateur (utilise quota comme wallet temporaire)
     */
    private static async creditUserBalance(userId: string, amount: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            console.error(`[Revenue] User ${userId} not found`);
            return;
        }

        // Convertir en crédits (1€ = 10 crédits)
        const credits = Math.round(amount * 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                monthlyQuota: { increment: credits }
            }
        });

        console.log(`[Revenue] Credited ${credits} crédits (€${amount}) to ${user.email}`);
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
     * Analytics financiers en temps réel
     */
    static async getRevenueAnalytics(): Promise<{
        totalRevenue: number;
        activeSubscriptions: number;
        churnRate: number;
    }> {
        const activeSubscriptions = await prisma.subscription.count({
            where: { status: 'active' }
        });

        return {
            totalRevenue: 0, // Would calculate from Stripe
            activeSubscriptions,
            churnRate: 0
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

        // Validation
        const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error('Beneficiary percentages must sum to 100%');
        }

        // Créer stream
        const stream = await this.createRevenueStream({
            name: productName,
            type: 'revenue_share',
            amount,
            ownerIds: beneficiaries.map(b => b.userId),
            splitPercentages: beneficiaries.map(b => b.percentage)
        });

        // Créer produit Stripe
        const product = await stripe.products.create({
            name: productName
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: amount * 100,
            currency: 'eur'
        });

        // Créer Payment Link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{
                price: price.id,
                quantity: 1
            }],
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
     * Calcul des revenus par utilisateur
     */
    static async getUserRevenue(userId: string): Promise<{
        totalEarned: number;
        pendingPayouts: number;
    }> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Simplified - would query actual revenue records
        return {
            totalEarned: 0,
            pendingPayouts: 0
        };
    }
}
