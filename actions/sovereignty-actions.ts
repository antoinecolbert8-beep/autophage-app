"use server";

import { SovereigntyManager } from "@/lib/analytics/sovereignty";
import { db as prisma } from "@/core/db";

export async function getSovereigntyStats() {
    // In a real app, we'd get the orgId from the session/user
    // For now, we take the first organization as the "Sovereign" one
    const org = await prisma.organization.findFirst();
    if (!org) return null;

    return await SovereigntyManager.calculateScore(org.id);
}
