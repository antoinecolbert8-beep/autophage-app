import { NextRequest, NextResponse } from 'next/server';
import { updateUserConsent } from '@/lib/consent';

export async function POST(request: NextRequest) {
    try {
        const consents = await request.json();

        // Get user from session (implement your auth)
        const userId = 'demo-user'; // Replace with actual user ID from session

        await updateUserConsent(userId, consents);

        return NextResponse.json({
            success: true,
            message: 'Consents updated successfully',
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error updating consents:', error);
        return NextResponse.json(
            { error: 'Failed to update consents' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = 'demo-user'; // Get from session

        // Fetch user consents
        const consents = await import('@/lib/consent').then(m => m.getUserConsent(userId));

        return NextResponse.json({ consents });
    } catch (error) {
        console.error('Error fetching consents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch consents' },
            { status: 500 }
        );
    }
}
