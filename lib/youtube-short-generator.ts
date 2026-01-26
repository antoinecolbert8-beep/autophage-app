"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { generateVideoWithVertexAI, generateVoiceWithGoogle } from "./vertex-ai-video";
import { triggerAutomation } from "./automations";

export type ShortScript = {
  hook: string;
  body: string[];
  cta: string;
  keywords: string[];
  title: string;
  description: string;
  hashtags: string[];
};

export type ShortVideo = {
  script: ShortScript;
  videoUrl?: string;
  thumbnailUrl?: string;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  youtubeId?: string;
};

/**
 * 🎬 GÉNÉRATEUR DE YOUTUBE SHORTS
 * Génère un script viral optimisé pour YouTube Shorts via Make
 */
export async function generateShortScript(topic: string): Promise<ShortScript> {
  const result = await triggerAutomation("GENERATE_SHORT_SCRIPT", {
    topic
  });

  if (result.success && result.data?.script) {
    return result.data.script;
  }

  throw new Error("Erreur génération script via Make");
}

/**
 * 🎙️ GÉNÉRATION AUDIO
 * Utilise Google Text-to-Speech (via Vertex AI Video module refactorisé)
 */
export async function generateVoiceover(script: ShortScript): Promise<string> {
  const fullText = `${script.hook}. ${script.body.join(". ")}. ${script.cta}`;
  console.log("📢 Texte pour voiceover delegated to Make:", fullText);
  return await generateVoiceWithGoogle(fullText);
}

/**
 * 🎨 GÉNÉRATION VIDÉO
 * Utilise Vertex AI Imagen Video (via Vertex AI Video module refactorisé)
 */
export async function generateVideoFromScript(script: ShortScript): Promise<string> {
  console.log("🎬 Génération vidéo delegated to Make pour:", script.title);
  return await generateVideoWithVertexAI(script);
}

/**
 * 📤 UPLOAD SUR YOUTUBE
 * Délégué à Make.com (Module YouTube)
 */
export async function uploadToYouTube(video: ShortVideo): Promise<string> {
  console.log("📤 Upload sur YouTube via Make...");

  const result = await triggerAutomation("UPLOAD_YOUTUBE_VIDEO", {
    videoUrl: video.videoUrl,
    title: video.script.title,
    description: video.script.description,
    tags: video.script.keywords,
    privacyStatus: "public"
  });

  if (result.success && result.data?.youtubeId) {
    console.log("✅ Upload réussite via Make! ID:", result.data.youtubeId);
    return result.data.youtubeId;
  }

  // Simulation ID if Make returns success but no ID (async)
  if (result.success) {
    return "PENDING_MAKE_UPLOAD";
  }

  throw new Error(`Erreur upload YouTube via Make: ${result.message}`);
}

/**
 * 🚀 PIPELINE COMPLET
 * Génère et upload un YouTube Short de A à Z
 */
export async function createAndUploadShort(topic: string): Promise<ShortVideo> {
  console.log("🎬 DÉMARRAGE GÉNÉRATION YOUTUBE SHORT");
  console.log("Sujet:", topic);

  // Étape 1: Générer le script
  console.log("\n📝 Étape 1/4: Génération du script...");
  const script = await generateShortScript(topic);
  console.log("✅ Script généré:", script.title);

  // Étape 2: Générer le voiceover
  console.log("\n🎙️ Étape 2/4: Génération du voiceover...");
  const audioUrl = await generateVoiceover(script);
  console.log("✅ Audio généré:", audioUrl);

  // Étape 3: Générer la vidéo
  console.log("\n🎨 Étape 3/4: Génération de la vidéo...");
  const videoUrl = await generateVideoFromScript(script);
  console.log("✅ Vidéo générée:", videoUrl);

  // Étape 4: Upload sur YouTube
  console.log("\n📤 Étape 4/4: Upload sur YouTube...");
  const video: ShortVideo = {
    script,
    videoUrl,
    uploadStatus: "uploading",
  };

  try {
    const youtubeId = await uploadToYouTube(video);
    video.youtubeId = youtubeId;
    video.uploadStatus = "success";
    console.log("✅ Upload réussi! ID:", youtubeId);
  } catch (error) {
    console.error("❌ Erreur upload:", error);
    video.uploadStatus = "error";
  }

  console.log("\n🎉 GÉNÉRATION TERMINÉE !");
  return video;
}

/**
 * 🔥 GÉNÉRATEUR DE CONTENU VIRAL EN MASSE
 * Génère plusieurs shorts d'un coup sur différents sujets
 */
export async function generateViralShortsBatch(topics: string[]): Promise<ShortVideo[]> {
  console.log(`🚀 Génération de ${topics.length} YouTube Shorts...`);

  const results: ShortVideo[] = [];

  for (const topic of topics) {
    try {
      const short = await createAndUploadShort(topic);
      results.push(short);

      // Délai entre chaque génération pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erreur pour "${topic}":`, error);
      results.push({
        script: {
          hook: "Erreur",
          body: [],
          cta: "",
          keywords: [],
          title: topic,
          description: "",
          hashtags: [],
        },
        uploadStatus: "error",
      });
    }
  }

  console.log(`✅ Batch terminé: ${results.filter(r => r.uploadStatus === "success").length}/${topics.length} réussis`);
  return results;
}


