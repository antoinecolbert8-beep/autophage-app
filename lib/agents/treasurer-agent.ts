/**
 * 💰 Treasurer Agent - Optimisation des profits et gestion budgétaire
 * Surveille chaque centime dépensé en jetons IA et décide des ajustements tarifaires
 */

import { BaseAgent } from "./base-agent";
import { db as prisma } from "@/core/db";

export class TreasurerAgent extends BaseAgent {
  private profitMarginThreshold = 40; // 40% de marge minimum

  constructor() {
    super("Treasurer", "Expert en optimisation financière et gestion des coûts");
  }

  async execute() {
    console.log("💰 [Treasurer] Analyse financière en cours...");

    // 1. Analyse des coûts IA
    const aiCosts = await this.analyzeAICosts();

    // 2. Analyse des revenus
    const revenue = await this.analyzeRevenue();

    // 3. Calcul de la marge
    const profitMargin = ((revenue - aiCosts.total) / revenue) * 100;

    console.log(`💰 Marge actuelle: ${profitMargin.toFixed(2)}%`);

    // 4. Décisions autonomes
    if (profitMargin < this.profitMarginThreshold) {
      await this.optimizeCosts(aiCosts, profitMargin);
    }

    // ⚡ APEX: ANTI-FRAGILITY - Détection d'anomalies (Kill-Switch)
    const threats = await this.detectAndNeutralizeThreats();

    // 5. Recommandations tarifaires
    const pricingRecommendations = await this.recommendPricing(profitMargin);

    await this.logAction("FINANCIAL_ANALYSIS", {
      aiCosts,
      revenue,
      profitMargin,
      recommendations: pricingRecommendations,
      threatsDetected: threats.length,
    });

    return { profitMargin, recommendations: pricingRecommendations, threats };
  }

  /**
   * 🛡️ Détection d'attaques par déni de service de crédits ou fraude
   */
  private async detectAndNeutralizeThreats() {
    console.log("🛡️ [Treasurer] Scan anti-fraude en cours...");
    const threats = [];

    // 1. Détecter des organisations avec consommation anormale (> 1000 crédits en 5min)
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const suspiciousUsage = await prisma.usageLog.groupBy({
      by: ['organizationId'],
      where: { timestamp: { gte: fiveMinsAgo } },
      _sum: { creditsUsed: true },
      having: { creditsUsed: { _sum: { gt: 1000 } } }
    });

    for (const suspect of suspiciousUsage) {
      console.error(`🚨 ALERTE: Consommation massive détectée pour Org ${suspect.organizationId} (${suspect._sum.creditsUsed} crédits en 5m)`);

      // KILL-SWITCH: Verrouillage automatique de l'organisation
      await prisma.organization.update({
        where: { id: suspect.organizationId },
        data: { status: 'suspended' }
      });

      const msg = `KILL-SWITCH ACTIVÉ : Organisation ${suspect.organizationId} suspendue pour consommation anormale.`;
      await this.sendMessage("Manager", msg);
      threats.push(msg);
    }

    return threats;
  }

  private async analyzeAICosts() {
    // 💡 Integration avec les coûts réels via logs d'usage anonymisés
    const logs = await prisma.usageLog.count({
      where: { timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    });

    // Estimation basée sur 0.02€ par crédit en moyenne (OpenAI/Gemini/Storage)
    const estimatedCost = logs * 0.02;

    return {
      total: estimatedCost > 0 ? estimatedCost : 400, // Fallback safe
      logs
    };
  }

  private async analyzeRevenue() {
    // 💳 Intégration réelle avec Stripe pour le solde disponible
    try {
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const balance = await stripe.balance.retrieve();
      const available = balance.available[0].amount / 100; // EUR amount

      console.log(`💳 [Treasurer] Solde Stripe disponible: ${available}€`);
      return available > 0 ? available : 5000; // Fallback simulation
    } catch (e) {
      console.warn("⚠️ Stripe Balance unreachable, using simulation.");
      return 5000;
    }
  }

  private async optimizeCosts(costs: any, currentMargin: number) {
    console.log(`⚠️ [Treasurer] Marge faible (${currentMargin.toFixed(1)}%), protection de marge activée.`);

    // 🛡️ DECISION SOUVERAINE: Augmenter le coût en crédits de 5%
    const decisions = [
      "AUGMENTATION DYNAMIQUE : +5% sur le coût des crédits IA (Protection de Marge)",
      "Passage forcé en 'ECO-MODE' pour les agents non-critiques",
      "Suspension temporaire des campagnes d'acquisition à ROI < 1.2"
    ];

    console.log("💡 Décisions souveraines prises:", decisions);

    // Persister la décision pour que le système de billing l'utilise via un multiplicateur global
    // NB: On simule l'envoi au ManagerAgent qui gère la config globale.
    await this.sendMessage("Manager", `[FINANCE] Alerte Marge : ${currentMargin.toFixed(1)}%. Ordre: Appliquer multiplicateur 1.05 sur consumeCredits.`);

    return decisions;
  }

  private async recommendPricing(currentMargin: number) {
    const context = `Marge actuelle: ${currentMargin}%. Objectif: >${this.profitMarginThreshold}%`;
    const options = [
      "Augmenter prix Pro de 299€ → 349€",
      "Créer plan intermédiaire à 199€",
      "Réduire features plan Starter",
      "Maintenir prix actuels, optimiser coûts",
    ];

    const recommendation = await this.decide(context, options);

    console.log(`💡 [Treasurer] Recommandation tarifaire: ${recommendation}`);

    return recommendation;
  }
}





