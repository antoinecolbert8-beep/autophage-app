
import { ELASelfPromoter } from '@/lib/god-mode/self-promotion';
import * as dotenv from 'dotenv';
dotenv.config();

async function testViralGeneration() {
    console.log("🚀 TEST: VIRAL CONTENT GENERATION\n");

    process.env.FORCE_POST = "true"; // Force execution

    try {
        console.log("🧪 Generating viral content with ViralEngine...\n");
        const result = await ELASelfPromoter.orchestrateHourlyCheck();

        console.log("✅ VIRAL TEST COMPLETE");
        console.log("\n📊 Results:", JSON.stringify(result, null, 2));

        console.log("\n🔥 Check database for viral posts with:");
        console.log("   npx tsx scripts/check-publications.ts");

    } catch (error) {
        console.error("❌ TEST FAILED:", error);
    }
}

testViralGeneration();
