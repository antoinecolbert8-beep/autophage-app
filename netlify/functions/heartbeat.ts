import { schedule } from '@netlify/functions';

export const handler = schedule('*/5 * * * *', async (event) => {
    console.log("/// NETLIFY CRON: SYSTEM HEARTBEAT PULSE (5m) ///");

    const API_URL = process.env.URL || process.env.NEXT_PUBLIC_APP_URL || '';
    const CRON_SECRET = process.env.CRON_SECRET || '';

    if (!API_URL) {
        console.error("Missing API_URL or NEXT_PUBLIC_APP_URL environment variable.");
        return { statusCode: 500, body: 'Missing API_URL' };
    }

    try {
        const response = await fetch(`${API_URL}/api/cron/heartbeat`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CRON_SECRET}`
            }
        });

        const data = await response.text();
        console.log(`Heartbeat Response (${response.status}):`, data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Heartbeat triggered successfully", data })
        };
    } catch (error: any) {
        console.error("Failed to trigger heartbeat:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
});
