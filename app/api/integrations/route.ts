import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations
 * Fetch all integrations for the current org
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const integrations = await prisma.integration.findMany({
        where: { organizationId: user.organizationId },
        select: {
            id: true,
            provider: true,
            status: true,
            lastSync: true,
            createdAt: true,
            // NOTE: never expose raw credentials to client — only return existence
            credentials: false,
            config: true,
        }
    });

    // Return safe version: indicate if credentials are set
    const safe = await Promise.all(
        integrations.map(async (integ) => {
            const raw = await prisma.integration.findUnique({
                where: { id: integ.id },
                select: { credentials: true }
            });
            let hasCredentials = false;
            try {
                const parsed = JSON.parse(raw?.credentials || '{}');
                hasCredentials = Object.keys(parsed).length > 0;
            } catch { }
            return { ...integ, hasCredentials };
        })
    );

    return NextResponse.json({ integrations: safe });
}

/**
 * POST /api/integrations
 * Create or update an integration for the current org
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { provider, credentials, config } = body;

    if (!provider || !credentials) {
        return NextResponse.json({ error: 'provider and credentials are required' }, { status: 400 });
    }

    // Validate provider is allowed — all channels supported by the UI must be listed here
    const ALLOWED_PROVIDERS = [
        // Native OAuth channels
        'LINKEDIN', 'X_PLATFORM', 'TWITTER', 'FACEBOOK', 'INSTAGRAM',
        'SHOPIFY', 'WHATSAPP', 'TIKTOK', 'GOOGLE_ANALYTICS', 'YOUTUBE_SEO',
        // Orchestrated / Webhook channels (Make.com / n8n bridge)
        'SNAPCHAT', 'REDDIT', 'MEDIUM', 'HACKERNEWS', 'DEVTO',
        // Extended ELA modules
        'EMAIL_NEWSLETTER', 'ADS_SCALE', 'AFFILIATE_LEVERAGE',
    ];
    if (!ALLOWED_PROVIDERS.includes(provider.toUpperCase())) {
        return NextResponse.json({ error: `Provider '${provider}' is not supported` }, { status: 400 });
    }

    // Upsert: one integration per provider per org
    const existing = await prisma.integration.findFirst({
        where: { organizationId: user.organizationId, provider: provider.toUpperCase() }
    });

    let integration;
    if (existing) {
        integration = await prisma.integration.update({
            where: { id: existing.id },
            data: {
                credentials: JSON.stringify(credentials),
                config: JSON.stringify(config || {}),
                status: 'active',
                lastSync: new Date()
            }
        });
    } else {
        integration = await prisma.integration.create({
            data: {
                provider: provider.toUpperCase(),
                credentials: JSON.stringify(credentials),
                config: JSON.stringify(config || {}),
                organizationId: user.organizationId,
                status: 'active',
                lastSync: new Date()
            }
        });
    }

    return NextResponse.json({
        success: true,
        message: `Intégration ${provider} activée avec succès`,
        id: integration.id
    });
}

/**
 * DELETE /api/integrations/[provider]
 * Remove an integration
 */
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const provider = searchParams.get('provider');

    if (!provider) {
        return NextResponse.json({ error: 'provider query param required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { organizationId: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.integration.deleteMany({
        where: { organizationId: user.organizationId, provider: provider.toUpperCase() }
    });

    return NextResponse.json({ success: true, message: `Intégration ${provider} supprimée` });
}
