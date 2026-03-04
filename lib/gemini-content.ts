/**
 * 🧠 Gemini AI Pro - Création de contenu avancée
 * Utilise Google Gemini 2.0 Flash pour génération multimodale
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { getSocialPostPrompt } from "@/lib/prompts/social-posts";
import { DalleService } from "@/lib/ai/dalle";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.VERTEX_AI_API_KEY || "");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export type ContentRequest = {
  topic: string;
  platform: "LINKEDIN" | "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "YOUTUBE_SHORT" | "NEWSLETTER";
  contentType: "TEXT" | "IMAGE_PROMPT" | "VIDEO_SCRIPT" | "CAROUSEL" | "HTML_NEWSLETTER";
  tone?: "professional" | "casual" | "inspirational" | "educational" | "viral";
  targetAudience?: string;
  keywords?: string[];
  length?: "short" | "medium" | "long";
  isEnterprise?: boolean;
  shopContext?: boolean;
};

export type ContentOutput = {
  text: string;
  hashtags: string[];
  imagePrompts?: string[];
  callToAction?: string;
  engagement_hooks?: string[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
  metadata?: Record<string, any>;
};

/**
 * Génère du contenu optimisé par plateforme avec Gemini
 */
export async function generateContentWithGemini(
  request: ContentRequest
): Promise<ContentOutput> {
  const modelName = "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const platformSpecs = getPlatformSpecs(request.platform);
  const toneGuide = getToneGuide(request.tone ?? "professional");

  const prompt = getSocialPostPrompt(request.topic, (request as any).boldness || 'challenger') + `
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
  "engagement_hooks": ["Question 1", "Question 2"],
  "seo": {
    "title": "Titre optimisé SEO",
    "description": "Meta description (155 caractères)",
    "keywords": ["mot-clé1", "mot-clé2", ...],
    "slug": "url-optimisee"
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return parseAIResponse(text, request.platform);
  } catch (error) {
    console.warn("⚠️ Gemini failed, falling back to OpenAI...", (error as Error).message);

    try {
      if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY non configurée");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Tu es un expert en marketing digital et SEO." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const text = completion.choices[0].message.content || "{}";
      return parseAIResponse(text, request.platform);
    } catch (openaiError) {
      console.error("❌ OpenAI fallback also failed:", openaiError);
      throw new Error(`AI generation failed: ${(error as Error).message}`);
    }
  }
}

/**
 * Парсинг JSON depuis la réponse de l'IA (Gemini ou OpenAI)
 */
function parseAIResponse(text: string, platform: string): ContentOutput {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || parsed.hook || text,
        hashtags: parsed.hashtags || [],
        imagePrompts: parsed.imagePrompts || [],
        callToAction: parsed.callToAction,
        engagement_hooks: parsed.engagement_hooks || [],
        seo: parsed.seo,
        metadata: {
          platform,
          generatedAt: new Date().toISOString(),
          model: text.includes("gpt") ? "gpt-4o" : "gemini-1.5-flash",
        },
      };
    } catch (e) {
      console.error("Error parsing AI JSON:", e);
    }
  }

  // Fallback si pas de JSON
  return {
    text,
    hashtags: extractHashtags(text),
    callToAction: "Qu'en penses-tu ?",
    metadata: {
      platform,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Génère une image avec DALL-E 3 (ou retourne le prompt si seulement le texte est demandé)
 */
export async function generateImageWithDalle(
  topic: string,
  style: "realistic" | "illustration" | "minimalist" | "3d" = "realistic",
  aspectRatio: "square" | "portrait" = "square"
): Promise<string> {
  try {
    const prompt = await generateImagePrompt(topic, style);
    const size = aspectRatio === "portrait" ? "1024x1792" : "1024x1024";

    // Si on est en mode "Automatique", on génère l'image
    const imageUrl = await DalleService.generateImage(prompt, size as any);
    return imageUrl;
  } catch (error) {
    console.warn("⚠️ DALL-E 3 failed, returning prompt text instead.");
    return await generateImagePrompt(topic, style);
  }
}

/**
 * Génère un prompt détaillé pour créer une image
 */
export async function generateImagePrompt(
  topic: string,
  style: "realistic" | "illustration" | "minimalist" | "3d" = "realistic"
): Promise<string> {
  const modelName = "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `Génère un prompt détaillé pour créer une image ${style} sur le thème : "${topic}".

Le prompt doit être optimisé pour DALL-E 3 et Midjourney.
Inclure :
- Sujet principal
- Style artistique (${style})
- Couleurs et éclairage
- Composition et focale
- Style cinématographique et premium

Format : Un seul paragraphe descriptif en anglais pour une meilleure précision avec DALL-E.`;

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
  const modelName = "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

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
    NEWSLETTER: "- Format : HTML sémantique (h1, h2, strong)\n- Style : Infolettre hebdomadaire premium\n- Structure : Édito + 3-5 points clés + Conclusion\n- SEO : Titre captivant, meta-description riche",
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





