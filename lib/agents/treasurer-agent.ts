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

    // 5. Recommandations tarifaires
    const pricingRecommendations = await this.recommendPricing(profitMargin);

    await this.logAction("FINANCIAL_ANALYSIS", {
      aiCosts,
      revenue,
      profitMargin,
      recommendations: pricingRecommendations,
    });

    return { profitMargin, recommendations: pricingRecommendations };
  }

  private async analyzeAICosts() {
    // Simulation - En production, intégrer OpenAI/Gemini billing API
    const costs = {
      openai: 150, // €/mois
      gemini: 80,
      elevenlabs: 50,
      twilio: 120,
      total: 400,
    };

    return costs;
  }

  private async analyzeRevenue() {
    // Simulation - En production, intégrer Stripe
    const totalSubscriptions = await prisma.user.count({
      where: { subscription: { status: "active" } },
    });

    const avgPrice = 299; // Prix moyen abonnement
    return totalSubscriptions * avgPrice;
  }

  private async optimizeCosts(costs: any, currentMargin: number) {
    console.log(`⚠️ [Treasurer] Marge faible (${currentMargin.toFixed(1)}%), optimisation..`);

    const decisions = [];

    // Décision 1 : Limiter les modèles coûteux
    if (costs.openai > 100) {
      decisions.push("Switch GPT-4 → Gemini pour tâches simples (économie 30%)");
    }

    // Décision 2 : Rate limiting
    if (costs.twilio > 100) {
      decisions.push("Réduire campagnes téléphoniques de 20%");
    }

    // Décision 3 : Cache agressif
    decisions.push("Activer cache ChromaDB pour réduire appels embedding");

    console.log("💡 Décisions prises:", decisions);

    // Notifie les autres agents
    await this.sendMessage("Manager", "Réduction budgétaire: " + decisions.join(", "));

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





