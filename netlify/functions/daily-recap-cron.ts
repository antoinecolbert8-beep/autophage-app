import { schedule } from '@netlify/functions';
import fetch from 'node-fetch';

/**
 * Netlify Scheduled Function pour le "Daily Recap" (BullMQ Buffer)
 * Exécuté tous les jours à 18:00 PM (18 0 * * *)
 */
export const handler = schedule('0 18 * * *', async (event) => {
    console.log("⏰ Netlify Cron: Triggering Daily Recap Queue...");

    const siteUrl = process.env.URL || 'http://localhost:3000';

    try {
        const response = await fetch(\`\${siteUrl}/api/cron/daily-recap\`, {
            method: 'GET',
            headers: {
                'Authorization': \`Bearer \${process.env.CRON_SECRET || ''}\`
            }
        });

        if (!response.ok) {
            console.error(\`Status: \${response.status}\`);
            throw new Error(\`Failed to trigger daily-recap API: \${response.statusText}\`);
        }

        const data = await response.json();
        console.log("✅ Daily Recap Job Completed:", data);

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
