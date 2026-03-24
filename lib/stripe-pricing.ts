/**
 * 💰 STRIPE PRICING & BILLING SYSTEM
 * Gestion des abonnements, pay-per-use et frais de service
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || "", {
  apiVersion: "2023-10-16",
});

// ============================================================================
// 📊 PLANS & PRICING
// ============================================================================

export const PLANS = {
  STARTER: {
    id: "starter",
    name: "ELA Starter",
    price: 37,
    currency: "eur",
    interval: "month" as const,
    quota: 1000, // credits/month - Upgraded from 500
    stripePriceId: process.env.STRIPE_PRICE_STARTER_LIVE || "price_starter_eur_monthly",
    paymentLink: "https://buy.stripe.com/7sY00j6gZ1tt2mp9A18EM04",
    features: [
      "1000 crédits/mois",
      "APEX Basic Generation",
      "PULSE Email Outreach",
      "Sitemap SEO Dynamique",
      "Support standard",
    ],
    overage: 0,
  },
  PRO: {
    id: "pro",
    name: "ELA Pro",
    price: 197,
    currency: "eur",
    interval: "month" as const,
    quota: 5000, // Upgraded from 2500
    stripePriceId: process.env.STRIPE_PRICE_PRO_LIVE || "price_pro_eur_monthly",
    paymentLink: "https://buy.stripe.com/4gM14n20J4FFe579A18EM05",
    features: [
      "5000 crédits/mois",
      "APEX Full Generation",
      "PULSE Multi-Canal",
      "Rapports hebdomadaires",
      "Support prioritaire",
    ],
    overage: 0,
  },
  SUPREME: {
    id: "supreme",
    name: "ELA Supreme",
    price: 497,
    currency: "eur",
    interval: "month" as const,
    quota: 15000,
    stripePriceId: process.env.STRIPE_PRICE_SUPREME_LIVE || "price_supreme_eur_monthly",
    paymentLink: "https://buy.stripe.com/4gM14n20J4FFe579A18EM05", // Fixed: Removed _BUSINESS suffix
    features: [
      "15000 crédits/mois",
      "Accès API Dédié",
      "Marque blanche complète",
      "Account Manager Dédié",
      "Priorité absolue",
    ],
    overage: 0,
  },
  EMPIRE: {
    id: "empire",
    name: "ELA Empire",
    price: 1497,
    currency: "eur",
    interval: "month" as const,
    quota: 50000, // Credits massively increased for Empire
    stripePriceId: process.env.STRIPE_PRICE_EMPIRE_LIVE || "price_empire_eur_monthly",
    paymentLink: "https://buy.stripe.com/fZu7sL6gZfkj4uxfYp8",
    features: [
      "50000 crédits/mois",
      "Infrastructure Serveur Dédiée",
      "SLA 99.99% Garanti",
      "Custom Workflow Design",
    ],
    overage: 0,
  },
} as const;

export type PlanId = keyof typeof PLANS;

// ============================================================================
// 💳 FRAIS DE SERVICE (MARKUP)
// ============================================================================

/**
 * Calcule les frais de service sur un coût IA
 * @param aiCost Coût IA en centimes
 * @param plan Plan de l'utilisateur
 * @returns Frais de service en centimes
 */
export function calculateServiceFee(aiCost: number, plan: PlanId): number {
  // Markup de 100% sur les coûts IA
  const markup = 1.0; // 100%

  // Réduction selon le plan
  const discounts = {
    STARTER: 0,      // Pas de réduction
    PRO: 0.1,        // -10%
    SUPREME: 0.2,    // -20%
    EMPIRE: 0.3,     // -30%
    BUSINESS: 0.2,   // Legacy compat
    ENTERPRISE: 0.3, // Legacy compat
  };

  const baseFee = aiCost * markup;
  const discount = baseFee * discounts[plan];

  return Math.round(baseFee - discount);
}

/**
 * Calcule le coût total d'une automatisation
 */
export function calculateUsageCost(type: "SHORT" | "REEL" | "CARROUSEL", plan: PlanId) {
  // Coûts IA estimés (en centimes)
  const aiCosts = {
    SHORT: 53,      // ~$0.53 (GPT-4 + TTS + Vertex AI)
    REEL: 53,       // Même coût
    CARROUSEL: 20,  // ~$0.20 (GPT-4 + images)
  };

  const aiCost = aiCosts[type];
  const serviceFee = calculateServiceFee(aiCost, plan);
  const total = aiCost + serviceFee;

  return {
    aiCost,
    serviceFee,
    total,
    totalEur: (total / 100).toFixed(2),
  };
}

// ============================================================================
// 🔄 CHECKOUT & SUBSCRIPTIONS
// ============================================================================

/**
 * Créer une session Stripe Checkout pour un abonnement
 * AUDIT FIX: success_url pointe vers /onboarding?welcome=true pour guider le nouvel utilisateur.
 */
