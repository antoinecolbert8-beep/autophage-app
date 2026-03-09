import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/core/env';
import { CampaignCommander } from '@/modules/growth_engine/campaign_commander';
import { AnalyticsService } from '@/modules/growth_engine/analytics.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type');

    const results: any = {};

    try {
        // 2. The Daily Review (Analytics)
        if (type === 'analytics' || type === 'all') {
            console.log('🫀 Heartbeat: Syncing Daily Metrics...');
            await AnalyticsService.syncDailyMetrics();
            results.analytics = 'Synced';
        }

        // 3. The Hourly Attack (Growth Engine)
        if (type === 'growth' || type === 'all' || !type) {
            console.log('🫀 Heartbeat: Executing Growth Cycle...');
            const cycleResult = await CampaignCommander.executeReinvestmentCycle(false);
            results.growth = cycleResult;
        }

        return NextResponse.json({ success: true, timestamp: new Date(), actions: results });

    } catch (error) {
        console.error('Heartbeat Failure:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

