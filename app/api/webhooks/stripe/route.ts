import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  handleSubscriptionCreated,
  handleSubscriptionRenewed,
  handlePaymentFailed,
} from '@/lib/billing/subscriptions';
import { triggerAutomation } from '@/lib/automations';
import { prisma } from '@/core/db';

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

      // New subscription (from checkout or direct API)
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      // One-time credit purchase completed (mode === 'payment')
      // Subscription checkouts are handled by customer.subscription.created
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.CheckoutSession;
        if (session.mode === 'payment') {
          const { handlePaymentSuccess } = await import('@/lib/billing/index');
          handlePaymentSuccess(session.id).catch(e =>
            console.error('❌ Credit provisioning failed:', e)
          );
        }
        break;
      }

      // Monthly renewal — add monthly credits
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handleSubscriptionRenewed(invoice);
        }
        break;
      }

      // Payment failed — notify user/suspend
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      // Subscription cancelled — suspend org
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;
        if (organizationId) {
          await prisma.organization.update({
            where: { id: organizationId },
            data: { status: 'suspended', tier: 'free', mrr: 0 },
          });

          const orgUser = await prisma.user.findFirst({ where: { organizationId } });
          if (orgUser) {
            await prisma.subscription.updateMany({
              where: { userId: orgUser.id, stripeSubscriptionId: subscription.id },
              data: { status: 'canceled', cancelAtPeriodEnd: false },
            });
          }
          console.log(`🔴 Subscription cancelled for org ${organizationId}`);
        }
        break;
      }

      default:
        console.log(`Ignored Stripe event: ${event.type}`);
    }

    // Delegate to Make.com automation for CRM/email/Slack flows
    const MAKE_DELEGATED_EVENTS = [
      'customer.subscription.created',
      'invoice.paid',
      'invoice.payment_failed',
      'customer.subscription.deleted',
      'checkout.session.completed'
    ];

    if (MAKE_DELEGATED_EVENTS.includes(event.type)) {
      await triggerAutomation("HANDLE_STRIPE_EVENT", {
        eventType: event.type,
        data: event.data.object,
        stripeId: (event.data.object as any).id,
      }).catch(e => console.error('Make.com delegation failed (non-blocking):', e));
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
