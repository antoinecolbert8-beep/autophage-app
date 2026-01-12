"use server";

import { scrapeBrand } from "@/lib/brand-scraper";
import { db } from "@/core/db";

export async function captureBrandProfile(userId: string, url: string) {
  const snap = await scrapeBrand(url);

  const profile = await db.brandProfile.create({
    data: {
      userId,
      sourceUrl: url,
      logoUrl: snap.logoUrl,
      primaryColor: snap.primaryColor,
      secondaryColor: snap.secondaryColor,
      fontFamily: snap.fontFamily,
      keywords: snap.keywords.join(','),
      rawMeta: snap.rawMeta ? JSON.stringify(snap.rawMeta) : undefined,
    },
  });

  // Upsert des préférences pour appliquer au front
  await db.userPreference.upsert({
    where: { userId },
    update: {
      logoUrl: snap.logoUrl ?? undefined,
      primaryColor: snap.primaryColor ?? undefined,
      secondaryColor: snap.secondaryColor ?? undefined,
      fontFamily: snap.fontFamily ?? undefined,
    },
    create: {
      userId,
      logoUrl: snap.logoUrl ?? undefined,
      primaryColor: snap.primaryColor ?? undefined,
      secondaryColor: snap.secondaryColor ?? undefined,
      fontFamily: snap.fontFamily ?? undefined,
    },
  });

  return { success: true, profile };
}






