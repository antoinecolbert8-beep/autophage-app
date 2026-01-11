/**
 * 🎯 Opportunist Agent - Growth Hacker 24/7
 * Scrape les tendances mondiales et génère des campagnes immédiates
 */

import { BaseAgent } from "./base-agent";
import { generateContentWithGemini } from "../gemini-content";

export class OpportunistAgent extends BaseAgent {
  constructor() {
    super("Opportunist", "Growth hacker et détecteur d'opportunités");
  }

  async execute() {
    console.log("🎯 [Opportunist] Scan des opportunités mondiales...");

    // 1. Scrape tendances
    const trends = await this.scrapeTrends();

    // 2. Identifie la meilleure opportunité
    const bestOpportunity = await this.selectBestOpportunity(trends);

    if (!bestOpportunity) {
      console.log("🎯 [Opportunist] Aucune opportunité détectée");
      return null;
    }

    // 3. Génère campagne immédiate
    const campaign = await this.generateCampaign(bestOpportunity);

    // 4. Déclenche publication
    await this.triggerPublication(campaign);

    await this.logAction("OPPORTUNITY_SEIZED", {
      trend: bestOpportunity,
      campaign,
    });

    return campaign;
  }

  private async scrapeTrends() {
    // Simulation - En production, intégrer Google Trends API + X API
    const mockTrends = [
      {
        keyword: "IA et emploi 2025",
        volume: 15000,
        growth: "+250%",
        urgency: "HIGH",
      },
      {
        keyword: "Automatisation entreprise",
        volume: 8000,
        growth: "+120%",
        urgency: "MEDIUM",
      },
      {
        keyword: "ChatGPT alternatives",
        volume: 12000,
        growth: "+180%",
        urgency: "HIGH",
      },
    ];

    console.log("📊 Tendances détectées:", mockTrends.length);
    return mockTrends;
  }

  private async selectBestOpportunity(trends: any[]) {
    if (trends.length === 0) return null;

    // Filtre les tendances urgentes
    const urgent = trends.filter((t) => t.urgency === "HIGH");

    if (urgent.length === 0) return trends[0];

    // Décide avec Gemini
    const context = `Tendances urgentes détectées: ${urgent.map((t) => t.keyword).join(", ")}`;
    const options = urgent.map(
      (t) => `${t.keyword} (${t.volume} recherches, ${t.growth})`
    );

    const decision = await this.decide(context, options);

    const selected = urgent.find((t) => decision.includes(t.keyword)) || urgent[0];

    console.log(`🎯 [Opportunist] Opportunité sélectionnée: ${selected.keyword}`);

    return selected;
  }

  private async generateCampaign(opportunity: any) {
    console.log(`🚀 [Opportunist] Génération campagne: ${opportunity.keyword}`);

    // Génère contenu avec Gemini
    const content = await generateContentWithGemini({
      topic: opportunity.keyword,
      platform: "LINKEDIN",
      contentType: "TEXT",
      tone: "viral",
      keywords: [opportunity.keyword],
    });

    return {
      topic: opportunity.keyword,
      content: content.text,
      hashtags: content.hashtags,
      urgency: opportunity.urgency,
      platforms: ["LINKEDIN", "INSTAGRAM", "FACEBOOK"],
    };
  }

  private async triggerPublication(campaign: any) {
    console.log(`📱 [Opportunist] Publication immédiate sur ${campaign.platforms.length} plateformes`);

    // Notifie le Manager Agent
    await this.sendMessage("Manager", `Campagne urgente créée: ${campaign.topic}`);

    // TODO: Appeler l'API de publication
    // await publishToMultiplePlatforms(campaign.content, campaign.platforms);

    return true;
  }
}





