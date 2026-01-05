import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/core/env";
import { LedgerService } from "@/modules/treasury/ledger.service";

const stripe = new Stripe(env.STRIPE_SECRET, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
});

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        console.error("Missing signature or webhook secret");
        return NextResponse.json({ error: "Configuration error or missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : String(err)}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const amountReceived = paymentIntent.amount;
        const customerId = typeof paymentIntent.customer === 'string' ? paymentIntent.customer : paymentIntent.customer?.id;

        try {
            await LedgerService.recordRevenue(amountReceived, paymentIntent.id, customerId ?? undefined);
        } catch (e) {
            console.error("Ledger recording failed", e);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.cancel_at_period_end) {
            const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
            console.log(`Churn Risk Detected for ${customerId}. Engaging Antigravity...`);

            const { RetentionService } = await import("@/modules/antigravity/retention.service");
            await RetentionService.handleChurnRisk(customerId, "CANCEL_INTENT");
        }
    }

    return NextResponse.json({ received: true });
}

