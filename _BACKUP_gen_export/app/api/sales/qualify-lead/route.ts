/**
 * API Route: POST /api/sales/qualify-lead
 * Qualification automatique d'un lead
 */

import { NextRequest, NextResponse } from "next/server";
import { qualifyLead, upsertLead } from "@/lib/sales-automation";

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json();

    if (!lead.name) {
      return NextResponse.json({ error: "name requis" }, { status: 400 });
    }

    console.log(`💼 Qualification de ${lead.name}...`);

    // Qualifie le lead
    const score = await qualifyLead(lead);

    // Détermine le statut
    const status =
      score >= 70 ? "QUALIFIED" : score >= 40 ? "CONTACTED" : "NEW";

    // Sauvegarde
    const savedLead = await upsertLead({
      ...lead,
      score,
      status,
      source: lead.source || "MANUAL",
    });

    return NextResponse.json({
      success: true,
      lead: savedLead,
      recommendation:
        score >= 70
          ? "Lead chaud ! Envoie une proposition immédiatement"
          : score >= 40
          ? "Lead tiède. Nurture avec du contenu"
          : "Lead froid. Attends before outreach",
    });
  } catch (error) {
    console.error("Erreur qualification:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





