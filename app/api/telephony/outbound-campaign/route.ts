/**
 * API Route: POST /api/telephony/outbound-campaign
 * Campagne d'appels sortants en masse
 */

import { NextRequest, NextResponse } from "next/server";
import { runOutboundCampaign } from "@/lib/telephony-manager";

export async function POST(req: NextRequest) {
  try {
    const { contacts, message, maxConcurrent } = await req.json();

    if (!contacts || !message) {
      return NextResponse.json(
        { error: "contacts et message requis" },
        { status: 400 }
      );
    }

    console.log(`📞 Campagne d'appels : ${contacts.length} contacts`);

    const results = await runOutboundCampaign(
      contacts,
      message,
      maxConcurrent || 10
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Erreur campagne:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}





