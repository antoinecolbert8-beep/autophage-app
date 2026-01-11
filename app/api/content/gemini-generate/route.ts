/**
 * API Route: POST /api/content/gemini-generate
 * Génération de contenu avec Gemini AI Pro
 */

import { NextRequest, NextResponse } from "next/server";
import { generateContentWithGemini, generateImagePrompt } from "@/lib/gemini-content";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, platform, contentType, tone, targetAudience, keywords, generateImages } = body;

    if (!topic || !platform) {
      return NextResponse.json(
        { error: "topic et platform requis" },
        { status: 400 }
      );
    }

    console.log(`🧠 Génération Gemini : ${topic} pour ${platform}`);

    // Génère le contenu textuel
    const content = await generateContentWithGemini({
      topic,
      platform,
      contentType: contentType || "TEXT",
      tone,
      targetAudience,
      keywords,
    });

    // Génère les prompts d'images si demandé
    let imagePrompts = content.imagePrompts || [];
    if (generateImages && imagePrompts.length === 0) {
      const prompt = await generateImagePrompt(topic, "realistic");
      imagePrompts = [prompt];
    }

    return NextResponse.json({
      success: true,
      content: {
        ...content,
        imagePrompts,
      },
      metadata: {
        platform,
        generatedAt: new Date().toISOString(),
        model: "gemini-2.0-flash-exp",
      },
    });
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





