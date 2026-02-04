
import { generateViralShortsBatch, createAndUploadShort } from "../lib/youtube-short-generator";
import { getRealTrends } from "../lib/services/real-trends";

/**
 * 🎬 VIDEO FLOOD
 * Generates Viral Shorts based on Real Trends and pushes them to YouTube (Bypass Mode).
 */
export async function runVideoFlood() {
    console.log("🎬 ACTIVATING VIDEO FLOOD (YOUTUBE SHORTS)...");

    // 1. Get Trends
    const trends = await getRealTrends('FR');
    if (trends.length === 0) { console.error("❌ No Trends for Video."); return; }

    // 2. Pick Top Trend + Random for Variety
    const topTrend = trends[0];
    const secondaryTrend = trends[Math.min(trends.length - 1, 1 + Math.floor(Math.random() * 2))];

    const targets = [topTrend.keyword];
    if (secondaryTrend.keyword !== topTrend.keyword) targets.push(secondaryTrend.keyword);

    console.log(`📹 Targeting for Video: ${targets.join(", ")}`);

    // 3. Generate Batch
    await generateViralShortsBatch(targets);

    console.log("✅ VIDEO FLOOD COMPLETE.");
}

// Allow standalone execution if run directly
if (require.main === module) {
    runVideoFlood();
}
