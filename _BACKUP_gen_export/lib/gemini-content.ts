/**
 * 🧠 Gemini AI Pro - Création de contenu avancée
 * Utilise Google Gemini 2.0 Flash pour génération multimodale
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export type ContentRequest = {
  topic: string;
  platform: "LINKEDIN" | "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "YOUTUBE_SHORT";
  contentType: "TEXT" | "IMAGE_PROMPT" | "VIDEO_SCRIPT" | "CAROUSEL";
  tone?: "professional" | "casual" | "inspirational" | "educational" | "viral";
  targetAudience?: string;
  keywords?: string[];
  length?: "short" | "medium" | "long";
};

export type ContentOutput = {
  text: string;
  hashtags: string[];
  imagePrompts?: string[];
  callToAction?: string;
  engagement_hooks?: string[];
  metadata?: Record<string, any>;
};

/**
 * Génère du contenu optimisé par plateforme avec Gemini
 */
export async function generateContentWithGemini(
  request: ContentRequest
): Promise<ContentOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const platformSpecs = getPlatformSpecs(request.platform);
  const toneGuide = getToneGuide(request.tone ?? "professional");

  const prompt = `Tu es un expert en création de contenu viral pour ${request.platform}.

**Sujet** : ${request.topic}
**Audience** : ${request.targetAudience ?? "professionnels"}
**Ton** : ${toneGuide}
**Type** : ${request.contentType}

**Contraintes ${request.platform}** :
${platformSpecs}

${request.keywords?.length ? `**Mots-clés à intégrer** : ${request.keywords.join(", ")}` : ""}

**Génère un contenu optimisé** avec :
1. **Texte principal** (respecte les contraintes de longueur)
2. **Hook d'accroche** (première phrase ultra-engageante)
3. **Call-to-Action** clair
4. **Hashtags stratégiques** (${getHashtagCount(request.platform)} hashtags)
5. **Prompts visuels** (si applicable, 3-5 descriptions d'images)

**Format JSON attendu** :
{
  "text": "Contenu principal...",
  "hook": "Première phrase choc",
  "callToAction": "CTA clair",
  "hashtags": ["#tag1", "#tag2", ...],
  "imagePrompts": ["Description image 1", "Description image 2", ...],
  "engagement_hooks": ["Question 1", "Question 2"]
}

**IMPORTANT** : Évite le ton "ChatGPT". Sois direct, authentique, actionnable.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON depuis la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || parsed.hook || text,
        hashtags: parsed.hashtags || [],
        imagePrompts: parsed.imagePrompts || [],
        callToAction: parsed.callToAction,
        engagement_hooks: parsed.engagement_hooks || [],
        metadata: {
          platform: request.platform,
          generatedAt: new Date().toISOString(),
          model: "gemini-2.0-flash-exp",
        },
      };
    }

    // Fallback si pas de JSON
    return {
      text,
      hashtags: extractHashtags(text),
      callToAction: "Qu'en penses-tu ?",
      metadata: {
        platform: request.platform,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error(`Gemini API error: ${(error as Error).message}`);
  }
}

/**
 * Génère une image avec Gemini (description pour Midjourney/DALL-E)
 */
export async function generateImagePrompt(
  topic: string,
  style: "realistic" | "illustration" | "minimalist" | "3d" = "realistic"
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Génère un prompt détaillé pour créer une image ${style} sur le thème : "${topic}".

Le prompt doit être optimisé pour Midjourney/DALL-E et inclure :
- Sujet principal
- Style artistique (${style})
- Couleurs dominantes
- Ambiance/émotion
- Composition
- Éclairage
- Détails techniques (8K, professional, etc.)

Format : Un seul paragraphe, descriptif et précis.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Analyse de contenu concurrent (scraping + insights)
 */
export async function analyzeCompetitorContent(
  competitorContent: string[],
  niche: string
): Promise<{ insights: string[]; recommendations: string[] }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Analyse ces contenus performants dans la niche "${niche}" :

${competitorContent.map((c, i) => `**Post ${i + 1}** :\n${c}\n`).join("\n")}

Identifie :
1. **Patterns de succès** (structure, ton, hooks)
2. **Éléments viraux** (émotions, formats)
3. **Recommandations actionnables** pour surpasser ces contenus

Format JSON :
{
  "insights": ["Pattern 1", "Pattern 2", ...],
  "recommendations": ["Action 1", "Action 2", ...]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return { insights: [], recommendations: [] };
}

// === Helpers ===

function getPlatformSpecs(platform: string): string {
  const specs: Record<string, string> = {
    LINKEDIN: "- Longueur : 1300-2000 caractères\n- Ton professionnel mais authentique\n- Structure : Hook + Valeur + CTA\n- Émojis modérés (2-3 max)",
    INSTAGRAM: "- Caption : 150-300 caractères\n- Émojis abondants (5-8)\n- Storytelling visuel\n- Hashtags : 10-15",
    FACEBOOK: "- Texte : 100-250 caractères\n- Conversationnel et engageant\n- Questions pour booster interactions\n- Hashtags : 2-3 max",
    TIKTOK: "- Caption : 80-150 caractères\n- Ton décalé et viral\n- Appel à l'action direct\n- Hashtags tendances : 3-5",
    YOUTUBE_SHORT: "- Titre : 60 caractères max\n- Description : 100-200 caractères\n- Hook immédiat (3 premières secondes)\n- Hashtags : 3-5",
  };

  return specs[platform] || specs.LINKEDIN;
}

function getToneGuide(tone: string): string {
  const guides: Record<string, string> = {
    professional: "Professionnel mais accessible, expertise sans jargon",
    casual: "Conversationnel, comme entre amis, authentique",
    inspirational: "Motivant, storytelling émotionnel, transformation",
    educational: "Pédagogique, step-by-step, actionnable",
    viral: "Provocateur, contrarian, crée la controverse (intelligemment)",
  };

  return guides[tone] || guides.professional;
}

function getHashtagCount(platform: string): number {
  const counts: Record<string, number> = {
    LINKEDIN: 5,
    INSTAGRAM: 15,
    FACEBOOK: 3,
    TIKTOK: 5,
    YOUTUBE_SHORT: 5,
  };

  return counts[platform] || 5;
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g);
  return matches || [];
}





