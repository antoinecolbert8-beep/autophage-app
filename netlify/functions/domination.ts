import { schedule } from '@netlify/functions';

export const handler = schedule('*/15 * * * *', async (event) => {
    console.log("/// NETLIFY CRON: TRIGGERING DOMINATION PROTOCOL (15m) ///");

    const API_URL = process.env.URL || process.env.NEXT_PUBLIC_APP_URL || '';
    const CRON_SECRET = process.env.CRON_SECRET || '';

    if (!API_URL) {
        console.error("Missing API_URL or NEXT_PUBLIC_APP_URL environment variable.");
        return { statusCode: 500, body: 'Missing API_URL' };
    }

    try {
        const response = await fetch(`${API_URL}/api/cron/domination`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CRON_SECRET}`
            }
        });

        const data = await response.text();
        console.log(`Domination Response (${response.status}):`, data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Domination triggered successfully", data })
        };
    } catch (error: any) {
        console.error("Failed to trigger domination:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
});
