import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * 🏗️ ADMIN ONLY — Check system health metrics
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const checks = {
        database: 'unknown',
        stripe: 'unknown',
        openai: 'unknown',
        supabase: 'unknown',
        stripeWebhookConfigured: false,
        supabaseManagementToken: !!process.env.SUPABASE_MANAGEMENT_TOKEN,
    };

    // Check Stripe
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    checks.stripe = stripeKey && stripeKey.startsWith('sk_') ? 'configured' : 'missing';

    // Check Stripe webhook
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    checks.stripeWebhookConfigured = webhookSecret.startsWith('whsec_') && !webhookSecret.includes('REMPLACER');

    // Check OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    checks.openai = openaiKey && openaiKey.startsWith('sk-') ? 'configured' : 'missing';

    // Check DB connection
    try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        await prisma.$disconnect();
        checks.database = 'connected';
    } catch {
        checks.database = 'disconnected';
    }

    // Check Supabase status via Management API
    const mgmtToken = process.env.SUPABASE_MANAGEMENT_TOKEN;
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

    if (mgmtToken && projectRef) {
        try {
            const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
                headers: { Authorization: `Bearer ${mgmtToken}` },
            });
            const data = await res.json();
            checks.supabase = data.status || 'unknown';
        } catch {
            checks.supabase = 'api_error';
        }
    } else {
        checks.supabase = 'token_missing';
    }

    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        checks,
        projectRef,
        netlifyUrl: process.env.NEXT_PUBLIC_APP_URL,
    });
}
