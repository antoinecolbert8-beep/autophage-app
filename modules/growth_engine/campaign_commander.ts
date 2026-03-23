import { env } from "@/core/env";
import { db } from "@/core/db";
import { Scheduler } from "@/modules/platform/scheduler";
import { transformPostToAd } from "@/modules/growth_engine/content_forge";
import { AdManager } from "@/modules/growth_engine/ad_manager";
import { LedgerService } from "@/modules/treasury/ledger.service";

export type ReinvestResult = {
    success: boolean;
    message?: string;
    spent?: number;
    adCopy?: any;
    error?: string;
};

export class CampaignCommander {
    static async executeReinvestmentCycle(ignoreThreshold: boolean = false): Promise<ReinvestResult> {
        // 1. Guardrail
        if (env.EMERGENCY_STOP_ADS === 'true') {
            return { success: false, message: "Emergency Stop Active" };
        }

        // 2. Read WarChest
        const warChest = await db.warChest.findUnique({ where: { id: "global-warchest" } });
        if (!warChest) {
            return { success: false, message: "WarChest not found" };
        }

        const budget = warChest.available_budget_cents;

        // 3. Threshold Check
        if (!ignoreThreshold && budget < 5000) {
            return { success: false, message: "Budget too low", spent: 0 };
        }

        // 4. Source Creative
        const bestPost = await Scheduler.getBestPerformingPost(7);
        if (!bestPost) {
            return { success: false, message: "No posts found", spent: 0 };
        }

        try {
            // 5. Generate Copy
            console.log(`Generating ad copy for post ${bestPost.id}...`);
            const adCopy = await transformPostToAd(bestPost.content);

            // 6. Execute Spend (Meta API) with Circuit Breaker
            let attempts = 0;
            let success = false;
            const maxRetries = 3;

            while (attempts < maxRetries && !success) {
                try {
                    attempts++;
                    // Fallback for simulation if no Meta ID
                    if (!env.META_AD_SET_ID || env.META_AD_SET_ID === "REMPLACER") {
                        console.log("🌐 [Simulation] Meta Ads ID missing. Simulating mass redistribution...");
                        success = true;
                        break;
                    }
                    await AdManager.updateAdSetBudget(env.META_AD_SET_ID || "", budget);
                    await AdManager.updateAdCreative(env.META_AD_SET_ID || "", adCopy);
                    success = true;
                } catch (error) {
                    console.error(`Meta API Attempt ${attempts} failed:`, error);
                    if (attempts === maxRetries) {
                        return { success: false, error: "Meta API Circuit Breaker Triggered" };
                    }
                }
            }

            // 7. Update Ledger
            if (success) {
                await LedgerService.recordAdSpend(budget, env.META_AD_SET_ID || "");
                return { success: true, spent: budget, adCopy };
            }

            return { success: false, message: "Failed to update Meta" };

        } catch (e) {
            console.error("Reinvest process failed", e);
            return { success: false, error: "Process failed: " + (e instanceof Error ? e.message : String(e)) };
        }
    }
}

