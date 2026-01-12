import { NextRequest, NextResponse } from 'next/server';
import { unifiedWorker } from '@/lib/workers/unified-domination';
import { generateAlgorithmReport } from '@/lib/algo/intelligence';

/**
 * CRON JOB: Runs every 5 minutes via Vercel Cron
 * Executes the full domination cycle autonomously
 */
export async function GET(request: NextRequest) {
    // Verify cron secret (Vercel adds this header)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow in development
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    console.log('🔄 CRON: Domination cycle triggered');

    try {
        // Execute domination cycle
        // Note: In production, this should be a proper job queue
        // For now, we trigger the worker synchronously

        // Start worker if not running (it will handle one cycle)
        unifiedWorker.startDominationCycle(1); // Single cycle

        // Also run algorithm learning
        const algoReport = await generateAlgorithmReport('demo-org');

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            algoReport,
            message: 'Domination cycle executed',
        });
    } catch (error) {
        console.error('CRON error:', error);
        return NextResponse.json({ error: 'Cycle failed' }, { status: 500 });
    }
}
