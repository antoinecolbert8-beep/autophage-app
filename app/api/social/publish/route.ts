/**
 * API Route: POST /api/social/publish
 * Publication multi-plateforme (Instagram, Facebook, TikTok, YouTube)
 */

import { NextRequest, NextResponse } from "next/server";
import { publishToMultiplePlatforms } from "@/lib/social-media-manager";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { consumeCredits } from "@/lib/billing";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, mediaUrls, hashtags, platforms } = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "content et platforms requis" },
        { status: 400 }
      );
    }

    // 🛡️ DÉBIT DE CRÉDITS
    await consumeCredits(session.user.organizationId, 'POST_PUBLISH');

    console.log(`📱 Publication sur : ${platforms.join(", ")}`);

    const results = await publishToMultiplePlatforms(
      {
        platform: platforms[0],
        content,
        mediaUrls,
        hashtags,
      },
      platforms
    );

    const successCount = Object.values(results).filter((r) => r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        total: platforms.length,
        published: successCount,
        failed: platforms.length - successCount,
      },
    });
  } catch (error) {
    console.error("Erreur publication:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





