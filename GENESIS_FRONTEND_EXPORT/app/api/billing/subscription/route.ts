import { NextRequest, NextResponse } from 'next/server';
import {
    createSepaSetupSession,
    getSubscriptionStatus,
    cancelSubscription,
    SUBSCRIPTION_TIERS,
} from '@/lib/billing/subscriptions';

// POST: Create SEPA subscription checkout
export async function POST(request: NextRequest) {
    try {
        const { organizationId, email, name, tierId } = await request.json();

        if (!organizationId || !email || !tierId) {
            return NextResponse.json(
                { error: 'organizationId, email, and tierId required' },
                { status: 400 }
            );
        }

        if (!SUBSCRIPTION_TIERS[tierId as keyof typeof SUBSCRIPTION_TIERS]) {
            return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const checkoutUrl = await createSepaSetupSession(
            organizationId,
            email,
            name || email,
            tierId as keyof typeof SUBSCRIPTION_TIERS,
            `${baseUrl}/dashboard/billing?subscription=success`,
            `${baseUrl}/dashboard/billing?subscription=canceled`
        );

        return NextResponse.json({ url: checkoutUrl });
    } catch (error) {
        console.error('Subscription creation error:', error);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }
}

// GET: Get subscription status
export async function GET(request: NextRequest) {
    try {
        const orgId = request.headers.get('x-organization-id') || 'demo-org';

        const status = await getSubscriptionStatus(orgId);

        return NextResponse.json({
            ...status,
            tiers: SUBSCRIPTION_TIERS,
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }
}

// DELETE: Cancel subscription
export async function DELETE(request: NextRequest) {
    try {
        const orgId = request.headers.get('x-organization-id') || 'demo-org';

        const success = await cancelSubscription(orgId);

        if (!success) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' });
    } catch (error) {
        console.error('Cancellation error:', error);
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
}
