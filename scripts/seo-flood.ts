
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
    const trends = await getRealTrends('FR');
    if (trends.length === 0) { console.error("❌ No Trends found."); return; }

    // 3. LOOP THROUGH TOP 5 TRENDS (Saturation Strategy)
    console.log(`🌊 FLOOD MODE: Targeting top ${trends.length} trends simultaneously...`);

    for (const trend of trends) {
        console.log(`\n🎯 Processing Trend: "${trend.keyword}"`);

        try {
            // Check urgency/volume to prioritize (optional, but good for "Real Work" feel)
            if (trend.volume < 1000) {
                console.log("   -> Skipping (Volume too low)");
                continue;
            }

            const assetData = await createContentAsset(
                project.id,
                trend.keyword,
                1500 // Longer authority articles
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
