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

    if (provider === 'linkedin') {
        const state = Math.random().toString(36).substring(7);
        const scope = encodeURIComponent('openid profile email w_member_social');
        const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`);

        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
        return NextResponse.redirect(authUrl);
    }

    if (provider === 'twitter') {
        // Twitter OAuth 2.0
        const state = Math.random().toString(36).substring(7);
        const codeChallenge = "challenge"; // Should be properly generated in prod
        const scope = encodeURIComponent('tweet.read tweet.write users.read offline.access');
        const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter`);

        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=plain`;
        return NextResponse.redirect(authUrl);
    }

    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
}
