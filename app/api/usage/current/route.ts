import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/db";

/**
 * GET /api/usage/current
 * Récupérer les quotas et l'usage actuel
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Récupérer l'usage du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usageThisMonth = await prisma.usageRecord.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const totalSpent = usageThisMonth.reduce(
      (sum, record) => sum + (record.withinQuota ? 0 : record.totalCharge),
      0
    );

    const usageByType = usageThisMonth.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      plan: user.currentPlan,
      quota: {
        limit: user.monthlyQuota,
        used: user.usedQuota,
        remaining: Math.max(0, user.monthlyQuota - user.usedQuota),
        percentage: Math.round((user.usedQuota / user.monthlyQuota) * 100),
      },
      usage: {
        totalThisMonth: usageThisMonth.length,
        withinQuota: usageThisMonth.filter(r => r.withinQuota).length,
        overQuota: usageThisMonth.filter(r => !r.withinQuota).length,
        byType: usageByType,
      },
      costs: {
        totalSpent: (totalSpent / 100).toFixed(2),
        currency: "EUR",
      },
      resetDate: user.quotaResetDate,
      subscription: user.subscription ? {
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
      } : null,
    });

  } catch (error: any) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


