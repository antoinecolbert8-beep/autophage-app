import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * 🗄️ ADMIN ONLY — Auto-resume Supabase project via Management API
 * Uses the Supabase Management API to wake up a paused project.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabaseManagementToken = process.env.SUPABASE_MANAGEMENT_TOKEN;
    const supabaseUrl = process.env.SUPABASE_URL || '';

    // Extract project ref from URL: https://xxxxx.supabase.co → xxxxx
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

    if (!supabaseManagementToken) {
        return NextResponse.json({
            error: 'SUPABASE_MANAGEMENT_TOKEN not configured',
            instructions: 'Go to https://supabase.com/dashboard/account/tokens to generate a personal access token, then add it to your .env as SUPABASE_MANAGEMENT_TOKEN',
            projectRef,
            manualUrl: `https://supabase.com/dashboard/project/${projectRef}`,
        }, { status: 400 });
    }

    try {
        // Try to get project status first
        const statusRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
            headers: {
                Authorization: `Bearer ${supabaseManagementToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!statusRes.ok) {
            throw new Error(`Supabase API error: ${statusRes.status} ${await statusRes.text()}`);
        }

        const projectData = await statusRes.json();

        if (projectData.status === 'ACTIVE_HEALTHY') {
            return NextResponse.json({
                status: 'already_active',
                message: 'Supabase project is already active and healthy!',
                projectRef,
            });
        }

        // Resume the project
        const resumeRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/restore`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${supabaseManagementToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!resumeRes.ok) {
            throw new Error(`Resume failed: ${resumeRes.status} ${await resumeRes.text()}`);
        }

        return NextResponse.json({
            status: 'resuming',
            message: 'Supabase project is being resumed. This may take 30-60 seconds.',
            projectRef,
            currentStatus: projectData.status,
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            manualUrl: `https://supabase.com/dashboard/project/${projectRef}`,
        }, { status: 500 });
    }
}

// Check status endpoint
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabaseManagementToken = process.env.SUPABASE_MANAGEMENT_TOKEN;
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

    if (!supabaseManagementToken) {
        return NextResponse.json({
            status: 'token_missing',
            projectRef,
            manualUrl: `https://supabase.com/dashboard/project/${projectRef}`,
        });
    }

    try {
        const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
            headers: { Authorization: `Bearer ${supabaseManagementToken}` },
        });
        const data = await res.json();
        return NextResponse.json({ status: data.status, projectRef, name: data.name });
    } catch (error: any) {
        return NextResponse.json({ status: 'error', error: error.message });
    }
}
