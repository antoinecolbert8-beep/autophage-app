import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Initiate Google OAuth flow
export async function GET(
    request: NextRequest,
    { params }: { params: { provider: string } }
) {
    const { provider } = params;

    if (provider === 'google-analytics' || provider === 'google-search-console') {
        const scopes = [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/webmasters.readonly',
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });

        return NextResponse.redirect(authUrl);
    }

    if (provider === 'instagram') {
        // Instagram OAuth (already have token configured)
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
        return NextResponse.redirect(authUrl);
    }

    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
}
