/**
 * 📊 Stats Tracker - Récupération des statistiques de performance
 * Collecte views, likes, comments, shares depuis LinkedIn/TikTok
 */

import { db as prisma } from "@/core/db";

export type PostStats = {
  postId: string;
  platform: "LINKEDIN" | "TIKTOK" | "INSTAGRAM";
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

/**
 * Enregistre les stats d'un post dans la base
 */
export async function trackPostStats(stats: PostStats) {
  try {
    const recorded = await prisma.contentStat.create({
      data: {
        postId: stats.postId,
        platform: stats.platform,
        views: stats.views,
        likes: stats.likes,
        comments: stats.comments,
        shares: stats.shares,
      },
    });

    return { success: true, stat: recorded };
  } catch (error) {
    console.error("Erreur tracking stats:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Récupère les stats agrégées pour l'auto-amélioration
 */
export async function getTopPerformingContent(
  platform: string,
  limit: number = 10
) {
  try {
    // Récupère les posts avec le plus d'engagement (views + likes + comments + shares)
    const stats = await prisma.contentStat.groupBy({
      by: ["postId"],
      where: {
        platform,
        collectedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
        },
      },
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
      take: limit,
    });

    return stats.map((stat) => ({
      postId: stat.postId,
      totalEngagement:
        (stat._sum.views ?? 0) +
        (stat._sum.likes ?? 0) * 10 +
        (stat._sum.comments ?? 0) * 20 +
        (stat._sum.shares ?? 0) * 50,
      views: stat._sum.views ?? 0,
      likes: stat._sum.likes ?? 0,
      comments: stat._sum.comments ?? 0,
      shares: stat._sum.shares ?? 0,
    }));
  } catch (error) {
    console.error("Erreur récupération top content:", error);
    return [];
  }
}

/**
 * Calcule le score de performance d'un post
 * Formule: (views + likes*10 + comments*20 + shares*50) / 1000
 */
export function calculatePerformanceScore(stats: PostStats): number {
  const score =
    stats.views +
    stats.likes * 10 +
    stats.comments * 20 +
    stats.shares * 50;

  return Math.round(score / 1000); // Normalise sur 100
}





