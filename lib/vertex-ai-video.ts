/**
 * 🎬 VERTEX AI VIDEO GENERATION
 * Génération de vraies vidéos déléguée à Make.com
 */

import { triggerAutomation } from "./automations";
import { ShortScript } from "./youtube-short-generator";

interface VertexVideoConfig {
  prompt: string;
  duration: number; // en secondes
  aspectRatio: "9:16"; // Vertical pour Shorts
  style?: string;
}

/**
 * 🎨 Générer une vidéo avec Vertex AI Imagen Video (via Make)
 * Retourne l'URL de la vidéo générée
 */
export async function generateVideoWithVertexAI(
  script: ShortScript,
  config: Partial<VertexVideoConfig> = {}
): Promise<string> {
  console.log("🎬 Délégation génération vidéo à Make.com...");

  const result = await triggerAutomation("GENERATE_VIDEO_VERTEX", {
    scriptHook: script.hook,
    scriptBody: script.body,
    keywords: script.keywords,
    config: {
      style: config.style || "modern, dynamic, professional",
      duration: 45,
      aspectRatio: "9:16"
    }
  });

  if (result.success && result.data?.videoUrl) {
    console.log("✅ Vidéo générée via Make:", result.data.videoUrl);
    return result.data.videoUrl;
  }

  throw new Error(`Erreur génération vidéo Make: ${result.message}`);
}

/**
 * 🎙️ Générer la voix avec Google Text-to-Speech (via Make)
 */
export async function generateVoiceWithGoogle(text: string): Promise<string> {
  console.log("🎙️ Délégation voix Google à Make.com...");

  const result = await triggerAutomation("GENERATE_VOICE_GOOGLE", {
    text,
    languageCode: "fr-FR",
    name: "fr-FR-Neural2-A"
  });

  if (result.success && result.data?.audioUrl) {
    return result.data.audioUrl;
  }

  throw new Error(`Erreur TTS Google via Make: ${result.message}`);
}

