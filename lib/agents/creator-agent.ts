import { BaseAgent } from "./base-agent";
import { triggerAutomation } from "../automations";
import { db as prisma } from "@/core/db";

export class CreatorAgent extends BaseAgent {
  constructor() {
    super("Creator", "Créateur autonome de micro-SaaS et produits numériques");
  }

  async execute() {
    console.log("🎨 [Creator] Recherche de niches inexploitées...");

    // 1. Identifie une niche
    const niche = await this.identifyNiche();

    if (!niche) {
      console.log("🎨 [Creator] Aucune niche prometteuse détectée");
      return null;
    }

    // 2. Génère le concept du micro-SaaS
    const concept = await this.generateConcept(niche);

    // 3. Génère le code MVP
    const code = await this.generateMVP(concept);

    // 4. Crée la landing page
    const landingPage = await this.generateLandingPage(concept);

    // 5. Lance la commercialisation
    await this.launchSales(concept, landingPage);

    await this.logAction("MICRO_SAAS_CREATED", {
      niche: niche.name,
      concept,
      mvpGenerated: !!code,
    });

    return {
      niche,
      concept,
      status: "LAUNCHED",
    };
  }

  private async identifyNiche() {
    const prompt = `Tu es un expert en identification de niches SaaS. Identifie UNE niche hyper-spécifique. Return JSON: { "name": "...", "problem": "...", "solution": "...", "marketSize": "...", "pricing": "..." }`;

    const result = await triggerAutomation('GENERATE_SMART_RESPONSE', { prompt });
    if (!result.success) return null;

    const text = result.data.response;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const niche = JSON.parse(jsonMatch[0]);
      console.log(`🎨 [Creator] Niche identifiée: ${niche.name}`);
      return niche;
    }

    return null;
  }

  private async generateConcept(niche: any) {
    const prompt = `Crée le concept détaillé d'un micro-SaaS pour cette niche: ${niche.name}. Return JSON: { "name": "...", "pitch": "...", "features": [], "stack": "...", "gtm": "..." }`;

    const result = await triggerAutomation('GENERATE_SMART_RESPONSE', { prompt });
    if (!result.success) return { name: niche.name, features: [] };

    const text = result.data.response;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { name: niche.name, features: [] };
  }

  private async generateMVP(concept: any) {
    console.log(`🎨 [Creator] Génération MVP: ${concept.name}`);

    const prompt = `Génère le code d'un MVP fonctionnel (one-page app/page.tsx Tailwind) pour: ${concept.name}. Features: ${concept.features?.join(", ")}`;

    const result = await triggerAutomation('GENERATE_LANDING_COPY', { prompt });
    return result.success ? result.data.copy : "// Error generating code";
  }

  private async generateLandingPage(concept: any) {
    console.log(`🎨 [Creator] Génération landing page: ${concept.name}`);

    const prompt = `Crée une landing page HTML Tailwind ultra-convertissante pour: ${concept.name}. Pitch: ${concept.pitch}`;

    const result = await triggerAutomation('GENERATE_LANDING_COPY', { prompt });
    return result.success ? result.data.copy : "<html>Error</html>";
  }

  private async launchSales(concept: any, landingPage: string) {
    console.log(`🎨 [Creator] Lancement des ventes pour: ${concept.name}`);

    // 💾 Marketplace Record (ELA Internal Marketplace)
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (admin) {
        await prisma.project.create({
            data: {
                name: concept.name,
                description: concept.pitch,
                organizationId: admin.organizationId,
                status: 'published',
                domain: `${concept.name.toLowerCase().replace(/\s+/g, '-')}.ela.ai`
            }
        });
    }

    return true;
  }
}
