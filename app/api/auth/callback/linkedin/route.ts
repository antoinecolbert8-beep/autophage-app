import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // 1. Exchange Code for Token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            throw new Error(tokenData.error_description || 'Failed to exchange token');
        }

        // 2. Get User Profile (to name the integration)
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });
        const profileData = await profileResponse.json();

        // 3. Save to Database
        // For this single-user God Mode, we attach to the main Admin Organization
        const adminUser = await prisma.user.findFirst({
            where: { role: 'admin' },
            include: { organization: true }
        });

        if (!adminUser || !adminUser.organization) {
            return NextResponse.json({ error: 'No Admin Organization found to attach integration' }, { status: 404 });
        }

        await prisma.integration.create({
            data: {
                provider: 'linkedin',
                organizationId: adminUser.organizationId,
                credentials: JSON.stringify(tokenData), // Encrypt this in real prod
                config: JSON.stringify(profileData),
                status: 'active'
            }
        });

        // 4. Redirect to Dashboard with success
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/consent?success=linkedin`);

    } catch (error: any) {
        console.error("LinkedIn Auth Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/consent?error=linkedin_failed`);
    }
}
