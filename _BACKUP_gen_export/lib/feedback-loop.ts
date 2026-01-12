/**
 * 🔄 Feedback Loop - Système d'auto-amélioration du prompt système
 * Analyse les performances et ajuste la stratégie de création de contenu
 */

import { getTopPerformingContent } from "./stats-tracker";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type FeedbackAnalysis = {
  topPatterns: string[];
  recommendations: string[];
  newSystemPrompt: string;
  confidence: number;
};

/**
 * Analyse les top posts pour identifier les patterns gagnants
 */
export async function analyzeFeedback(
  platform: string = "LINKEDIN"
): Promise<FeedbackAnalysis> {
  // Récupère les top posts de la semaine
  const topContent = await getTopPerformingContent(platform, 10);

  if (topContent.length === 0) {
    return {
      topPatterns: [],
      recommendations: ["Pas assez de données pour l'analyse"],
      newSystemPrompt: getDefaultSystemPrompt(),
      confidence: 0,
    };
  }

  // Récupère le contenu réel des posts depuis la base
  const postIds = topContent.map((c) => c.postId);
  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, content: true },
  });

  // Prépare le contexte pour GPT-4
  const topPostsText = posts
    .map((post, i) => {
      const stats = topContent.find((c) => c.postId === post.id);
      return `
POST #${i + 1} (Engagement: ${stats?.totalEngagement ?? 0}):
${post.content}
---
Stats: ${stats?.views} vues, ${stats?.likes} likes, ${stats?.comments} commentaires, ${stats?.shares} partages
`;
    })
    .join("\n\n");

  // Demande à GPT-4 d'analyser les patterns
  const analysisPrompt = `
Analyse ces 10 meilleurs posts de la semaine et identifie les patterns de succès :

${topPostsText}

Fournis une réponse JSON avec :
{
  "topPatterns": ["pattern 1", "pattern 2", ...],
  "recommendations": ["recommandation 1", "recommandation 2", ...],
  "newSystemPrompt": "Nouveau prompt système optimisé pour reproduire ces patterns",
  "confidence": 0-100
}

Les patterns doivent couvrir :
- Structure (hook, body, CTA)
- Ton/Style
- Longueur
- Émojis
- Hashtags
- Appel à l'action
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en analyse de contenu viral. Tu identifies les patterns de succès avec précision.",
        },
        { role: "user", content: analysisPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(
      completion.choices[0].message.content ?? "{}"
    );

    return {
      topPatterns: analysis.topPatterns ?? [],
      recommendations: analysis.recommendations ?? [],
      newSystemPrompt: analysis.newSystemPrompt ?? getDefaultSystemPrompt(),
      confidence: analysis.confidence ?? 50,
    };
  } catch (error) {
    console.error("Erreur analyse feedback:", error);
    return {
      topPatterns: [],
      recommendations: ["Erreur lors de l'analyse"],
      newSystemPrompt: getDefaultSystemPrompt(),
      confidence: 0,
    };
  }
}

/**
 * Applique le nouveau prompt système (sauvegarde dans une config)
 */
export async function applyFeedback(analysis: FeedbackAnalysis) {
  // Sauvegarde le nouveau prompt dans un fichier de config
  const fs = await import("fs");
  const path = await import("path");

  const configPath = path.join(process.cwd(), "config", "system-prompt.json");

  // Crée le dossier si nécessaire
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const config = {
    systemPrompt: analysis.newSystemPrompt,
    patterns: analysis.topPatterns,
    recommendations: analysis.recommendations,
    confidence: analysis.confidence,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(`✅ Nouveau prompt système appliqué (confiance: ${analysis.confidence}%)`);

  return { success: true, config };
}

/**
 * Charge le prompt système actuel (ou retourne le défaut)
 */
export function getCurrentSystemPrompt(): string {
  try {
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(process.cwd(), "config", "system-prompt.json");

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config.systemPrompt;
    }
  } catch (error) {
    console.warn("Erreur chargement prompt système, utilisation défaut");
  }

  return getDefaultSystemPrompt();
}

function getDefaultSystemPrompt(): string {
  return `Tu écris des scripts ultra-viraux pour LinkedIn/TikTok.

Structure obligatoire :
1. HOOK (1 phrase, <10 mots, choc émotionnel)
2. VALEUR (3-4 bullets tactiques, pas de blabla)
3. CTA (clair, actionnable, crée FOMO)

Ton : Direct, sans filtre, anti-académique.
Évite : "je pense que", "il faut", langage corporate.
Préfère : Phrases courtes. Verbes d'action. Émojis stratégiques (max 3).

Longueur idéale : 150-250 caractères pour LinkedIn, 80-120 pour TikTok.`;
}





