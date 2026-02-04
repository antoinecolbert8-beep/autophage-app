#!/usr/bin/env node
import 'dotenv/config';
import { getYouTubeAuthUrl, getRefreshToken } from '../lib/services/youtube-upload';
import * as readline from 'readline';

/**
 * 🔐 YouTube OAuth Setup Script
 * Run this once to get your YOUTUBE_REFRESH_TOKEN
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("🎬 YouTube OAuth Setup\n");
  console.log("Prerequisites:");
  console.log("1. Go to: https://console.cloud.google.com/");
  console.log("2. Enable YouTube Data API v3");
  console.log("3. Create OAuth 2.0 credentials (Desktop App)");
  console.log("4. Add to .env:");
  console.log("   YOUTUBE_CLIENT_ID=your_client_id");
  console.log("   YOUTUBE_CLIENT_SECRET=your_client_secret\n");

  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
    console.error("❌ Missing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET in .env");
    console.log("\nAdd these first, then run this script again.");
    process.exit(1);
  }

  console.log("\n✅ Credentials found in .env\n");
  console.log("STEP 1: Open this URL in your browser:\n");

  const authUrl = getYouTubeAuthUrl();
  console.log(authUrl);
  console.log("\n");

  const code = await question("STEP 2: Paste the authorization code here: ");

  if (!code) {
    console.error("❌ No code provided");
    process.exit(1);
  }

  console.log("\n🔄 Exchanging code for refresh token...");

  try {
    const refreshToken = await getRefreshToken(code.trim());

    console.log("\n✅ SUCCESS! Add this to your .env file:\n");
    console.log(`YOUTUBE_REFRESH_TOKEN=${refreshToken}\n`);
    console.log("🎯 You can now upload videos to YouTube!");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.log("\nMake sure:");
    console.log("1. You pasted the full authorization code");
    console.log("2. Your OAuth credentials are correct");
    console.log("3. You authorized the app in the browser");
  }

  rl.close();
}

main();
