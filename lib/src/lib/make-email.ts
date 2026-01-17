// src/lib/make-email.ts

// Colle ici l'URL que tu viens de copier sur Make
const MAKE_WEBHOOK_URL = "https://hook.make.com/TA_LONGUE_SUITE_DE_LETTRES_ICI";

export async function sendEmail(email: string, subject: string, message: string) {
    if (!MAKE_WEBHOOK_URL.includes("hook.make.com")) {
        console.error("❌ URL du Webhook Make manquante ou invalide");
        return false;
    }

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,       // Qui reçoit l'email
                subject: subject,   // L'objet du mail
                text: message,      // Le contenu
                date: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log("✅ Ordre d'envoi transmis à Make !");
            return true;
        } else {
            console.error("⚠️ Erreur Make :", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("❌ Erreur de connexion avec Make", error);
        return false;
    }
}
