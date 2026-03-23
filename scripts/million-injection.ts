import { LedgerService } from "../modules/treasury/ledger.service";
import { CampaignCommander } from "../modules/growth_engine/campaign_commander";
import { db } from "../core/db";

async function main() {
    console.log("💰 [MillionInjection] Initializing 1,000,000€ Ads Redistribution...");

    const amountCents = 100000000; // 1,000,000.00 EUR

    try {
        // 1. Inject into Ledger (This auto-updates WarChest via LedgerService)
        console.log("📈 Recording manual injection in Treasury Ledger...");
        await LedgerService.recordRevenue(amountCents, `MILLION_ADS_INJECTION_${new Date().toISOString()}`, "usr_admin_genesis_2026");

        // 2. Verify WarChest
        const warChest = await db.warChest.findUnique({ where: { id: "global-warchest" } });
        console.log(`🏦 WarChest Balance: ${(warChest?.available_budget_cents || 0) / 100}€`);

        // 3. Trigger Ads Redistribution
        console.log("🚀 Triggering CampaignCommander Reinvestment Cycle...");
        const result = await CampaignCommander.executeReinvestmentCycle(true);

        if (result.success) {
            console.log(`✅ Success! Spent ${result.spent ?? 0 / 100}€ on mass redistribution.`);
        } else {
            console.warn(`⚠️ Cycle finished with message: ${result.message || result.error}`);
        }

    } catch (e) {
        console.error("❌ Fatal Injection Error:", e);
    }
}

main().catch(console.error);
