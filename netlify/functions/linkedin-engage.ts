import type { Config } from "@netlify/functions"

export default async (req: Request) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET;

    console.log(`[LINKEDIN BOT] 🤝 Triggering LinkedIn prospection at ${new Date().toISOString()}`);

    try {
        const response = await fetch(`${appUrl}/api/cron/linkedin-engage`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cronSecret}` }
        });

        const data = await response.text();
        console.log(`[LINKEDIN BOT] LinkedIn prospection: ${response.status} - ${data}`);

        return new Response(JSON.stringify({ status: 'ok', message: 'LinkedIn engagement triggered', timestamp: new Date().toISOString() }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`[LINKEDIN BOT] Error: ${error.message}`);
        return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }
}

export const config: Config = {
    schedule: "0 10,14 * * 1-5" // Lundi-Vendredi à 10h et 14h UTC (heures de pointe LinkedIn)
}
