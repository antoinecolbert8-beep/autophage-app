/**
 * 💬 WhatsApp Controller - Pilotage du SaaS via WhatsApp
 * Commandes vocales et texte pour contrôler toutes les fonctionnalités
 */

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type WhatsAppCommand = {
  type: "TEXT" | "AUDIO";
  content: string;
  from: string;
};

export type CommandResult = {
  success: boolean;
  response: string;
  action?: string;
  data?: any;
};

/**
 * Parse une commande WhatsApp (texte ou audio transcrit)
 */
export async function parseWhatsAppCommand(
  command: WhatsAppCommand
): Promise<CommandResult> {
  try {
    // Transcription audio si nécessaire
    let text = command.content;
    if (command.type === "AUDIO") {
      text = await transcribeAudio(command.content);
    }

    // Analyse de l'intention
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es l'assistant WhatsApp du SaaS Autophage.
Tu interprètes les commandes vocales/texte et retournes une action JSON :
{
  "action": "GENERATE_CONTENT" | "CHECK_STATS" | "MAKE_CALLS" | "QUALIFY_LEAD" | "GENERATE_DOC" | "UNKNOWN",
  "params": {...},
  "response": "Message de confirmation"
}

Exemples:
- "Crée-moi un post LinkedIn sur l'IA" → GENERATE_CONTENT
- "Combien de leads cette semaine ?" → CHECK_STATS
- "Appelle 100 prospects" → MAKE_CALLS
- "Rédige un contrat" → GENERATE_DOC`,
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      success: true,
      response: result.response || "Commande reçue",
      action: result.action,
      data: result.params,
    };
  } catch (error) {
    return {
      success: false,
      response: "Désolé, je n'ai pas compris ta commande. Peux-tu reformuler ?",
    };
  }
}

/**
 * Transcription audio (Whisper API)
 */
async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // En production : télécharge l'audio depuis WhatsApp, puis transcrit
    // Pour l'instant, simulation
    return "Transcription audio simulée";
  } catch (error) {
    throw new Error(`Erreur transcription: ${(error as Error).message}`);
  }
}

/**
 * Envoie un message WhatsApp Business
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return { success: false };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    const data = await res.json();
    return { success: !!data.messages };
  } catch (error) {
    console.error("Erreur WhatsApp:", error);
    return { success: false };
  }
}





