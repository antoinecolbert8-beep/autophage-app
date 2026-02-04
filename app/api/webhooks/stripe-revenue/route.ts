import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { RevenueAutopilot } from '@/lib/revenue-autopilot';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Webhook Stripe pour Revenue Autopilot
 * Traite automatiquement les paiements et distribue les revenus
 */
export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`[Revenue Webhook] Event: ${event.type}`);

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                break;

            default:
                console.log(`[Revenue Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Revenue Webhook] Error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { metadata, amount, customer } = paymentIntent;

    // Si c'est un paiement avec split
    if (metadata.streamId && metadata.splitEnabled === 'true') {
        await RevenueAutopilot.processIncomingPayment({
            streamId: metadata.streamId,
            amount: amount / 100, // Convert from cents
            customerId: customer as string,
            metadata
        });
    }

    console.log(`[Revenue Webhook] Processed payment of €${amount / 100}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    console.log(`[Revenue Webhook] Invoice paid: ${invoice.id}`);
    // Auto-invoicing success - already processed
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log(`[Revenue Webhook] Payment failed for invoice: ${invoice.id}`);
    // Handled by RevenueAutopilot.handlePaymentFailure
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    console.log(`[Revenue Webhook] Subscription updated: ${subscription.id}`);
    // Update database subscription status
}
