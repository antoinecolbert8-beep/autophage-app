/**
 * API Route: GET /api/dashboard/unified-stats
 * Tableau de bord unifié - Toutes les métriques en un seul endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d

    const daysAgo = period === "30d" ? 30 : period === "90d" ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Statistiques agrégées
    const [
      totalActions,
      contentGenerated,
      leadsQualified,
      callsHandled,
      postsPublished,
      revenue,
    ] = await Promise.all([
      // Actions bot (likes, comments, visites)
      prisma.actionHistory.count({
        where: {
          createdAt: { gte: startDate },
          ...(userId && { userId }),
        },
      }),

      // Contenus générés
      prisma.post.count({
        where: {
          createdAt: { gte: startDate },
          ...(userId && { userId }),
        },
      }),

      // Leads qualifiés (simulation - à adapter selon ton schema)
      0, // TODO: compter leads depuis CRM

      // Appels gérés (téléphonie)
      prisma.actionHistory.count({
        where: {
          platform: "PHONE",
          createdAt: { gte: startDate },
        },
      }),

      // Posts publiés sur réseaux
      prisma.contentStat.groupBy({
        by: ["postId"],
        where: { collectedAt: { gte: startDate } },
      }).then((r) => r.length),

      // Revenue (simulation)
      0, // TODO: intégrer Stripe
    ]);

    // Top contenus
    const topContent = await prisma.contentStat.groupBy({
      by: ["postId"],
      where: { collectedAt: { gte: startDate } },
      _sum: {
        views: true,
        likes: true,
        comments: true,
        shares: true,
      },
      orderBy: {
        _sum: {
          views: "desc",
        },
      },
      take: 5,
    });

    // Activité par plateforme
    const activityByPlatform = await prisma.actionHistory.groupBy({
      by: ["platform"],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      period: `${daysAgo} derniers jours`,
      stats: {
        totalActions,
        contentGenerated,
        leadsQualified,
        callsHandled,
        postsPublished,
        revenue: `${revenue}€`,
      },
      topContent: topContent.map((c) => ({
        postId: c.postId,
        views: c._sum.views || 0,
        likes: c._sum.likes || 0,
        comments: c._sum.comments || 0,
        shares: c._sum.shares || 0,
        totalEngagement:
          (c._sum.views || 0) +
          (c._sum.likes || 0) * 10 +
          (c._sum.comments || 0) * 20 +
          (c._sum.shares || 0) * 50,
      })),
      activityByPlatform: activityByPlatform.map((a) => ({
        platform: a.platform,
        count: a._count,
      })),
    });
  } catch (error) {
    console.error("Erreur dashboard:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





