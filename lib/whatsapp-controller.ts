/**
 * 💬 WhatsApp Controller - Pilotage du SaaS via WhatsApp
 * Logique déléguée à Make.com (Brain & Hands)
 */

import { triggerAutomation } from "./automations";

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
 * Parse une commande WhatsApp (via Make pour l'IA et la transcription)
 */
export async function parseWhatsAppCommand(
  command: WhatsAppCommand
): Promise<CommandResult> {
  // On délègue tout le "Cerveau" à Make
  // Make va: 1. Transcrire si audio 2. Analyser l'intent avec GPT 3. Retourner l'action et la réponse

  const result = await triggerAutomation("PROCESS_WHATSAPP_MESSAGE", {
    type: command.type,
    content: command.content,
    from: command.from
  });

  if (result.success && result.data) {
    return {
      success: true,
      response: result.data.response || "Commande traitée",
      action: result.data.action || "UNKNOWN",
      data: result.data.params
    };
  }

  return {
    success: false,
    response: "Erreur de traitement (Automation Make échouée)"
  };
}

/**
 * Envoie un message WhatsApp Business (via Make)
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean }> {
  const result = await triggerAutomation("SEND_WHATSAPP_MESSAGE", {
    to,
    message
  });

  return { success: result.success };
}





