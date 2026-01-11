/**
 * API Route: POST /api/telephony/process
 * Traitement de la réponse vocale de l'appelant
 */

import { NextRequest, NextResponse } from "next/server";
import { qualifyCall, generateCallSummary } from "@/lib/telephony-manager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const speechResult = formData.get("SpeechResult") as string;
    const from = formData.get("From") as string;
    const callSid = formData.get("CallSid") as string;

    console.log(`🎤 Transcript: ${speechResult}`);

    // Qualifie l'appel
    const qualification = await qualifyCall(speechResult, {
      callSid,
      from,
      direction: "inbound",
    });

    // Sauvegarde dans ActionHistory
    await prisma.actionHistory.create({
      data: {
        userId: "SYSTEM",
        platform: "PHONE",
        action: "CALL_RECEIVED",
        targetId: callSid,
        context: JSON.stringify({
          from,
          transcript: speechResult,
          qualification,
        }),
      },
    });

    // Génère réponse TwiML selon qualification
    let twiml = "";

    if (qualification.needsHuman) {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">
    Je comprends votre demande. Je vous transfère vers un conseiller.
  </Say>
  <Dial timeout="30">+33XXXXXXXXX</Dial>
</Response>`;
    } else if (qualification.category === "INFO") {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">
    Merci pour votre appel. Pour une demande d'information, vous pouvez consulter notre site web ou nous envoyer un email. Un conseiller vous contactera dans les 24 heures.
  </Say>
</Response>`;
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">
    Votre demande a bien été enregistrée. Un conseiller vous rappellera rapidement. Merci et à bientôt.
  </Say>
</Response>`;
    }

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Erreur traitement appel:", error);

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">
    Une erreur est survenue. Veuillez réessayer ultérieurement.
  </Say>
</Response>`;

    return new NextResponse(errorTwiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }
}





