import { NextResponse } from 'next/server';
import { ELASelfPromoter } from '@/lib/god-mode/self-promotion';

export const dynamic = 'force-dynamic';


/**
 * CRON: GATEWAY TO THE INFINITE
 * This endpoint is called daily by Vercel Cron (09:00 AM).
 * It triggers the 'Self-Promotion' engine, ensuring the system grows even when you sleep.
 */
export async function GET(req: Request) {
    // Verify Auth
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log("/// CRON: WAKING UP GENESIS SELF-PROMOTION ///");

        // 2. Execute the Sovereign Logic
        // 2. Execute the Sovereign Logic (Smart Scheduled)
        const result = await ELASelfPromoter.orchestrateHourlyCheck();

        return NextResponse.json({
            status: "SUCCESS",
            message: "ELA has spoken.",
            data: result
        });
    } catch (error: any) {
        console.error("/// CRON FAILURE ///", error);
        return NextResponse.json({ status: "ERROR", error: error.message }, { status: 500 });
    }
}
