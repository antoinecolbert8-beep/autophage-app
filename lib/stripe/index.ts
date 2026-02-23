import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;

export const stripe = new Stripe(STRIPE_SECRET_KEY || "dummy_key_for_build", {
    apiVersion: '2023-10-16',
    typescript: true,
});

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ STRIPE_SECRET_KEY is not defined in production');
}

// Create a customer
export async function createCustomer(params: {
    email: string
    name?: string
    metadata?: Record<string, string>
}) {
    return await stripe.customers.create(params)
}

// Create a subscription with performance-based pricing
export async function createPerformanceSubscription(params: {
    customerId: string
    priceId: string
    metadata?: Record<string, string>
}) {
    return await stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ price: params.priceId }],
        metadata: params.metadata,
    })
}

// Create performance-based oneoff charge
export async function createPerformanceCharge(params: {
    customerId: string
    amount: number // in cents
    currency: string
    description: string
    metadata?: Record<string, string>
}) {
    return await stripe.paymentIntents.create({
        customer: params.customerId,
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        metadata: params.metadata,
        automatic_payment_methods: {
            enabled: true,
        },
    })
}

// Calculate performance-based pricing
export function calculatePerformancePrice(metrics: {
    basePrice: number // base monthly fee
    leadsCaptured: number
    conversions: number
    revenueGenerated: number
    pricePerLead?: number
    pricePerConversion?: number
    revenueShare?: number // percentage as decimal (e.g., 0.05 for 5%)
}): number {
    const {
        basePrice,
        leadsCaptured,
        conversions,
        revenueGenerated,
        pricePerLead = 0,
        pricePerConversion = 500, // 5€ per conversion
        revenueShare = 0,
    } = metrics

    const leadBonus = leadsCaptured * pricePerLead
    const conversionBonus = conversions * pricePerConversion
    const revenueBonus = revenueGenerated * revenueShare

    return basePrice + leadBonus + conversionBonus + revenueBonus
}

// Webhook handler types
export type StripeWebhookEvent = Stripe.Event

export async function constructWebhookEvent(
    payload: string | Buffer,
    signature: string
): Promise<StripeWebhookEvent> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
