import { NextRequest, NextResponse } from 'next/server';
import { unifiedWorker } from '@/lib/workers/unified-domination';

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        if (action === 'start') {
            unifiedWorker.startDominationCycle(300000); // 5 min
            return NextResponse.json({
                success: true,
                message: 'Domination cycle started',
            });
        }

        if (action === 'stop') {
            unifiedWorker.stopDomination();
            return NextResponse.json({
                success: true,
                message: 'Domination cycle stopped',
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Worker control error:', error);
        return NextResponse.json({ error: 'Failed to control worker' }, { status: 500 });
    }
}
