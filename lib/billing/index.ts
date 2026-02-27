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
    POST_PUBLISH: 10,         // Native social publish (Segment E)
} as const;

// Credit packages available for purchase (Coup de Foudre Pricing)
export const CREDIT_PACKAGES = [
    { id: 'starter_pack', credits: 1000, priceEuros: 37, popular: false },
    { id: 'pro_pack', credits: 5000, priceEuros: 197, popular: true },
    { id: 'supreme_pack', credits: 15000, priceEuros: 497, popular: false },
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

import { reportUsageToStripe, getMeteredSubscriptionItem } from './usage';

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
        // 🔒 KILL-SWITCH GUARD: Check if org is suspended
        const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { status: true, creditBalance: true }
        });

        if (org?.status === 'suspended') {
            console.warn(`🛑 Attempted usage from SUSPENDED organization: ${organizationId}`);
            return { success: false, remaining: org.creditBalance, consumed: 0 };
        }

        // Atomic decrement with check
        const result = await prisma.organization.updateMany({
            where: {
                id: organizationId,
                creditBalance: { gte: cost },
                status: 'active', // Only active orgs can consume
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

        // 📈 PAY-PER-USE REPORTING (Sovereign Integration)
        // If the org has a linked Stripe subscription, we "bip" chez Stripe
        try {
            const integration = await prisma.integration.findFirst({
                where: { organizationId, provider: 'stripe', status: 'active' }
            });

            if (integration) {
                const config = JSON.parse(integration.config);
                const subscriptionId = config.subscriptionId;

                if (subscriptionId) {
                    // Optimized: check if we already have the subscriptionItemId in config
                    let subscriptionItemId = config.subscriptionItemId;

                    if (!subscriptionItemId) {
                        subscriptionItemId = await getMeteredSubscriptionItem(subscriptionId);
                        // Cache it for future use
                        if (subscriptionItemId) {
                            await prisma.integration.update({
                                where: { id: integration.id },
                                data: { config: JSON.stringify({ ...config, subscriptionItemId }) }
                            });
                        }
                    }

                    if (subscriptionItemId) {
                        try {
                            const report = await reportUsageToStripe(subscriptionItemId, 1);
                            if (!report.success) throw report.error;
                        } catch (err) {
                            console.error("❌ Stripe Reporting Failed. Queueing local log for manual reconciliation.");
                            // We create a specific UsageLog entry marked for retry/audit
                            await prisma.usageLog.create({
                                data: {
                                    organizationId,
                                    actionType: 'AI_ANALYSIS', // Or the actual action
                                    creditsUsed: 0,
                                    metadata: JSON.stringify({
                                        error: "STRIPE_REPORTING_FAILED",
                                        subscriptionItemId,
                                        originalAction: actionType,
                                        pendingReconciliation: true
                                    }),
                                    timestamp: new Date(),
                                },
                            });
                        }
                    }
                }
            }
        } catch (billingError) {
            console.warn("⚠️ Billing reporting bypassed:", billingError);
        }

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
 * Idempotent: safe to call multiple times for the same sessionId
 */
export async function handlePaymentSuccess(sessionId: string): Promise<void> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata) {
        const { organizationId, credits, packageId } = session.metadata;
        const paymentIntentId = session.payment_intent as string;

        if (organizationId && credits && paymentIntentId) {
            // IDEMPOTENCY CHECK: verify this paymentIntent wasn't already processed
            const existing = await prisma.creditPurchase.findFirst({
                where: { paymentIntentId },
            });

            if (existing) {
                console.log(`⚡ Idempotency: Payment ${paymentIntentId} already processed. Skipping.`);
                return;
            }

            await addCredits(
                organizationId,
                parseInt(credits),
                paymentIntentId
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
    // Get the organization's projects first
    const projects = await prisma.project.findMany({
        where: { organizationId },
        select: { id: true },
    });
    const projectIds = projects.map(p => p.id);

    const [keywords, leads, content] = await Promise.all([
        prisma.keywordOpportunity.count({
            where: {
                projectId: { in: projectIds },
                status: 'in-progress',
            },
        }),
        prisma.lead.count({
            where: {
                organizationId,
                stage: { in: ['hot', 'customer'] },
            },
        }),
        prisma.contentAsset.count({
            where: {
                projectId: { in: projectIds },
                publishedAt: { not: null },
            },
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
