"use server";

import { SovereigntyManager } from "@/lib/analytics/sovereignty";
import { db as prisma } from "@/core/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function getSovereigntyStats() {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.organizationId) return null;

    return await SovereigntyManager.calculateScore(session.user.organizationId);
}
