import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

/**
 * 📈 REPORT USAGE TO STRIPE
 * Envoie la consommation réelle à Stripe pour facturation au compteur (Metered Billing)
 */
export async function reportUsageToStripe(subscriptionItemId: string, quantity: number) {
    try {
        console.log(`📡 Reporting usage to Stripe: ${quantity} units for Item ${subscriptionItemId}`);

        await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
            quantity,
            timestamp: Math.floor(Date.now() / 1000),
            action: 'increment',
        });

        return { success: true };
    } catch (error) {
        console.error("⚠️ Échec du reporting d'usage Stripe:", error);
        return { success: false, error };
    }
}

/**
 * Find the metered subscription item for a Stripe subscription
 */
export async function getMeteredSubscriptionItem(subscriptionId: string): Promise<string | null> {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const usageItem = subscription.items.data.find(
            (item) => item.price.recurring?.usage_type === "metered"
        );
        return usageItem?.id || null;
    } catch (error) {
        console.error("❌ Error retrieving Stripe subscription:", error);
        return null;
    }
}
