/**
 * API Route: POST /api/content/generate-video
 * Pipeline complet: Script → Audio → Vidéo
 */

import { NextRequest, NextResponse } from "next/server";
import { generateViralScript } from "@/lib/script-generator";
import { generateSpeech, VOICES } from "@/lib/elevenlabs-tts";
import { assembleVideo } from "@/lib/video-assembler";

export async function POST(req: NextRequest) {
  try {
    const { topic, niche, platform, voice, stockImages, seoKeyword } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic requis" }, { status: 400 });
    }

    console.log("🎬 Génération de contenu vidéo...");

    // 1. Génère le script viral
    console.log("📝 Étape 1: Génération du script...");
    const script = await generateViralScript({
      topic,
      niche,
      targetPlatform: platform ?? "TIKTOK",
      voice: "direct",
    });

    const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`;

    // 2. Génère l'audio (ElevenLabs)
    console.log("🎙️ Étape 2: Génération audio...");
    const audio = await generateSpeech({
      text: fullScript,
      voice: {
        voiceId: voice ?? VOICES.ANTONI,
        stability: 0.6,
        similarityBoost: 0.8,
      },
    });

    // 3. Prépare les scènes (algo dopamine: 3 sec par scène)
    console.log("🎨 Étape 3: Préparation des scènes...");
    const sceneDuration = 3; // Coupe toutes les 3 secondes
    const totalScenes = Math.ceil(audio.duration / sceneDuration);

    const scenes = (stockImages ?? []).slice(0, totalScenes).map((imgUrl: string, i: number) => ({
      imageUrl: imgUrl,
      durationSec: sceneDuration,
      textOverlay: i === 0 ? script.hook : undefined,
    }));

    // Si pas assez d'images, répète la dernière
    while (scenes.length < totalScenes) {
      scenes.push({
        imageUrl: scenes[scenes.length - 1]?.imageUrl ?? "/placeholder.jpg",
        durationSec: sceneDuration,
      });
    }

    // 4. Assemble la vidéo
    console.log("🎬 Étape 4: Assemblage vidéo...");
    const video = await assembleVideo({
      scenes,
      audioUrl: audio.url,
      outputFilename: `video-${Date.now()}.mp4`,
      seoKeyword,
    });

    if (!video.success) {
      return NextResponse.json(
        { error: video.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      script,
      audio: audio.url,
      video: video.outputPath,
      hashtags: script.hashtags,
    });
  } catch (error) {
    console.error("Erreur pipeline vidéo:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





