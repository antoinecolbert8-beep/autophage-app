import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Stripe from 'stripe';

/**
 * 🔑 ADMIN ONLY — Auto-configure Stripe Webhook Secret
 * Retrieves the existing webhook endpoint for this app's URL and returns the secret.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
    }

    try {
        const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' });
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

        // List all webhook endpoints
        const webhooks = await stripe.webhookEndpoints.list({ limit: 20 });
        let targetWebhook = webhooks.data.find(wh => wh.url.includes(appUrl.replace('https://', '').replace('http://', '')));

        if (!targetWebhook) {
            // Create a new webhook endpoint for this app
            targetWebhook = await stripe.webhookEndpoints.create({
                url: `${appUrl}/api/webhooks/stripe`,
                enabled_events: [
                    'checkout.session.completed',
                    'customer.subscription.created',
                    'customer.subscription.updated',
                    'customer.subscription.deleted',
                    'payment_intent.succeeded',
                    'payment_intent.payment_failed',
                    'invoice.paid',
                    'invoice.payment_failed',
                ],
            });
            console.log('✅ Stripe webhook endpoint created:', targetWebhook.id);
        }

        return NextResponse.json({
            status: 'ok',
            webhookId: targetWebhook.id,
            webhookUrl: targetWebhook.url,
            message: 'Stripe webhook endpoint found/created. Note: The signing secret is only available at creation time. Check your Stripe Dashboard → Webhooks to get the whsec_ value.',
            dashboardUrl: `https://dashboard.stripe.com/webhooks/${targetWebhook.id}`,
        });
    } catch (error: any) {
        console.error('[STRIPE CONFIG] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
