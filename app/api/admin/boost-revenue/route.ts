import { NextResponse } from "next/server";
import { SalesAgent } from "@/lib/agents/sales-agent";
import { prisma } from "@/core/db";

export async function GET(req: Request) {
    try {
        console.log("🚀 [API Boost] Triggering Sales Machine...");
        const agent = new SalesAgent();
        
        const org = await prisma.organization.findFirst({ where: { name: { contains: 'ELA' } } });
        if (!org) return NextResponse.json({ error: "No ELA org found" }, { status: 404 });

        // 1. Outreach
        const prospectingResult = await agent.execute();
        
        // 2. Closing
        const closedCount = await agent.closeWarmLeads();

        return NextResponse.json({
            status: "SUCCESS",
            prospecting: prospectingResult,
            closed: closedCount
        });
    } catch (error: any) {
        console.error("❌ [API Boost] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
