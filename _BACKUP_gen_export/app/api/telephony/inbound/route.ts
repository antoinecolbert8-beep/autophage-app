/**
 * API Route: POST /api/telephony/inbound
 * Webhook Twilio pour appels entrants
 */

import { NextRequest, NextResponse } from "next/server";
import { generateInboundTwiML } from "@/lib/telephony-manager";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const callSid = formData.get("CallSid") as string;

    console.log(`📞 Appel entrant de ${from} (${callSid})`);

    // Génère TwiML pour répondre
    const twiml = generateInboundTwiML();

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Erreur webhook inbound:", error);
    return new NextResponse("Error", { status: 500 });
  }
}





