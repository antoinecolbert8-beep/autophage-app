import "dotenv/config";
import { SalesAgent } from "../lib/agents/sales-agent";

async function main() {
    console.log("🚀 [FORCE_PROSPECTING] Surgical Run (1 Lead) for ELA...");
    const agent = new SalesAgent();
    
    // Override DAILY_LIMIT for this run
    (agent as any).DAILY_LIMIT = 1;

    try {
        const result = await agent.execute();
        console.log("✅ [FORCE_PROSPECTING] Execution completed:", JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error("❌ [FORCE_PROSPECTING] Execution failed:", error.message);
    }
}

main().catch(console.error);
