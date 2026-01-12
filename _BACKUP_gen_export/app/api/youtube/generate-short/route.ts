import { NextResponse } from "next/server";
import { createAndUploadShort, generateViralShortsBatch } from "@/lib/youtube-short-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max

/**
 * 🎬 API: Générer un YouTube Short
 * POST /api/youtube/generate-short
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, batch } = body;

    if (!topic && !batch) {
      return NextResponse.json(
        { error: "Paramètre 'topic' ou 'batch' requis" },
        { status: 400 }
      );
    }

    // Mode batch: plusieurs sujets
    if (batch && Array.isArray(batch)) {
      console.log(`🚀 Mode BATCH: ${batch.length} shorts à générer`);
      const results = await generateViralShortsBatch(batch);
      
      return NextResponse.json({
        success: true,
        mode: "batch",
        count: results.length,
        results,
        summary: {
          total: results.length,
          success: results.filter(r => r.uploadStatus === "success").length,
          error: results.filter(r => r.uploadStatus === "error").length,
        },
      });
    }

    // Mode single: un seul sujet
    console.log(`🎬 Mode SINGLE: Génération pour "${topic}"`);
    const result = await createAndUploadShort(topic);

    return NextResponse.json({
      success: true,
      mode: "single",
      result,
    });
  } catch (error) {
    console.error("❌ Erreur génération YouTube Short:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      },
      { status: 500 }
    );
  }
}

/**
 * 📋 GET: Statut et configuration
 */
export async function GET() {
  const hasYouTubeKeys = !!(
    process.env.YOUTUBE_API_KEY &&
    process.env.YOUTUBE_CLIENT_ID &&
    process.env.YOUTUBE_CLIENT_SECRET
  );

  const hasGeminiKey = !!process.env.GOOGLE_API_KEY;
  const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;

  return NextResponse.json({
    status: "ready",
    configuration: {
      youtubeApi: hasYouTubeKeys ? "✅ Configuré" : "⚠️ Manquant",
      geminiAi: hasGeminiKey ? "✅ Configuré" : "⚠️ Manquant",
      elevenLabs: hasElevenLabsKey ? "✅ Configuré" : "⚠️ Optionnel",
    },
    features: {
      scriptGeneration: hasGeminiKey,
      voiceoverGeneration: hasElevenLabsKey,
      youtubeUpload: hasYouTubeKeys,
    },
  });
}




