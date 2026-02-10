import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RBAC } from '@/lib/rbac';
import {
    getCreditBalance,
    getUsageStats,
    calculatePerformanceMetrics,
    createCheckoutSession,
    CREDIT_PACKAGES,
} from '@/lib/billing';

// GET: Fetch billing dashboard data
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orgId = session.user.organizationId || 'demo-org';

        const [balance, usage, performance] = await Promise.all([
            getCreditBalance(orgId),
            getUsageStats(orgId, 30),
            calculatePerformanceMetrics(orgId),
        ]);

        return NextResponse.json({
            credits: {
                balance,
                packages: CREDIT_PACKAGES,
            },
            usage,
            performance,
        });
    } catch (error) {
        console.error('Billing data error:', error);
        return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 });
    }
}

// POST: Create checkout session for credit purchase
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession() as any;
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { packageId } = await request.json();
        const organizationId = session.user.organizationId;

        if (!organizationId || !packageId) {
            return NextResponse.json(
                { error: 'organizationId and packageId required' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const checkoutUrl = await createCheckoutSession(
            organizationId,
            packageId,
            `${baseUrl}/dashboard/billing?success=true`,
            `${baseUrl}/dashboard/billing?canceled=true`
        );

        return NextResponse.json({ url: checkoutUrl });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}
