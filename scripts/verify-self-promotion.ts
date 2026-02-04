
// scripts/verify-self-promotion.ts
import { ELASelfPromoter } from '@/lib/god-mode/self-promotion';
import * as dotenv from 'dotenv';
dotenv.config();

async function runVerification() {
    console.log("🧪 STARTING VERIFICATION: SMART SCHEDULER & OPENAI BRAIN");

    process.env.FORCE_POST = "true"; // FORCE execution for test

    try {
        console.log("🚀 Triggering Smart Scheduler (Hourly Check)...");
        const result = await ELASelfPromoter.orchestrateHourlyCheck();

        console.log("✅ VERIFICATION SUCCESS: Smart Scheduler executed.");
        console.log("📝 Results:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("❌ VERIFICATION FAILED with Exception:", error);
    }
}

runVerification();
