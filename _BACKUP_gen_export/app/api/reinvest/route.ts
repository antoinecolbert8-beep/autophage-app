import { NextResponse } from "next/server";
import { CampaignCommander } from "@/modules/growth_engine/campaign_commander";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const result = await CampaignCommander.executeReinvestmentCycle();

        if (result.error) {
            console.error("Critical Reinvest Error:", result.error);
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (e) {
        console.error("Reinvest process failed", e);
        return NextResponse.json({ error: "Process failed: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
    }
}

