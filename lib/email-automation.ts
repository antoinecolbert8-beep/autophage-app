/**
 * 📧 Email Automation - Envoi d'emails transactionnels
 * Délégué à Make.com via Conductor Pattern
 */

import { triggerAutomation } from "./automations";

/**
 * Envoie un email via Make
 * @param email Destinataire
 * @param subject Objet
 * @param message Contenu (HTML ou Text)
 */
export async function sendEmail(email: string, subject: string, message: string): Promise<boolean> {
    const result = await triggerAutomation("SEND_EMAIL", {
        email,
        subject,
        text: message, // Mapping 'text' to 'message' content as per previous implementation
        date: new Date().toISOString()
    });

    if (result.success) {
        console.log("✅ Ordre d'envoi email transmis à Make !");
        return true;
    } else {
        console.error("⚠️ Erreur Make (Email) :", result.message);
        return false;
    }
}
