/**
 * API Route: POST /api/agents/run
 * Lance les agents autonomes manuellement ou tous ensemble
 */

import { NextRequest, NextResponse } from "next/server";
import { SwarmOrchestrator } from "@/lib/agents/swarm-orchestrator";

export async function POST(req: NextRequest) {
  try {
    const { agent } = await req.json();

    const swarm = new SwarmOrchestrator();

    let results;

    if (agent && ["treasurer", "opportunist", "manager", "creator"].includes(agent)) {
      // Exécute un agent spécifique
      results = await swarm.runAgent(agent as any);
    } else {
      // Exécute tous les agents
      results = await swarm.runAll();
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Erreur exécution agents:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





