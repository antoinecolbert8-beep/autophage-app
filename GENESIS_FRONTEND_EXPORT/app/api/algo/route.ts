import { NextRequest, NextResponse } from 'next/server';
import {
    predictOptimalTiming,
    amplifySuccessfulContent,
    generateAlgorithmReport,
} from '@/lib/algo/intelligence';

// GET: Get algorithm intelligence report
export async function GET(request: NextRequest) {
    try {
        const orgId = request.headers.get('x-organization-id') || 'demo-org';

        const report = await generateAlgorithmReport(orgId);

        return NextResponse.json(report);
    } catch (error) {
        console.error('Algorithm report error:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}

// POST: Trigger amplification for successful content
export async function POST(request: NextRequest) {
    try {
        const { contentId, platform, engagementRate } = await request.json();

        if (!contentId || !platform) {
            return NextResponse.json(
                { error: 'contentId and platform required' },
                { status: 400 }
            );
        }

        const result = await amplifySuccessfulContent(
            contentId,
            platform,
            engagementRate || 0.1
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Amplification error:', error);
        return NextResponse.json({ error: 'Failed to amplify' }, { status: 500 });
    }
}
