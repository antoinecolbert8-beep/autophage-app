/**
 * API Route: POST /api/content/gemini-generate
 * Génération de contenu avec Gemini AI Pro
 */

import { NextRequest, NextResponse } from "next/server";
import { generateContentWithGemini, generateImagePrompt } from "@/lib/gemini-content";
import { LegalSentinel } from "@/lib/security/legal-sentinel";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { consumeCredits } from '@/lib/billing';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, platform, contentType, tone, targetAudience, keywords, generateImages, boldness } = body;

    if (!topic || !platform) {
      return NextResponse.json(
        { error: "topic et platform requis" },
        { status: 400 }
      );
    }

    console.log(`🧠 Génération Gemini : ${topic} pour ${platform}`);

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const organizationId = (session.user as any).organizationId;

    // ── ARCHITECTURE SCELLÉE : Débit de crédits ────────────────────────
    // Coût variable : APEX (50) ou Analyse simple (15)
    const costType = contentType === 'TEXT' ? 'AI_ANALYSIS' : 'APEX_GENERATION';
    const billing = await consumeCredits(organizationId, costType);

    if (!billing.success) {
      return NextResponse.json({
        error: "Crédits insuffisants.",
        remaining: billing.remaining,
        required: costType === 'AI_ANALYSIS' ? 15 : 50
      }, { status: 402 });
    }
    // ───────────────────────────────────────────────────────────────────

    // Génère le contenu textuel
    const content = await generateContentWithGemini({
      topic,
      platform,
      contentType: contentType || "TEXT",
      tone,
      targetAudience,
      keywords,
      boldness,
    } as any);

    // --- NEW: LEGAL COMPLIANCE CHECK ---
    const compliance = await LegalSentinel.checkContent(
      content.text,
      platform,
      !!body.shopContext,
      body.userType === 'enterprise' ? 'enterprise' : 'individual'
    );

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
        compliance,
      },
      metadata: {
        platform,
        generatedAt: new Date().toISOString(),
        model: content.metadata?.model || "gemini-1.5-flash",
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





