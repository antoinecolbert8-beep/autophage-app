import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * ELA SOVEREIGN MONETIZATION SYSTEM
 * Ethical, transparent, performance-based billing
 */

// Credit costs for different operations
export const CREDIT_COSTS = {
    APEX_GENERATION: 50,      // Content generation
    SNAP_DISTRIBUTION: 10,    // Per platform distribution
    PULSE_OUTREACH: 5,        // Per lead outreach
    INDEXING_FORCE: 20,       // Google indexing push
    AI_ANALYSIS: 15,          // Vertex AI analysis
} as const;

// Credit packages available for purchase
export const CREDIT_PACKAGES = [
    { id: 'starter', credits: 500, priceEuros: 49, popular: false },
    { id: 'pro', credits: 2000, priceEuros: 149, popular: true },
    { id: 'enterprise', credits: 10000, priceEuros: 499, popular: false },
];

interface UsageRecord {
    organizationId: string;
    actionType: keyof typeof CREDIT_COSTS;
    creditsUsed: number;
    metadata?: Record<string, any>;
}

/**
 * Get current credit balance for an organization
 */
export async function getCreditBalance(organizationId: string): Promise<number> {
    const org = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { creditBalance: true },
    });
    return org?.creditBalance || 0;
}

/**
 * Consume credits for an action
 * Returns true if successful, false if insufficient credits
 */
export async function consumeCredits(
    organizationId: string,
    actionType: keyof typeof CREDIT_COSTS,
    multiplier: number = 1
): Promise<{ success: boolean; remaining: number; consumed: number }> {
    const cost = CREDIT_COSTS[actionType] * multiplier;

    try {
        // Atomic decrement with check
        const result = await prisma.organization.updateMany({
            where: {
                id: organizationId,
                creditBalance: { gte: cost },
            },
            data: {
                creditBalance: { decrement: cost },
            },
        });

        if (result.count === 0) {
            const balance = await getCreditBalance(organizationId);
            return { success: false, remaining: balance, consumed: 0 };
        }

        // Log usage
        await prisma.usageLog.create({
            data: {
                organizationId,
                actionType,
                creditsUsed: cost,
                timestamp: new Date(),
            },
        });

        const remaining = await getCreditBalance(organizationId);
        return { success: true, remaining, consumed: cost };
    } catch (error) {
        console.error('Credit consumption error:', error);
        return { success: false, remaining: 0, consumed: 0 };
    }
}

/**
 * Add credits after purchase
 */
export async function addCredits(
    organizationId: string,
    credits: number,
    paymentIntentId: string
): Promise<number> {
    const org = await prisma.organization.update({
        where: { id: organizationId },
        data: {
            creditBalance: { increment: credits },
        },
    });

    // Log the purchase
    await prisma.creditPurchase.create({
        data: {
            organizationId,
            credits,
            paymentIntentId,
            timestamp: new Date(),
        },
    });

    return org.creditBalance;
}

/**
 * Create Stripe checkout session for credit purchase
 */
export async function createCheckoutSession(
    organizationId: string,
    packageId: string,
    successUrl: string,
    cancelUrl: string
): Promise<string> {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) throw new Error('Invalid package');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `ELA Credits - ${pkg.id.toUpperCase()}`,
                        description: `${pkg.credits} crédits pour ELA SaaS`,
                    },
                    unit_amount: pkg.priceEuros * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
            organizationId,
            packageId,
            credits: pkg.credits.toString(),
        },
    });

    return session.url || '';
}

/**
 * Handle Stripe webhook for successful payment
 */
export async function handlePaymentSuccess(sessionId: string): Promise<void> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata) {
        const { organizationId, credits, packageId } = session.metadata;

        if (organizationId && credits) {
            await addCredits(
                organizationId,
                parseInt(credits),
                session.payment_intent as string
            );

            console.log(`✅ Added ${credits} credits to org ${organizationId}`);
        }
    }
}

/**
 * Get usage statistics for billing dashboard
 */
export async function getUsageStats(organizationId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const usageLogs = await prisma.usageLog.findMany({
        where: {
            organizationId,
            timestamp: { gte: since },
        },
        orderBy: { timestamp: 'desc' },
    });

    // Aggregate by action type
    const byAction: Record<string, number> = {};
    let totalCredits = 0;

    for (const log of usageLogs) {
        byAction[log.actionType] = (byAction[log.actionType] || 0) + log.creditsUsed;
        totalCredits += log.creditsUsed;
    }

    return {
        totalCreditsUsed: totalCredits,
        byAction,
        logs: usageLogs.slice(0, 50), // Last 50 actions
    };
}

/**
 * Performance tracking - Calculate value generated (ethical version)
 * This is opt-in and transparent
 */
export async function calculatePerformanceMetrics(organizationId: string) {
    const [keywords, leads, content] = await Promise.all([
        prisma.keywordOpportunity.count({
            where: { projectId: organizationId, status: 'in-progress' },
        }),
        prisma.lead.count({
            where: { stage: { in: ['hot', 'customer'] } },
        }),
        prisma.contentAsset.count({
            where: { projectId: organizationId, publishedAt: { not: null } },
        }),
    ]);

    // Estimated value (transparent calculation)
    const estimatedValue = {
        keywordsRanked: keywords * 150, // ~150€ value per ranked keyword
        leadsGenerated: leads * 50,      // ~50€ per qualified lead
        contentAssets: content * 200,     // ~200€ per authority content
        total: keywords * 150 + leads * 50 + content * 200,
    };

    return {
        metrics: { keywords, leads, content },
        estimatedValue,
        message: 'Valeur estimée basée sur les benchmarks industrie (transparence totale)',
    };
}
