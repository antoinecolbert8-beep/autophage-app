import { NextRequest, NextResponse } from 'next/server';

/**
 * 🤝 LinkedIn Engagement API Cron Route
 * Called by Netlify Scheduled Function `netlify/functions/linkedin-engage.ts`
 */
export async function GET(req: NextRequest) {
    const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '');

    if (cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[LINKEDIN BOT] 🤝 Starting engagement cycle...');

        const { godModeLinkedInEngage } = await import('@/lib/god-mode/self-promotion');
        await godModeLinkedInEngage();

        return NextResponse.json({
            status: 'ok',
            message: 'LinkedIn engagement cycle completed',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('[LINKEDIN BOT] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
