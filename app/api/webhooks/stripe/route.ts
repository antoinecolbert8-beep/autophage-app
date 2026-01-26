import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  handleSubscriptionCreated,
  handleSubscriptionRenewed,
  handlePaymentFailed,
} from '@/lib/billing/subscriptions';
import { triggerAutomation } from '@/lib/automations';

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
    // Conductor Pattern: Délégué tous les événements Stripe pertinents à Make
    // Make gérera : Provisioning, Emails, CRM, Slack Alert, etc.

    // On ne bloque pas le retour 200 à Stripe, on lance l'automation en "fire and forget" (await sans bloquer si on voulait, mais ici on attend pour logger l'erreur éventuelle)

    // Mapping des événements intéressants
    const RELEVANT_EVENTS = [
      'customer.subscription.created',
      'invoice.paid',
      'invoice.payment_failed',
      'customer.subscription.deleted',
      'checkout.session.completed'
    ];

    if (RELEVANT_EVENTS.includes(event.type)) {
      console.log(`🎻 Conductor: Delegating Stripe event [${event.type}] to Make...`);

      await triggerAutomation("HANDLE_STRIPE_EVENT", {
        eventType: event.type,
        data: event.data.object,
        stripeId: (event.data.object as any).id
      });
    } else {
      console.log(`Ignored Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
