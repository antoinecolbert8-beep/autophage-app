/**
 * API Route: POST /api/social/publish
 * Publication multi-plateforme (Instagram, Facebook, TikTok, YouTube)
 */

import { NextRequest, NextResponse } from "next/server";
import { publishToMultiplePlatforms } from "@/lib/social-media-manager";

export async function POST(req: NextRequest) {
  try {
    const { content, mediaUrls, hashtags, platforms } = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "content et platforms requis" },
        { status: 400 }
      );
    }

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





