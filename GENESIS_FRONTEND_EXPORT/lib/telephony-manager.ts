/**
 * ☎️ Telephony Manager - Système d'appels 24/7 avec Twilio
 * Réception/émission d'appels, qualification intelligente, prise de RDV
 */

import twilio from "twilio";
import OpenAI from "openai";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type CallContext = {
  callSid?: string;
  from: string;
  to?: string;
  direction: "inbound" | "outbound";
  status?: string;
};

export type CallQualification = {
  category: "URGENT" | "INFO" | "SAV" | "VENTE" | "AUTRE";
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  needsHuman: boolean;
  summary: string;
};

/**
 * Passe un appel sortant (outbound)
 */
export async function makeOutboundCall(
  to: string,
  message: string,
  voiceUrl?: string
): Promise<{ success: boolean; callSid?: string; error?: string }> {
  try {
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioNumber) {
      return { success: false, error: "TWILIO_PHONE_NUMBER manquant" };
    }

    // TwiML dynamique pour le message
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">${message}</Say>
  <Pause length="2"/>
  <Gather input="speech dtmf" action="/api/telephony/gather" method="POST" timeout="10" language="fr-FR">
    <Say voice="Polly.Lea-Neural" language="fr-FR">
      Appuyez sur 1 pour parler à un conseiller, ou dites votre demande.
    </Say>
  </Gather>
</Response>`;

    const call = await twilioClient.calls.create({
      to,
      from: twilioNumber,
      twiml,
    });

    return {
      success: true,
      callSid: call.sid,
    };
  } catch (error) {
    console.error("Erreur appel sortant:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Génère TwiML pour répondre à un appel entrant
 */
export function generateInboundTwiML(customMessage?: string): string {
  const defaultMessage = customMessage || 
    "Bonjour, vous êtes bien sur la ligne d'assistance automatique. Je suis disponible 24 heures sur 24 pour vous aider.";

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Lea-Neural" language="fr-FR">${defaultMessage}</Say>
  <Gather input="speech" action="/api/telephony/process" method="POST" timeout="10" language="fr-FR" speechTimeout="auto">
    <Say voice="Polly.Lea-Neural" language="fr-FR">
      Décrivez votre demande, ou appuyez sur 1 pour un urgence, 2 pour une information, 3 pour le service après-vente.
    </Say>
  </Gather>
  <Say voice="Polly.Lea-Neural" language="fr-FR">
    Je n'ai pas reçu de réponse. Je vous transfère vers un conseiller.
  </Say>
  <Dial timeout="30">+33XXXXXXXXX</Dial>
</Response>`;
}

/**
 * Qualifie un appel via IA (analyse sémantique)
 */
export async function qualifyCall(
  transcript: string,
  context: CallContext
): Promise<CallQualification> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un système de qualification d'appels téléphoniques.
Analyse la demande et réponds au format JSON :
{
  "category": "URGENT" | "INFO" | "SAV" | "VENTE" | "AUTRE",
  "intent": "Description courte de l'intention",
  "sentiment": "positive" | "neutral" | "negative",
  "needsHuman": true/false,
  "summary": "Résumé en 1-2 phrases"
}`,
        },
        { role: "user", content: `Appel de ${context.from}:\n${transcript}` },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      category: result.category || "AUTRE",
      intent: result.intent || "Non identifié",
      sentiment: result.sentiment || "neutral",
      needsHuman: result.needsHuman ?? false,
      summary: result.summary || transcript.slice(0, 200),
    };
  } catch (error) {
    console.error("Erreur qualification:", error);
    return {
      category: "AUTRE",
      intent: "Erreur analyse",
      sentiment: "neutral",
      needsHuman: true,
      summary: transcript,
    };
  }
}

/**
 * Génère un compte-rendu d'appel
 */
export async function generateCallSummary(
  transcript: string,
  qualification: CallQualification,
  duration: number
): Promise<string> {
  const summary = `**Compte-Rendu d'Appel**

**Durée** : ${Math.floor(duration / 60)}min ${duration % 60}s
**Catégorie** : ${qualification.category}
**Intention** : ${qualification.intent}
**Sentiment** : ${qualification.sentiment}

**Résumé** :
${qualification.summary}

**Transcript complet** :
${transcript}

**Action recommandée** : ${qualification.needsHuman ? "Rappel par un humain requis" : "Traité automatiquement"}
`;

  return summary;
}

/**
 * Prise de rendez-vous automatique (Google Calendar)
 */
export async function scheduleAppointment(data: {
  callerName: string;
  callerPhone: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
}): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  try {
    // En production : intégration Google Calendar API
    // Pour l'instant, simulation

    console.log("📅 Rendez-vous programmé:", data);

    // TODO: Implémenter Google Calendar API
    // const calendar = google.calendar('v3');
    // const event = await calendar.events.insert({...});

    return {
      success: true,
      appointmentId: `APT-${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Campagne d'appels en masse (outbound campaign)
 */
export async function runOutboundCampaign(
  contacts: Array<{ name: string; phone: string }>,
  message: string,
  maxConcurrent: number = 10
): Promise<{ total: number; success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Batch processing pour respecter les limites Twilio
  for (let i = 0; i < contacts.length; i += maxConcurrent) {
    const batch = contacts.slice(i, i + maxConcurrent);

    const results = await Promise.allSettled(
      batch.map((contact) =>
        makeOutboundCall(contact.phone, message.replace("{name}", contact.name))
      )
    );

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        success++;
      } else {
        failed++;
      }
    });

    // Pause entre les batches (rate limiting)
    if (i + maxConcurrent < contacts.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return { total: contacts.length, success, failed };
}





