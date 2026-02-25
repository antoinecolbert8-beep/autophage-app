/**
 * API Route: GET /api/dashboard/unified-stats
 * Tableau de bord unifié — Métriques réelles avec session guard
 * Fix C-1: Session obligatoire. orgId dérivé de la session (jamais du query param).
 * Fix C-5: leadsQualified et revenue reliés aux données réelles.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // ── FIX C-1: Authentification obligatoire ──────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const period = searchParams.get("period") || "7d";

    const daysAgo = period === "30d" ? 30 : period === "90d" ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // ── Résolution sécurisée de l'organisation via session ────────────────────
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, organizationId: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orgId = user.organizationId;

    // ── Requêtes agrégées en parallèle ────────────────────────────────────────
    const [
      totalActions,
      contentGenerated,
      leadsQualified,
      callsHandled,
      postsPublished,
      org,
      topContent,
      activityByPlatform,
    ] = await Promise.all([
      // Actions bot (likes, comments, visites)
      prisma.actionHistory.count({
        where: { userId: user.id, createdAt: { gte: startDate } },
      }),

      // Contenus générés
      prisma.post.count({
        where: { userId: user.id, createdAt: { gte: startDate } },
      }),

      // Leads qualifiés — FIX C-5: données réelles depuis org
      prisma.lead.count({
        where: { organizationId: orgId, createdAt: { gte: startDate } },
      }),

      // Appels gérés (téléphonie)
      prisma.actionHistory.count({
        where: { userId: user.id, platform: "PHONE", createdAt: { gte: startDate } },
      }),

      // Posts publiés avec stats
      prisma.contentStat.groupBy({
        by: ["postId"],
        where: { collectedAt: { gte: startDate } },
      }).then((r) => r.length),

      // Organisation avec campagnes actives
      prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          mrr: true,
          creditBalance: true,
          tier: true,
          campaigns: { where: { active: true }, select: { id: true } },
        },
      }),

      // Top contenus par engagement
      prisma.contentStat.groupBy({
        by: ["postId"],
        where: { collectedAt: { gte: startDate } },
        _sum: { views: true, likes: true, comments: true, shares: true },
        orderBy: { _sum: { views: "desc" } },
        take: 5,
      }),

      // Activité par plateforme
      prisma.actionHistory.groupBy({
        by: ["platform"],
        where: { userId: user.id, createdAt: { gte: startDate } },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      period: `${daysAgo} derniers jours`,
      stats: {
        totalActions,
        contentGenerated,
        leadsQualified,
        callsHandled,
        postsPublished,
        revenue: `${org?.mrr ?? 0}€`,       // FIX C-5: MRR réel
        activeCampaigns: org?.campaigns?.length ?? 0,
        creditBalance: org?.creditBalance ?? 0,
        tier: org?.tier ?? 'starter',
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
