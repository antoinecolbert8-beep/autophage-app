import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  handleSubscriptionCreated,
  handleSubscriptionRenewed,
  handlePaymentFailed,
} from '@/lib/billing/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`📩 Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      // SEPA mandate confirmed & subscription created
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      // Monthly payment successful - add credits
      case 'invoice.paid':
        await handleSubscriptionRenewed(event.data.object as Stripe.Invoice);
        break;

      // Payment failed
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // Subscription cancelled
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;

      // SEPA mandate accepted
      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        if (paymentMethod.type === 'sepa_debit') {
          console.log(`✅ SEPA mandate accepted: ${paymentMethod.sepa_debit?.last4}`);
        }
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
