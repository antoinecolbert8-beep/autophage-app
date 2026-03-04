import type { Config } from "@netlify/functions"

export default async (req: Request) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET;

    console.log(`[VIRAL ENGINE] 🌆 Triggering evening recap at ${new Date().toISOString()}`);

    try {
        // Déclenche le recap du soir (re-publication du meilleur contenu du jour)
        const response = await fetch(`${appUrl}/api/cron/self-promotion`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cronSecret}` }
        });
        const data = await response.text();
        console.log(`[VIRAL ENGINE] Evening recap: ${response.status} - ${data}`);

        return new Response(JSON.stringify({ status: 'ok', message: 'Evening recap triggered', timestamp: new Date().toISOString() }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`[VIRAL ENGINE] Error: ${error.message}`);
        return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }
}

export const config: Config = {
    schedule: "0 18 * * *" // Tous les jours à 18h UTC (19h Paris)
}
