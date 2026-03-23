const Stripe = require('stripe');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;

async function setupWebhook() {
    console.log(`🔌 [STRIPE API] Attempting to setup webhook for ${PUBLIC_URL}...`);

    try {
        // 1. List existing webhooks to avoid duplicates
        const endpoints = await stripe.webhookEndpoints.list();
        const existing = endpoints.data.find(ep => ep.url.includes(new URL(PUBLIC_URL).hostname));

        if (existing) {
            console.log(`♻️  Updating existing endpoint: ${existing.id}`);
            const updated = await stripe.webhookEndpoints.update(existing.id, {
                url: `${PUBLIC_URL}/api/webhooks/stripe`,
                enabled_events: [
                    'checkout.session.completed',
                    'invoice.paid',
                    'invoice.payment_failed',
                    'customer.subscription.deleted',
                    'customer.subscription.created'
                ]
            });
            console.log(`✅ Webhook updated! New Secret: ${updated.secret}`);
            return updated.secret;
        } else {
            console.log(`🆕 Creating new endpoint...`);
            const created = await stripe.webhookEndpoints.create({
                url: `${PUBLIC_URL}/api/webhooks/stripe`,
                enabled_events: [
                    'checkout.session.completed',
                    'invoice.paid',
                    'invoice.payment_failed',
                    'customer.subscription.deleted',
                    'customer.subscription.created'
                ]
            });
            console.log(`✅ Webhook created! ID: ${created.id}`);
            console.log(`🔑 STRIPE_WEBHOOK_SECRET should be: ${created.secret}`);
            return created.secret;
        }
    } catch (err) {
        console.error(`❌ Stripe API Error: ${err.message}`);
        if (err.message.includes('permission')) {
            console.log("💡 Suggestion: The restricted key doesn't have Webhook permissions. Manual dashboard setup required.");
        }
    }
}

setupWebhook();
