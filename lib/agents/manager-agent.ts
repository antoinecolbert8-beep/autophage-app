/**
 * 👔 Manager Agent - Directeur de cohérence et de marque
 * Vérifie que chaque publication respecte l'identité du client
 */

import { BaseAgent } from "./base-agent";
import { db as prisma } from "@/core/db";

export class ManagerAgent extends BaseAgent {
  constructor() {
    super("Manager", "Directeur de marque et garant de la cohérence");
  }

  async execute() {
    console.log("👔 [Manager] Audit de cohérence en cours...");

    // 1. Récupère les contenus en attente
    const pendingContent = await this.getPendingContent();

    if (pendingContent.length === 0) {
      console.log("👔 [Manager] Aucun contenu en attente");
      return null;
    }

    // 2. Valide chaque contenu
    const validations = [];
    for (const content of pendingContent) {
      const validation = await this.validateContent(content);
      validations.push(validation);

      if (!validation.approved) {
        await this.rejectContent(content, validation.reasons);
      }
    }

    await this.logAction("CONTENT_AUDIT", {
      total: pendingContent.length,
      approved: validations.filter((v) => v.approved).length,
      rejected: validations.filter((v) => !v.approved).length,
    });

    return validations;
  }

  private async getPendingContent() {
    // Récupère les posts en statut DRAFT ou SCHEDULED
    const posts = await prisma.post.findMany({
      where: {
        status: { in: ["DRAFT", "SCHEDULED"] },
      },
      include: {
        user: {
          include: {
            userPreference: true,
          },
        },
      },
      take: 10,
    });

    return posts;
  }

  private async validateContent(content: any) {
    console.log(`👔 [Manager] Validation de: ${content.id}`);

    const userPrefs = content.user?.userPreference;
    const brandProfile = await prisma.brandProfile.findFirst({
      where: { userId: content.userId },
    });

    const checks = {
      toneMatch: await this.checkTone(content.content, userPrefs?.tone),
      brandAlignment: await this.checkBrandAlignment(content.content, brandProfile),
      qualityScore: await this.assessQuality(content.content),
    };

    const reasons = [];
    let approved = true;

    if (!checks.toneMatch) {
      approved = false;
      reasons.push("Ton inadapté à la marque");
    }

    if (!checks.brandAlignment) {
      approved = false;
      reasons.push("Désalignement avec identité de marque");
    }

    if (checks.qualityScore < 70) {
      approved = false;
      reasons.push(`Qualité insuffisante (score: ${checks.qualityScore}/100)`);
    }

    console.log(`👔 [Manager] ${content.id}: ${approved ? "✅ APPROUVÉ" : "❌ REJETÉ"}`);

    return {
      contentId: content.id,
      approved,
      reasons,
      checks,
    };
  }

  private async checkTone(content: string, expectedTone?: string) {
    if (!expectedTone) return true;

    const prompt = `Le contenu suivant respecte-t-il un ton ${expectedTone} ?
Contenu: "${content}"
Réponds uniquement par OUI ou NON.`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text().trim().toUpperCase();

    return response.includes("OUI");
  }

  private async checkBrandAlignment(content: string, brandProfile: any) {
    if (!brandProfile || !brandProfile.keywords.length) return true;

    const brandKeywords = brandProfile.keywords.join(", ");

    const prompt = `Ce contenu est-il aligné avec ces valeurs de marque ?
Valeurs: ${brandKeywords}
Contenu: "${content}"
Réponds uniquement par OUI ou NON.`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text().trim().toUpperCase();

    return response.includes("OUI");
  }

  private async assessQuality(content: string): Promise<number> {
    const prompt = `Note la qualité de ce contenu sur 100.
Critères: clarté, engagement, valeur apportée.
Contenu: "${content}"
Réponds uniquement avec un nombre entre 0 et 100.`;

    const result = await this.model.generateContent(prompt);
    const scoreText = result.response.text().trim();

    const score = parseInt(scoreText.match(/\d+/)?.[0] || "70", 10);
    return Math.min(100, Math.max(0, score));
  }

  private async rejectContent(content: any, reasons: string[]) {
    console.log(`❌ [Manager] Contenu ${content.id} rejeté:`, reasons);

    await prisma.post.update({
      where: { id: content.id },
      data: {
        status: "BURNER", // Marqué comme à ne pas publier
      },
    });

    // Notifie le Créateur pour régénération
    await this.sendMessage("Creator", `Contenu ${content.id} rejeté: ${reasons.join(", ")}`);
  }
}





