// src/lib/automations.ts

// 1. Mets l'URL de ton Webhook Make ici (ou mieux, dans ton .env)
const MAKE_WEBHOOK_URL = process.env.MAKE_ORCHESTRATOR_URL || "https://hook.make.com/TON_URL_ICI";

type AutomationAction =
    | 'SEND_EMAIL'
    | 'PUBLISH_SOCIAL_POST'
    | 'SYNC_CRM'
    | 'GENERATE_POST'
    // ... ajoute tes autres actions ici au fur et à mesure
    | 'TEST_CONNECTION'; // Utile pour tester

interface AutomationPayload {
    [key: string]: any; // Accepte n'importe quelles données
}

/**
 * LE CHEF D'ORCHESTRE 🎻
 * Envoie une commande à Make pour exécution
 */
export async function triggerAutomation(action: AutomationAction, payload: AutomationPayload) {
    console.log(`🎻 Orchestrator: Envoi de l'action [${action}]...`);

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: action,       // C'est l'aiguillage (ex: SEND_EMAIL)
                date: new Date().toISOString(),
                payload: payload      // Les données (ex: { email: "...", message: "..." })
            })
        });

        if (response.ok) {
            console.log(`✅ [${action}] Reçu par Make avec succès.`);
            // Si Make renvoie des données (ex: un texte généré), on les récupère
            const data = await response.json().catch(() => ({}));
            return { success: true, data };
        } else {
            console.error(`⚠️ Erreur Make [${response.status}]: ${response.statusText}`);
            return { success: false, error: response.statusText };
        }

    } catch (error) {
        console.error("❌ Erreur critique connection Make:", error);
        return { success: false, error };
    }
}
