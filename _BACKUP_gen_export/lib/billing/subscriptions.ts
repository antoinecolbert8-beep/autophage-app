import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * ELA SEPA DIRECT DEBIT - RECURRING SUBSCRIPTION SYSTEM
 * Mandat SEPA pour prélèvement automatique mensuel
 */

// Subscription tiers with monthly pricing
export const SUBSCRIPTION_TIERS = {
    starter: {
        id: 'starter',
        name: 'ELA Starter',
        priceMonthly: 99,
        credits: 500,
        features: ['500 crédits/mois', 'APEX Basic', 'PULSE Email'],
    },
    pro: {
        id: 'pro',
        name: 'ELA Pro',
        priceMonthly: 299,
        credits: 2500,
        features: ['2500 crédits/mois', 'APEX Full', 'PULSE Multi-Canal', 'Priority Support'],
    },
    enterprise: {
        id: 'enterprise',
        name: 'ELA Enterprise',
        priceMonthly: 999,
        credits: 15000,
        features: ['15000 crédits/mois', 'Tout inclus', 'API dédiée', 'Account Manager'],
    },
};

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateStripeCustomer(
    organizationId: string,
    email: string,
    name: string
): Promise<string> {
    const org = await prisma.organization.findUnique({
        where: { id: organizationId },
    });

    // Check if customer already exists (stored in integration)
    const existingIntegration = await prisma.integration.findFirst({
        where: {
            organizationId,
            provider: 'stripe',
        },
    });

    if (existingIntegration) {
        const config = existingIntegration.config as { customerId?: string };
        if (config.customerId) return config.customerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
            organizationId,
            organizationName: org?.name || '',
        },
    });

    // Store customer ID
    await prisma.integration.upsert({
        where: {
            id: existingIntegration?.id || 'new',
        },
        create: {
            organizationId,
            provider: 'stripe',
            credentials: '',
            config: JSON.stringify({ customerId: customer.id }),
            status: 'active',
        },
        update: {
            config: JSON.stringify({ customerId: customer.id }),
        },
    });

    return customer.id;
}

/**
 * Create SEPA Direct Debit setup session
 * This collects the IBAN and creates a mandate for recurring payments
 */
export async function createSepaSetupSession(
    organizationId: string,
    email: string,
    name: string,
    tierId: keyof typeof SUBSCRIPTION_TIERS,
    successUrl: string,
    cancelUrl: string
): Promise<string> {
    const customerId = await getOrCreateStripeCustomer(organizationId, email, name);
    const tier = SUBSCRIPTION_TIERS[tierId];

    // Create Stripe product and price if not exists
    const priceId = await getOrCreatePrice(tier);

    // Create checkout session with SEPA Direct Debit
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['sepa_debit', 'card'], // SEPA + Card fallback
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        subscription_data: {
            metadata: {
                organizationId,
                tierId,
                monthlyCredits: tier.credits.toString(),
            },
        },
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        // SEPA mandate collection
        // SEPA mandate collection handled automatically by Stripe Checkout
        // billing_address_collection: 'required', // Required for SEPA
        billing_address_collection: 'required',
        // Allow promotion codes
        allow_promotion_codes: true,
    });

    return session.url || '';
}

/**
 * Get or create Stripe price for a tier
 */
async function getOrCreatePrice(tier: typeof SUBSCRIPTION_TIERS.starter): Promise<string> {
    // Check if price already exists
    const prices = await stripe.prices.list({
        lookup_keys: [`ela_${tier.id}_monthly`],
    });

    if (prices.data.length > 0) {
        return prices.data[0].id;
    }

    // Create product
    const product = await stripe.products.create({
        name: tier.name,
        description: tier.features.join(' • '),
        metadata: {
            tierId: tier.id,
            monthlyCredits: tier.credits.toString(),
        },
    });

    // Create recurring price
    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.priceMonthly * 100, // cents
        currency: 'eur',
        recurring: {
            interval: 'month',
        },
        lookup_key: `ela_${tier.id}_monthly`,
    });

    return price.id;
}

/**
 * Handle successful subscription creation (webhook)
 */
export async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const metadata = subscription.metadata;
    const organizationId = metadata.organizationId;
    const monthlyCredits = parseInt(metadata.monthlyCredits || '0');

    if (!organizationId) {
        console.error('Subscription missing organizationId');
        return;
    }

    // Update organization with subscription info
    await prisma.organization.update({
        where: { id: organizationId },
        data: {
            tier: metadata.tierId || 'pro',
            mrr: subscription.items.data[0]?.price.unit_amount || 0 / 100,
            creditBalance: { increment: monthlyCredits },
            status: 'active',
        },
    });

    // Store subscription ID
    await prisma.integration.updateMany({
        where: {
            organizationId,
            provider: 'stripe',
        },
        data: {
            config: JSON.stringify({
                subscriptionId: subscription.id,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }),
        },
    });

    console.log(`✅ Subscription created for org ${organizationId}: ${monthlyCredits} credits/month`);
}

/**
 * Handle subscription renewal (add monthly credits)
 */
export async function handleSubscriptionRenewed(invoice: Stripe.Invoice): Promise<void> {
    if (invoice.subscription_details?.metadata?.organizationId) {
        const organizationId = invoice.subscription_details.metadata.organizationId;
        const monthlyCredits = parseInt(invoice.subscription_details.metadata.monthlyCredits || '0');

        await prisma.organization.update({
            where: { id: organizationId },
            data: {
                creditBalance: { increment: monthlyCredits },
            },
        });

        // Log the credit addition
        await prisma.creditPurchase.create({
            data: {
                organizationId,
                credits: monthlyCredits,
                amountPaid: (invoice.amount_paid || 0) / 100,
                paymentIntentId: invoice.payment_intent as string,
            },
        });

        console.log(`🔄 Monthly renewal for org ${organizationId}: +${monthlyCredits} credits`);
    }
}

/**
 * Handle failed payment (retry or suspend)
 */
export async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (invoice.subscription_details?.metadata?.organizationId) {
        const organizationId = invoice.subscription_details.metadata.organizationId;

        // Mark organization as at risk
        await prisma.organization.update({
            where: { id: organizationId },
            data: {
                status: 'payment_failed',
            },
        });

        console.warn(`⚠️ Payment failed for org ${organizationId}`);
        // TODO: Send email notification
    }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(organizationId: string): Promise<boolean> {
    const integration = await prisma.integration.findFirst({
        where: {
            organizationId,
            provider: 'stripe',
        },
    });

    const config = integration?.config as { subscriptionId?: string };
    if (!config?.subscriptionId) return false;

    await stripe.subscriptions.update(config.subscriptionId, {
        cancel_at_period_end: true,
    });

    return true;
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(organizationId: string) {
    const integration = await prisma.integration.findFirst({
        where: {
            organizationId,
            provider: 'stripe',
        },
    });

    const config = integration?.config as { subscriptionId?: string; currentPeriodEnd?: string };
    if (!config?.subscriptionId) {
        return { active: false, subscription: null };
    }

    const subscription = await stripe.subscriptions.retrieve(config.subscriptionId);

    return {
        active: subscription.status === 'active',
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
}
