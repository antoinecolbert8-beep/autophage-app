import { schedule } from '@netlify/functions';
import fetch from 'node-fetch'; // Polyfill required for Netlify Node functions sometimes, but we can hit our own API

/**
 * Netlify Scheduled Function pour le "Proactive Matchmaker"
 * Exécuté tous les jours à 09:00 AM.
 * 
 * Puisque notre logique est déjà encapsulée proprement dans notre API Next.js :
 * `app/api/cron/matchmaker/route.ts`
 * 
 * Cette fonction agit comme un "Pinger" authentifié. 
 * Avantage : Logique centralisée, exécution déclenchée via Netlify.
 */
export const handler = schedule('0 9 * * *', async (event) => {
    console.log("⏰ Netlify Cron: Triggering Proactive Matchmaker...");

    // URL absolue requise pour fetcher depuis une fonction serverless autonome
    // En production, NETLIFY_URL / URL est injecté automatiquement
    const siteUrl = process.env.URL || 'http://localhost:3000';

    try {
        const response = await fetch(`${siteUrl}/api/cron/matchmaker`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET || ''}`
            }
        });

        if (!response.ok) {
            console.error(\`Status: \${response.status}\`);
            throw new Error(\`Failed to trigger matchmaker API: \${response.statusText}\`);
        }

        const data = await response.json();
        console.log("✅ Proactive Matchmaker Job Completed:", data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Job exécuté avec succès.", result: data })
        };
    } catch (error) {
        console.error("❌ Erreur lors de l'exécution du cron:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur d'exécution", error: (error as Error).message })
        };
    }
});
