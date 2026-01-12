import { NextRequest, NextResponse } from 'next/server';
import { executeMarketDominationWorkflow } from '@/lib/workflows/market-domination';

export async function POST(request: NextRequest) {
    try {
        const { keyword, projectId } = await request.json();

        if (!keyword || !projectId) {
            return NextResponse.json(
                { error: 'keyword and projectId required' },
                { status: 400 }
            );
        }

        console.log(`🎯 Executing market domination for: ${keyword}`);

        const result = await executeMarketDominationWorkflow(keyword, projectId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Workflow execution error:', error);
        return NextResponse.json(
            { error: 'Failed to execute workflow' },
            { status: 500 }
        );
    }
}
