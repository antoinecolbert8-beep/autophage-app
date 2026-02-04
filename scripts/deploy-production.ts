#!/usr/bin/env node
import { execSync } from 'child_process';

/**
 * 🚀 Deploy to Vercel Production
 * Deploys the app and submits sitemap to Google
 */

console.log("🚀 Deploying to Vercel production...\n");

try {
    // Check if vercel is logged in
    try {
        execSync('vercel whoami', { stdio: 'pipe' });
    } catch (e) {
        console.log("⚠️ Not logged into Vercel. Run: vercel login");
        process.exit(1);
    }

    // Build the app
    console.log("📦 Building application...");
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy to production
    console.log("\n🚀 Deploying to production...");
    const result = execSync('vercel --prod --yes', { encoding: 'utf-8' });

    const urlMatch = result.match(/https:\/\/[^\s]+/);
    const productionUrl = urlMatch ? urlMatch[0] : null;

    if (productionUrl) {
        console.log(`\n✅ Deployed to: ${productionUrl}`);

        // Ping Google for indexing
        console.log("\n🔍 Submitting sitemap to Google...");
        try {
            execSync(`curl -s "https://www.google.com/ping?sitemap=${productionUrl}/sitemap.xml"`, { stdio: 'inherit' });
            console.log("✅ Sitemap submitted to Google");
        } catch (e) {
            console.warn("⚠️ Failed to ping Google (non-critical)");
        }

        console.log("\n🎯 LIVE URL:", productionUrl);
        console.log("📊 Blog:", `${productionUrl}/blog`);
        console.log("🗺️ Sitemap:", `${productionUrl}/sitemap.xml`);
    }

} catch (error: any) {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
}
