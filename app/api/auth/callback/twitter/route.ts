import { NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";

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
        const basicAuth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET} `).toString('base64');

        const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth} `
            },
            body: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL} /api/auth / callback / twitter`,
                code_verifier: 'challenge' // Matching the 'plain' challenge from the auth url
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error("Twitter Token Error:", tokenData);
            throw new Error(tokenData.error_description || 'Failed to exchange token');
        }

        // 2. Get User Profile
        const profileResponse = await fetch('https://api.twitter.com/2/users/me', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token} ` }
        });
        const profileData = await profileResponse.json();

        // 3. Save to Database
        const adminUser = await prisma.user.findFirst({
            where: { role: 'admin' },
            include: { organization: true }
        });

        if (!adminUser || !adminUser.organization) {
            return NextResponse.json({ error: 'No Admin Organization found to attach integration' }, { status: 404 });
        }

        await prisma.integration.create({
            data: {
                provider: 'twitter',
                organizationId: adminUser.organizationId,
                credentials: JSON.stringify(tokenData),
                config: JSON.stringify(profileData),
                status: 'active'
            }
        });

        // 4. Redirect to Dashboard
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL} /dashboard/consent ? success = twitter`);

    } catch (error: any) {
        console.error("Twitter Auth Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL} /dashboard/consent ? error = twitter_failed`);
    }
}