export async function createCheckoutSession(params: {
  userId?: string;
  userEmail: string;
  organizationId?: string;
  planId: PlanId;
  successUrl: string;
  cancelUrl: string;
}) {
  const { userId, userEmail, organizationId, planId, cancelUrl } = params;

  const plan = PLANS[planId];

  if (!plan.stripePriceId) {
    throw new Error(
      `[Stripe] Aucun Price ID configuré pour le plan ${planId}. ` +
      `Ajoutez STRIPE_PRICE_${planId} dans votre .env avec un vrai ID Stripe (ex: price_xxxxxxxxx).`
    );
  }

  // AUDIT FIX: Guard contre les placeholder IDs encore en place
  const placeholderPattern = /^price_(starter|pro|business|enterprise)_eur_monthly$/;
  if (placeholderPattern.test(plan.stripePriceId)) {
    throw new Error(
      `[Stripe] Le Price ID "${plan.stripePriceId}" est un placeholder ! ` +
      `Créez un vrai produit dans votre Stripe Dashboard et mettez à jour STRIPE_PRICE_${planId}.`
    );
  }

  // AUDIT FIX: Toujours rediriger vers /onboarding après paiement
  // Le ?session_id permet au webhook de trouver la session si nécessaire
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const onboardingSuccessUrl = `${appUrl}/onboarding?welcome=true&session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    client_reference_id: userId || "guest_" + Date.now(),
    mode: "subscription",
    payment_method_types: ["card"], // Specific allowed methods instead of automatic if SDK is older
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        userId: userId || "",
        organizationId: organizationId || "",
        plan: planId,
        tierId: planId,
        monthlyCredits: plan.quota.toString(),
        isGuest: (!userId).toString(),
      },
    },
    success_url: onboardingSuccessUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return session;
}

/**
 * Créer un Customer Portal Stripe
 */
export async function createCustomerPortal(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Upgrader/Downgrader un abonnement
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  newPlanId: PlanId;
}) {
  const { subscriptionId, newPlanId } = params;
  const newPlan = PLANS[newPlanId];

  if (!newPlan.stripePriceId) {
    throw new Error(`Plan ${newPlanId} n'a pas de Price ID`);
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPlan.stripePriceId,
      },
    ],
    proration_behavior: "create_prorations", // Prorata automatique
  });

  return updatedSubscription;
}

/**
 * Annuler un abonnement (à la fin de la période)
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

/**
 * Réactiver un abonnement annulé
 */
export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}

// ============================================================================
// 💸 PAY-PER-USE (USAGE-BASED BILLING)
// ============================================================================

/**
 * Enregistrer l'usage pour facturation
 * Stripe facturera automatiquement à la fin du mois
 */
export async function recordUsage(params: {
  subscriptionId: string;
  quantity: number; // Nombre d'unités (ex: 1 vidéo)
  timestamp?: number;
  action?: string; // Description de l'action
}) {
  const { subscriptionId, quantity, timestamp, action } = params;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Trouver l'item de facturation usage-based
  const usageItem = subscription.items.data.find(
    (item) => item.price.recurring?.usage_type === "metered"
  );

  if (!usageItem) {
    throw new Error("Aucun usage metered trouvé pour cet abonnement");
  }

  const usageRecord = await stripe.subscriptionItems.createUsageRecord(
    usageItem.id,
    {
      quantity,
      timestamp: timestamp || Math.floor(Date.now() / 1000),
      action: (action as 'increment' | 'set') || "increment",
    }
  );

  return usageRecord;
}

/**
 * Créer une facture one-time pour usage additionnel
 */
export async function createUsageInvoice(params: {
  customerId: string;
  amount: number; // en centimes
  description: string;
  metadata?: Record<string, string>;
}) {
  const { customerId, amount, description, metadata } = params;

  // Créer un invoice item
  await stripe.invoiceItems.create({
    customer: customerId,
    amount,
    currency: "eur",
    description,
    metadata,
  });

  // Créer et finaliser la facture
  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true, // Finaliser automatiquement
    collection_method: "charge_automatically",
  });

  return invoice;
}

// ============================================================================
// 📊 ANALYTICS & REPORTING
// ============================================================================

/**
 * Récupérer les revenus d'une période
 */
export async function getRevenue(params: {
  startDate: Date;
  endDate: Date;
}) {
  const { startDate, endDate } = params;

  const charges = await stripe.charges.list({
    created: {
      gte: Math.floor(startDate.getTime() / 1000),
      lte: Math.floor(endDate.getTime() / 1000),
    },
    limit: 100,
  });

  const totalRevenue = charges.data.reduce((sum, charge) => {
    return sum + (charge.amount - charge.amount_refunded);
  }, 0);

  return {
    totalRevenue: totalRevenue / 100, // en euros
    chargesCount: charges.data.length,
    charges: charges.data,
  };
}

/**
 * Récupérer l'usage d'un client
 */
export async function getCustomerUsage(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId, {
    expand: ["subscriptions"],
  });

  return customer;
}

// ============================================================================
// 🎁 COUPONS & PROMOTIONS
// ============================================================================

/**
 * Créer un coupon de réduction
 */
export async function createCoupon(params: {
  percentOff?: number;
  amountOff?: number;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  maxRedemptions?: number;
  code?: string;
}) {
  const coupon = await stripe.coupons.create({
    percent_off: params.percentOff,
    amount_off: params.amountOff,
    currency: params.amountOff ? "eur" : undefined,
    duration: params.duration,
    duration_in_months: params.durationInMonths,
    max_redemptions: params.maxRedemptions,
    name: params.code,
  });

  return coupon;
}

// ============================================================================
// 📧 WEBHOOKS HELPERS
// ============================================================================

/**
 * Vérifier la signature d'un webhook Stripe
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET non configuré");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export { stripe };


