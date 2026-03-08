import { NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";

// Simple connection endpoint for Admin (In a real app, uses full OAuth 2.0 flow)
// For sovereign admin, we will just accept the Person URN and Access Token directly
// from the dashboard UI to bypass complex callback setups during deployment.
export async function POST(req: Request) {
    try {
        const { platform, accessToken, externalId, organizationId } = await req.json();

        if (!platform || !accessToken || !externalId || !organizationId) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        let targetOrgId = organizationId;
        if (targetOrgId === 'genesis_core_org') {
            const adminOrg = await prisma.organization.findUnique({
                where: { domain: 'ela-revolution.com' }
            });
            if (!adminOrg) {
                return NextResponse.json({ success: false, error: 'Admin Org Not Found' }, { status: 400 });
            }
            targetOrgId = adminOrg.id;
        }

        const credentials = JSON.stringify({ accessToken, externalId });

        // Upsert the integration
        const integration = await prisma.integration.upsert({
            where: {
                id: `${targetOrgId}_${platform}` // Hack to find it, normally we don't have a direct unique constraint on org+provider. 
                // We'll search by orgId and Provider instead below.
            },
            update: {
                credentials,
                status: 'active'
            },
            create: {
                provider: platform,
                credentials,
                config: '{}',
                organizationId: targetOrgId,
                status: 'active'
            }
        }).catch(async (e) => {
            // Find existing if upsert by ID fails (since we don't have a unique composite constraint)
            const existing = await prisma.integration.findFirst({
                where: { organizationId: targetOrgId, provider: platform }
            });

            if (existing) {
                return await prisma.integration.update({
                    where: { id: existing.id },
                    data: { credentials, status: 'active' }
                });
            } else {
                return await prisma.integration.create({
                    data: {
                        provider: platform,
                        credentials,
                        config: '{}',
                        organizationId,
                        status: 'active'
                    }
                });
            }
        });

        return NextResponse.json({ success: true, integration });

    } catch (error: any) {
        console.error("Error saving integration:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
        return NextResponse.json({ success: false, error: "Missing orgId" }, { status: 400 });
    }

    try {
        const integrations = await prisma.integration.findMany({
            where: { organizationId: orgId }
        });

        // Map safe data to return to frontend
        const safeIntegrations = integrations.map(i => ({
            id: i.id,
            provider: i.provider,
            status: i.status,
            lastSync: i.lastSync,
            // DO NOT RETURN FULL CREDENTIALS TO THE FRONTEND
            isConfigured: true
        }));

        return NextResponse.json({ success: true, integrations: safeIntegrations });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
