
import { PrismaClient } from "@prisma/client";
import { getRealTrends } from "../lib/services/real-trends";
import { createContentAsset } from "../lib/content/authority-engine";

const prisma = new PrismaClient();

export async function runHighVolumeSEO() {
    console.log("🚀 ACTIVATING HIGH-VELOCITY SEO PUBLISHER...");

    // 1. Get Admin Org & Project
    const adminOrg = await prisma.organization.findFirst();
    if (!adminOrg) { console.error("❌ No Organization found."); return; }

    let project = await prisma.project.findFirst({ where: { organizationId: adminOrg.id } });
    if (!project) {
        project = await prisma.project.create({
            data: { name: "Autophage Main Site", domain: "autophage.app", organizationId: adminOrg.id }
        });
    }

    // 2. Fetch Real Trends (Wait for RSS)
    let trends = [];
    try {
        trends = await getRealTrends('FR');
    } catch (e) {
        console.warn("⚠️ Trend fetch failed, using fallback high-impact keywords.");
    }

    if (trends.length === 0) {
        console.log("🛠️ Using FALLBACK SEO Strategy...");
        trends = [
            { keyword: "Meilleure AI pour entreprise 2026", volume: 15000 },
            { keyword: "Automatisation marketing souveraine", volume: 8000 },
            { keyword: "Gagner 50k par mois avec l'affiliation IA", volume: 12000 },
            { keyword: "ELA Revolution avis et test", volume: 5000 },
            { keyword: "Infrastructure IA performance", volume: 4000 }
        ];
    }

    // 3. LOOP THROUGH TRENDS (Saturation Strategy)
    console.log(`🌊 FLOOD MODE: Targeting ${trends.length} keywords simultaneously...`);

    for (const trend of trends) {
        console.log(`\n🎯 Processing: "${trend.keyword}"`);

        try {
            const assetData = await createContentAsset(
                project.id,
                trend.keyword,
                1800 // High authority length
            );

            await prisma.contentAsset.create({
                data: {
                    ...assetData,
                    publishedAt: new Date(),
                    lastUpdated: new Date()
                }
            });

            console.log(`   ✅ PUBLISHED: "${assetData.title}"`);

        } catch (error: any) {
            console.error(`   ❌ Failed for "${trend.keyword}":`, error.message);
        }
    }

    console.log("\n🏆 SEO FLOOD COMPLETE. Domination Strategy Active.");
}

// Allow standalone execution if run directly
if (require.main === module) {
    runHighVolumeSEO();
}
