/**
 * API Route: POST /api/feedback/analyze
 * Lance l'analyse des performances et met à jour le prompt système
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeFeedback, applyFeedback } from "@/lib/feedback-loop";

export async function POST(req: NextRequest) {
  try {
    const { platform, apply } = await req.json();

    console.log(`🔄 Analyse feedback pour ${platform ?? "LINKEDIN"}...`);

    // Analyse les performances
    const analysis = await analyzeFeedback(platform ?? "LINKEDIN");

    // Applique le nouveau prompt si demandé
    if (apply && analysis.confidence >= 60) {
      await applyFeedback(analysis);
    }

    return NextResponse.json({
      success: true,
      analysis,
      applied: apply && analysis.confidence >= 60,
    });
  } catch (error) {
    console.error("Erreur analyse feedback:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





