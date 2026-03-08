import { NextRequest, NextResponse } from 'next/server';
import { CachedAnalytics } from '@/lib/cached-analytics';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

/**
 * GET /api/analytics/dashboard
 * Cached dashboard analytics endpoint
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const timeframe = (searchParams.get('timeframe') || '7d') as '7d' | '30d' | '90d';

        // Get cached analytics
        const analytics = await CachedAnalytics.getUserAnalytics(user.id, timeframe);

        return NextResponse.json({
            success: true,
            data: analytics,
            cached: true
        });

    } catch (error) {
        console.error('[API] Analytics error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/analytics/cache
 * Invalidate user cache
 */
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        const user = session?.user as any;
        if (!user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await CachedAnalytics.invalidateUserCache(user.id);

        return NextResponse.json({
            success: true,
            message: 'Cache invalidated'
        });

    } catch (error) {
        console.error('[API] Cache invalidation error:', error);
        return NextResponse.json(
            { error: 'Failed to invalidate cache' },
            { status: 500 }
        );
    }
}
