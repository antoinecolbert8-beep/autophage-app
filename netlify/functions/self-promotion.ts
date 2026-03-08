import { schedule } from '@netlify/functions';

export const handler = schedule('0 * * * *', async (event) => {
    console.log("/// NETLIFY CRON: WAKING UP GENESIS SELF-PROMOTION ///");

    const API_URL = process.env.URL || process.env.NEXT_PUBLIC_APP_URL;
    const CRON_SECRET = process.env.CRON_SECRET || '';

    if (!API_URL) {
        console.error("Missing API_URL or NEXT_PUBLIC_APP_URL environment variable.");
        return { statusCode: 500, body: 'Missing API_URL' };
    }

    try {
        const response = await fetch(`${API_URL}/api/cron/self-promotion`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CRON_SECRET}`
            }
        });

        const data = await response.text();
        console.log(`Self-Promotion Response (${response.status}):`, data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Self-promotion trigged successfully", data })
        };
    } catch (error: any) {
        console.error("Failed to trigger self-promotion:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
});
