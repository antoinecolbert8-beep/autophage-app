import { BaseAgent } from "./base-agent";
import { generateContentWithGemini } from "../gemini-content";
import { db as prisma } from "@/core/db";
import { getRealTrends } from "../services/real-trends";


export class OpportunistAgent extends BaseAgent {
  constructor() {
    super("Opportunist", "Growth hacker et détecteur d'opportunités");
  }

  // Permet de lancer une campagne ciblée sur demande (Tool Calling)
  async createTargetedCampaign(topic: string) {
    console.log(`🎯[Opportunist] Commande reçue: Campagne ciblée sur "${topic}"`);

    // Simule une "opportunité" forcée
    const opportunity = {
      keyword: topic,
      volume: 0, // Inconnu
      growth: "MANUAL",
      urgency: "HIGH"
    };

    const campaign = await this.generateCampaign(opportunity);
    await this.triggerPublication(campaign);

    return {
      success: true,
      message: `Campagne sur "${topic}" créée et envoyée en validation.`,
      campaign
    };
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
    // REAL WORLD DATA - Google Trends RSS
    console.log("📊 [Opportunist] Scanning Global Pulse (Google Trends)...");

    // Try Fetch
    const realTrends = await getRealTrends('FR'); // Focus on France as configured

    if (realTrends && realTrends.length > 0) {
      console.log(`✅ ${realTrends.length} Live Trends Detected.`);
      return realTrends;
    }

    // Fallback only if RSS fails (network issue)
    console.warn("⚠️ RSS Failed, using fallback cache.");
    return [
      {
        keyword: "IA et productivité",
        volume: 5000,
        growth: "STABLE",
        urgency: "MEDIUM",
      }
    ];
  }

  private async selectBestOpportunity(trends: any[]) {
    if (trends.length === 0) return null;

    // Filtre les tendances urgentes
    const urgent = trends.filter((t) => t.urgency === "HIGH");

    if (urgent.length === 0) return trends[0];

    // Décide avec Gemini
    const context = `Tendances urgentes détectées: ${urgent.map((t) => t.keyword).join(", ")} `;
    const options = urgent.map(
      (t) => `${t.keyword} (${t.volume} recherches, ${t.growth})`
    );

    const decision = await this.decide(context, options);

    const selected = urgent.find((t) => decision.includes(t.keyword)) || urgent[0];

    console.log(`🎯[Opportunist] Opportunité sélectionnée: ${selected.keyword} `);

    return selected;
  }

  private async generateCampaign(opportunity: any) {
    console.log(`🚀[Opportunist] Génération campagne: ${opportunity.keyword} `);

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
    console.log(`📱[Opportunist] Sauvegarde et envoi en validation sur ${campaign.platforms.length} plateformes`);

    try {
      // Enregistrement réel en BDD
      // On cherche un user par défaut (le premier admin) pour attribuer la campagne
      // Dans une vraie app, on passerait le userId en contexte
      const admin = await prisma.user.findFirst({ where: { role: 'admin' } });

      if (admin) {
        await prisma.campaign.create({
          data: {
            name: `Campagne Auto: ${campaign.topic} `,
            type: "social",
            organizationId: admin.organizationId,
            messageTemplate: campaign.content,
            triggers: JSON.stringify({ type: "immediate" }),
            kpis: JSON.stringify({ sent: 0 }),
            active: true,
            targetPersona: "General Tech Audience"
          }
        });
        console.log("💾 Campagne sauvegardée en BDD");
      } else {
        console.warn("⚠️ Pas d'admin trouvé pour attribuer la campagne en BDD.");
      }
    } catch (e) {
      console.error("Erreur sauvegarde BDD:", e);
    }

    // Notifie le Manager Agent
    await this.sendMessage("Manager", `Campagne urgente créée: ${campaign.topic} `);

    return true;
  }
}





