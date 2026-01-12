/**
 * API Route: POST /api/sales/generate-message
 * Génération de message de prospection personnalisé
 */

import { NextRequest, NextResponse } from "next/server";
import { generateProspectMessage } from "@/lib/sales-automation";

export async function POST(req: NextRequest) {
  try {
    const { lead, template } = await req.json();

    if (!lead || !template) {
      return NextResponse.json(
        { error: "lead et template requis" },
        { status: 400 }
      );
    }

    console.log(`✍️ Génération message ${template} pour ${lead.name}`);

    const message = await generateProspectMessage(lead, template);

    return NextResponse.json({
      success: true,
      message,
      template,
    });
  } catch (error) {
    console.error("Erreur génération message:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





