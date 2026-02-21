import type { Config } from "@netlify/functions"

export default async (req: Request) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET;

    console.log(`[NETLIFY CRON] Triggering Heartbeat at ${appUrl}`);

    try {
        const response = await fetch(`${appUrl}/api/cron/heartbeat?type=all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cronSecret}`
            }
        });

        const data = await response.text();
        console.log(`[NETLIFY CRON] Response: ${response.status} - ${data}`);

        return new Response(`Heartbeat triggered: ${response.status}`);
    } catch (error: any) {
        console.error(`[NETLIFY CRON] Error: ${error.message}`);
        return new Response(`Heartbeat failed: ${error.message}`, { status: 500 });
    }
}

export const config: Config = {
    schedule: "*/5 * * * *"
}
