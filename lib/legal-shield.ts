/**
 * ⚖️ Legal Shield - Conformité RGPD et quotas LinkedIn
 * Scanne chaque action pour garantir la conformité légale
 */

import { db as prisma } from "@/core/db";
import { getOpenAIClient } from "./ai/openai-client";

export type ComplianceCheck = {
  action: string;
  content?: string;
  userId: string;
  platform: string;
};

export type ComplianceResult = {
  allowed: boolean;
  score: number; // 0-100
  risks: string[];
  warnings: string[];
  quotaStatus: {
    daily: number;
    weekly: number;
    limit: number;
  };
};

// Quotas LinkedIn conservateurs (évite le ban)
const LINKEDIN_QUOTAS = {
  DAILY_ACTIONS: 100, // Likes + comments + messages
  DAILY_CONNECTIONS: 20,
  DAILY_MESSAGES: 30,
  WEEKLY_ACTIONS: 500,
};

/**
 * Vérifie la conformité d'une action
 */
export async function checkCompliance(check: ComplianceCheck): Promise<ComplianceResult> {
  const risks: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. Vérifie les quotas
  const quotaCheck = await checkQuotas(check.userId, check.platform);

  if (quotaCheck.dailyActions >= LINKEDIN_QUOTAS.DAILY_ACTIONS) {
    score -= 50;
    risks.push("Quota quotidien LinkedIn atteint (100 actions/jour)");
  }

  if (quotaCheck.dailyMessages >= LINKEDIN_QUOTAS.DAILY_MESSAGES) {
    score -= 30;
    warnings.push("Limite de messages approchée (30/jour)");
  }

  // 2. Analyse du contenu (RGPD + spam)
  if (check.content) {
    const contentAnalysis = await analyzeContent(check.content);

    if (contentAnalysis.isSpammy) {
      score -= 40;
      risks.push("Contenu détecté comme spam potentiel");
    }

    if (contentAnalysis.hasPersonalData) {
      score -= 20;
      warnings.push("Données personnelles détectées (RGPD)");
    }

    if (contentAnalysis.isTooPromo) {
      score -= 15;
      warnings.push("Contenu trop commercial");
    }
  }

  // 3. Vérifie la fréquence (rate limiting)
  const recentActions = await prisma.actionHistory.count({
    where: {
      userId: check.userId,
      platform: check.platform,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Dernière heure
      },
    },
  });

  if (recentActions > 20) {
    score -= 25;
    warnings.push("Activité trop rapide (>20 actions/heure)");
  }

  const allowed = score >= 50; // Seuil de sécurité

  return {
    allowed,
    score: Math.max(0, score),
    risks,
    warnings,
    quotaStatus: {
      daily: quotaCheck.dailyActions,
      weekly: quotaCheck.weeklyActions,
      limit: LINKEDIN_QUOTAS.DAILY_ACTIONS,
    },
  };
}

/**
 * Analyse le contenu d'un message
 */
async function analyzeContent(content: string): Promise<{
  isSpammy: boolean;
  hasPersonalData: boolean;
  isTooPromo: boolean;
}> {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Plus rapide et moins cher pour cette tâche
      messages: [
        {
          role: "system",
          content: `Analyse ce message et réponds en JSON :
{
  "isSpammy": true/false,
  "hasPersonalData": true/false (emails, téléphones, adresses),
  "isTooPromo": true/false (trop de liens/vente agressive)
}`,
        },
        { role: "user", content },
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      isSpammy: analysis.isSpammy || false,
      hasPersonalData: analysis.hasPersonalData || false,
      isTooPromo: analysis.isTooPromo || false,
    };
  } catch (error) {
    console.error("Erreur analyse contenu:", error);
    return { isSpammy: false, hasPersonalData: false, isTooPromo: false };
  }
}

/**
 * Vérifie les quotas utilisateur
 */
async function checkQuotas(userId: string, platform: string) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [dailyActions, weeklyActions, dailyMessages] = await Promise.all([
    prisma.actionHistory.count({
      where: {
        userId,
        platform,
        createdAt: { gte: oneDayAgo },
      },
    }),
    prisma.actionHistory.count({
      where: {
        userId,
        platform,
        createdAt: { gte: oneWeekAgo },
      },
    }),
    prisma.actionHistory.count({
      where: {
        userId,
        platform,
        action: { in: ["DM_SENT", "COMMENT_REPLY"] },
        createdAt: { gte: oneDayAgo },
      },
    }),
  ]);

  return { dailyActions, weeklyActions, dailyMessages };
}

/**
 * Affiche le score de sécurité en temps réel
 */
export async function getSecurityScore(userId: string): Promise<{
  overall: number;
  details: {
    quotaUsage: number;
    contentSafety: number;
    rateLimiting: number;
  };
  recommendation: string;
}> {
  const dailyActions = await prisma.actionHistory.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const quotaUsage = Math.min(100, (dailyActions / LINKEDIN_QUOTAS.DAILY_ACTIONS) * 100);
  const contentSafety = 85; // TODO: calculer depuis historique
  const rateLimiting = dailyActions > 50 ? 60 : 90;

  const overall = Math.round((quotaUsage + contentSafety + rateLimiting) / 3);

  let recommendation = "";
  if (overall >= 80) {
    recommendation = "✅ Activité saine, continue comme ça !";
  } else if (overall >= 60) {
    recommendation = "⚠️ Ralentis un peu pour éviter les alertes";
  } else {
    recommendation = "🛑 STOP ! Risque de bannissement élevé";
  }

  return {
    overall,
    details: {
      quotaUsage: Math.round(100 - quotaUsage),
      contentSafety: Math.round(contentSafety),
      rateLimiting: Math.round(rateLimiting),
    },
    recommendation,
  };
}





