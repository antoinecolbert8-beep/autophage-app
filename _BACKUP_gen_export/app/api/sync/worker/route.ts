import { NextRequest, NextResponse } from 'next/server';
import { dataSyncWorker } from '@/lib/supabase/sync';

// Start the continuous AI feedback loop
export async function POST(request: NextRequest) {
    try {
        const { action, interval } = await request.json();

        if (action === 'start') {
            dataSyncWorker.start(interval || 5000);
            return NextResponse.json({
                success: true,
                message: 'Data sync worker started',
                interval: interval || 5000,
            });
        }

        if (action === 'stop') {
            dataSyncWorker.stop();
            return NextResponse.json({
                success: true,
                message: 'Data sync worker stopped',
            });
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "start" or "stop"' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Worker control error:', error);
        return NextResponse.json(
            { error: 'Failed to control worker' },
            { status: 500 }
        );
    }
}

// Get worker status
export async function GET(request: NextRequest) {
    // In production, store worker state in Redis/Supabase
    return NextResponse.json({
        status: 'running', // or 'stopped'
        lastSync: new Date(),
        stats: {
            keywordsAnalyzed: 142,
            leadsScored: 89,
            contentGenerated: 23,
            actionsExecuted: 67,
        },
    });
}
