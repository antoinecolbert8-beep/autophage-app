import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface UsageStats {
    creditUsage: number;
    contractCount: number;
    revenueGenerated: number;
}

// Mock notification function (replace with actual notification logic, e.g. OneSignal / Email)
const notifyUser = async (userId: string, notification: any) => {
    console.log(`[UPSELL TRIGGERED for ${userId}]`, notification);
};

/**
 * Analyseur de saturation et déclencheur d'expansion (LTV Optimization)
 */
export const triggerProactiveUpsell = async (userId: string, usageStats: UsageStats) => {
    const { creditUsage, contractCount, revenueGenerated } = usageStats;

    // Seuil de saturation : 80% des crédits, plus de 10 contrats, ou volume d'affaires élevé (>1000€)
    if (creditUsage > 0.8 || contractCount >= 10 || revenueGenerated > 1000) {
        const prompt = \`
      CONTEXTE : L'utilisateur \${userId} atteint ses limites d'infrastructure ELA.
      STATS : \${Math.round(creditUsage * 100)}% de crédits consommés, \${revenueGenerated}€ sécurisés, \${contractCount} contrats gérés.
      OBJECTIF : Rédiger une notification 'SOVEREIGN' courte pour l'inviter à passer au plan EMPIRE.
      TON : Ne pas être un vendeur. Être un conseiller stratégique cynique mais bienveillant. 
      MESSAGE EXACT A REFORMULER : "Votre infrastructure actuelle est saturée. Vous laissez de la croissance sur la table. Débloquez le palier EMPIRE pour une exécution sans friction et IA illimitée."
      CONTRAINTE : Moins de 40 mots. Pas d'emojis.
    \`;

    try {
        const result = await model.generateContent(prompt);
        const message = result.response.text();
        
        // Déclenchement de la notification In-App et Email
        await notifyUser(userId, {
            title: "⚠️ Saturation Détectée",
            body: message,
            actionUrl: "/billing/upgrade?plan=empire",
            type: "STRATEGIC_UPSELL"
        });
        
        return true;
    } catch (e) {
        console.error("Failed to trigger proactive upsell:", e);
        return false;
    }
  }
  return false;
};
