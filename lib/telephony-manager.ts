/**
 * ☎️ Telephony Manager - Système d'appels 24/7 avec Twilio
 * Actions déléguées à Make.com via Conductor Pattern
 */

import { triggerAutomation } from "./automations";

export type CallContext = {
  callSid?: string;
  from: string;
  to?: string;
  direction: "inbound" | "outbound";
  status?: string;
  duration?: number;
};

export type CallQualification = {
  category: "URGENT" | "INFO" | "SAV" | "VENTE" | "AUTRE";
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  needsHuman: boolean;
  summary: string;
};

/**
 * Passe un appel sortant (outbound) via Make
 */
export async function makeOutboundCall(
  to: string,
  message: string,
  voiceUrl?: string
): Promise<{ success: boolean; callSid?: string; error?: string }> {
  const result = await triggerAutomation("MAKE_OUTBOUND_CALL", {
    to,
    message,
    voiceUrl
  });

  if (result.success) {
    return {
      success: true,
      callSid: result.data?.sid || "queued_via_make"
    };
  }

  return { success: false, error: result.message };
}

/**
 * Génère TwiML pour répondre à un appel entrant
 * (Reste local pour la latence, ou pourrait être servi par Make via Webhook Response)
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
 * Qualifie un appel via IA (délégué à Make pour centralisation)
 */
export async function qualifyCall(
  transcript: string,
  context: CallContext
): Promise<CallQualification> {
  // On envoie le transcript à Make qui utilise OpenAI et retourne le JSON
  const result = await triggerAutomation("QUALIFY_CALL_AI", {
    transcript,
    context
  });

  if (result.success && result.data) {
    return {
      category: result.data.category || "AUTRE",
      intent: result.data.intent || "Non identifié",
      sentiment: result.data.sentiment || "neutral",
      needsHuman: result.data.needsHuman ?? false,
      summary: result.data.summary || "Résumé non disponible"
    };
  }

  console.error("Erreur qualification via Make, fallback local ou défaut");
  return {
    category: "AUTRE",
    intent: "Erreur analyse Make",
    sentiment: "neutral",
    needsHuman: true,
    summary: transcript.slice(0, 100)
  };
}

/**
 * Génère un compte-rendu d'appel (Helper pur)
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
 * Prise de rendez-vous automatique (Google Calendar via Make)
 */
export async function scheduleAppointment(data: {
  callerName: string;
  callerPhone: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
}): Promise<{ success: boolean; appointmentId?: string; error?: string }> {

  const result = await triggerAutomation("SCHEDULE_APPOINTMENT", data);

  if (result.success) {
    return { success: true, appointmentId: result.data?.eventId };
  }

  return { success: false, error: result.message };
}

/**
 * Campagne d'appels en masse (outbound campaign)
 */
export async function runOutboundCampaign(
  contacts: Array<{ name: string; phone: string }>,
  message: string,
  maxConcurrent: number = 10
): Promise<{ total: number; success: number; failed: number }> {

  // Au lieu de boucler ici, on envoie toute la liste (ou le batch) à Make iterator
  // Ou on déclenche une campagne Make qui gère le rate limit

  console.log(`[Telephony] Triggering campaign for ${contacts.length} contacts via Make`);

  const result = await triggerAutomation("START_CALL_CAMPAIGN", {
    contacts,
    message,
    settings: { maxConcurrent }
  });

  if (result.success) {
    return { total: contacts.length, success: contacts.length, failed: 0 };
  }

  return { total: contacts.length, success: 0, failed: contacts.length };
}





