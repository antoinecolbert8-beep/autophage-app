import { google } from 'googleapis';
import fs from 'fs';
import axios from 'axios';

/**
 * 📺 REAL YouTube Upload Service
 * Direct integration with YouTube Data API v3 - NO SIMULATION
 */

const youtube = google.youtube('v3');

interface UploadParams {
    videoUrl: string;
    title: string;
    description: string;
    tags: string[];
    privacyStatus: 'public' | 'unlisted' | 'private';
}

/**
 * Initialize OAuth2 client with credentials from env
 */
function getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback'
    );

    // Set refresh token if available
    if (process.env.YOUTUBE_REFRESH_TOKEN) {
        oauth2Client.setCredentials({
            refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
        });
    }

    return oauth2Client;
}

/**
 * Upload video to YouTube directly (REAL)
 */
export async function uploadVideoToYouTube(params: UploadParams): Promise<string> {
    console.log("📺 [REAL] Uploading to YouTube via Direct API...");

    const auth = getAuthClient();

    // Verify we have credentials
    if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REFRESH_TOKEN) {
        throw new Error(`
❌ MISSING YouTube Credentials!
Required in .env:
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET  
- YOUTUBE_REFRESH_TOKEN

Run: npm run youtube:auth to get your refresh token
        `);
    }

    try {
        // Download video from URL to temp file
        console.log("📥 Downloading video from URL...");
        const videoPath = `/tmp/upload_${Date.now()}.mp4`;
        const response = await axios.get(params.videoUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log("✅ Video downloaded, uploading to YouTube...");

        // Upload to YouTube
        const res = await youtube.videos.insert({
            auth,
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: params.title,
                    description: params.description,
                    tags: params.tags,
                    categoryId: '22' // People & Blogs
                },
                status: {
                    privacyStatus: params.privacyStatus,
                    selfDeclaredMadeForKids: false
                }
            },
            media: {
                body: fs.createReadStream(videoPath)
            }
        });

        // Cleanup temp file
        fs.unlinkSync(videoPath);

        const videoId = res.data.id;
        console.log(`✅ [REAL] YouTube Upload Success! ID: ${videoId}`);
        console.log(`   URL: https://youtube.com/watch?v=${videoId}`);

        return videoId!;

    } catch (error: any) {
        console.error("❌ YouTube Upload Failed:", error.message);
        if (error.code === 'invalid_grant') {
            throw new Error("YouTube token expired. Run: npm run youtube:auth");
        }
        throw error;
    }
}

/**
 * Generate OAuth URL for first-time setup
 */
export function getYouTubeAuthUrl(): string {
    const oauth2Client = getAuthClient();

    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
}

/**
 * Exchange authorization code for refresh token
 */
export async function getRefreshToken(code: string): Promise<string> {
    const oauth2Client = getAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens.refresh_token!;
}
