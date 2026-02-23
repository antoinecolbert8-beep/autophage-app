import { NextRequest, NextResponse } from "next/server";
import { createAndUploadShort } from "@/lib/youtube-short-generator";
import { prisma } from "@/core/db";
import { calculateUsageCost } from "@/lib/stripe-pricing";

/**
 * POST /api/generate/short
 * Générer et uploader un YouTube Short
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, platform = "YOUTUBE" } = body;

    if (!userId || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: userId, topic" },
        { status: 400 }
      );
    }

    // Vérifier l'utilisateur et ses quotas
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Vérifier les quotas
    const withinQuota = user.usedQuota < user.monthlyQuota;

    if (!withinQuota && !user.subscription) {
      return NextResponse.json(
        { error: "Quota exceeded. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Calculer les coûts
    const planId = (user.currentPlan?.toUpperCase() || "STARTER") as "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE";
    const costs = calculateUsageCost("SHORT", planId);

    // Si hors quota, vérifier le moyen de paiement (Bypass pour les admins)
    if (!withinQuota && !user.stripeCustomerId && user.role !== 'admin') {
      return NextResponse.json(
        { error: "Payment method required for overage usage" },
        { status: 402 }
      );
    }

    // Générer le short
    console.log(`🎬 Génération short pour user ${userId}: "${topic}"`);

    const short = await createAndUploadShort(topic);

    // Sauvegarder dans la DB
    const video = await prisma.video.create({
      data: {
        userId,
        platform,
        title: short.script.title,
        description: short.script.description,
        script: JSON.stringify(short.script),
        hashtags: short.script.hashtags.join(','),
        keywords: short.script.keywords.join(','),
        videoUrl: short.videoUrl,
        thumbnailUrl: short.thumbnailUrl,
        platformVideoId: short.youtubeId,
        uploadStatus: short.uploadStatus === "success" ? "PUBLISHED" : "FAILED",
        aiCost: costs.aiCost,
        serviceFee: costs.serviceFee,
      },
    });

    // Enregistrer l'usage
    await prisma.usageRecord.create({
      data: {
        userId,
        type: "SHORT",
        platform,
        aiCost: costs.aiCost,
        serviceFee: costs.serviceFee,
        totalCharge: costs.total,
        withinQuota,
        videoId: video.id,
      },
    });

    // Mettre à jour les quotas
    await prisma.user.update({
      where: { id: userId },
      data: {
        usedQuota: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        youtubeId: short.youtubeId,
        url: short.youtubeId ? `https://youtube.com/shorts/${short.youtubeId}` : null,
      },
      usage: {
        withinQuota,
        quotaUsed: user.usedQuota + 1,
        quotaLimit: user.monthlyQuota,
        cost: withinQuota ? 0 : costs.totalEur,
      },
    });

  } catch (error: any) {
    console.error("Error generating short:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate/short
 * Récupérer l'historique des shorts générés
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const videos = await prisma.video.findMany({
      where: {
        userId,
        platform: "YOUTUBE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ videos });

  } catch (error: any) {
    console.error("Error fetching shorts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


