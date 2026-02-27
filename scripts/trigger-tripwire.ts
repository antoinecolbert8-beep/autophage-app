

/**
 * Script Commando: trigger-tripwire.ts
 * Objectif : Générer instantanément le Post "Flash Sale" (Low-Ticket Tripwire à 97€) via l'API, 
 * sans avoir besoin d'attendre un Cron ou d'utiliser le Dashboard.
 * 
 * Exécution: npx tsx scripts/trigger-tripwire.ts
 */

const triggerFlashSale = async () => {
    // ⚠️ IMPORTANT: Remplacer par l'URL de votre déploiement Netlify
    const TARGET_URL = 'http://localhost:3000/api/marketing/flash-sale';
    const ADMIN_KEY = process.env.ADMIN_LOCKDOWN_KEY || ''; // Mettre la clé en dur temporairement si exécuté en local sans .env

    console.log("🚀 Lancement du Missile Marketing: Flash Sale (Audit IA)");

    try {
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_KEY}`
            },
            body: JSON.stringify({
                product: "Audit d'Infrastructure IA Privé",
                originalPrice: 500,
                flashPrice: 97,
                slots: 5
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCÈS - Copiez ce texte sur LinkedIn / Twitter immédiatement :\n");
            console.log("==========================================");
            console.log(data.marketingCopy);
            console.log("==========================================");
            console.log(`\n🔗 Lien de paiement à joindre en commentaire : ${data.paymentLink}`);
            console.log(`⚠️ Scarcity générée : ${data.scarcity}`);
        } else {
            console.error("❌ ECHEC DE LA GÉNERATION :", data);
        }
    } catch (e) {
        console.error("❌ ERREUR RÉSEAU :", e);
    }
};

triggerFlashSale();
