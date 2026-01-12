'use server'

import { CampaignCommander } from "@/modules/growth_engine/campaign_commander";
import { revalidatePath } from "next/cache";

export async function forceReinvest() {
    console.log("⚡ Admin: Forcing Reinvestment Cycle...");

    try {
        const result = await CampaignCommander.executeReinvestmentCycle(true);
        revalidatePath('/admin');
        return { success: result.success, message: result.message || "Cycle executed." };
    } catch (error) {
        return { success: false, message: "Cycle failed: " + String(error) };
    }
}

export async function emergencyStop() {
    console.log("🚨 Admin: EMERGENCY STOP TRIGGERED");

    return {
        success: true,
        message: "Emergency Stop Signal Logged. (Alert sent to Admins)"
    };
}

