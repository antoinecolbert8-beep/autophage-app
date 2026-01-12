/**
 * API Route: POST /api/brand/analyze
 * Analyse une URL et extrait logo, couleurs, fonts, keywords
 */

import { NextRequest, NextResponse } from "next/server";
import { scrapeBrand } from "@/lib/brand-scraper";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { url, userId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    console.log(`🔍 Analyse de la marque: ${url}`);

    // Scrape la marque
    const brandData = await scrapeBrand(url);

    // Sauvegarde dans la base
    const brandProfile = await prisma.brandProfile.create({
      data: {
        userId: userId || null,
        sourceUrl: url,
        logoUrl: brandData.logoUrl,
        primaryColor: brandData.primaryColor,
        secondaryColor: brandData.secondaryColor,
        fontFamily: brandData.fontFamily,
        keywords: brandData.keywords.join(','),
        rawMeta: brandData.rawMeta ? JSON.stringify(brandData.rawMeta) : undefined,
      },
    });

    // Si userId fourni, met à jour les préférences utilisateur
    if (userId) {
      await prisma.userPreference.upsert({
        where: { userId },
        update: {
          primaryColor: brandData.primaryColor,
          secondaryColor: brandData.secondaryColor,
          fontFamily: brandData.fontFamily,
          logoUrl: brandData.logoUrl,
        },
        create: {
          userId,
          primaryColor: brandData.primaryColor,
          secondaryColor: brandData.secondaryColor,
          fontFamily: brandData.fontFamily,
          logoUrl: brandData.logoUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      brand: brandProfile,
    });
  } catch (error) {
    console.error("Erreur analyse marque:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





