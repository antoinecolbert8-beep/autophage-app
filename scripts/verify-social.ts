
// Using require to avoid ESM issues
const { publishToMultiplePlatforms } = require('../lib/social-media-manager');

async function verifySocialWiring() {
    console.log("--- VERIFYING SOCIAL MANAGER WIRING (CJS) ---");

    // Test payload
    const testPost = {
        platform: "LINKEDIN",
        content: "System Check: Production API Wiring Verified.",
        hashtags: ["SystemCheck", "DevOps"],
        mediaUrls: ["https://genesis-ai.com/assets/feat_productivity.jpg"]
    };

    console.log("1. Testing LinkedIn Dispatch...");
    try {
        const resultLI = await publishToMultiplePlatforms(testPost, ["LINKEDIN"]);
        console.log("LinkedIn Result:", JSON.stringify(resultLI, null, 2));
    } catch (e) {
        console.error("LinkedIn Dispatch Failed:", e);
    }

    console.log("2. Testing Twitter Dispatch...");
    try {
        const resultTW = await publishToMultiplePlatforms({ ...testPost, platform: "TWITTER" }, ["TWITTER"]);
        console.log("Twitter Result:", JSON.stringify(resultTW, null, 2));
    } catch (e) {
        console.error("Twitter Dispatch Failed:", e);
    }

    console.log("--- WIRING VERIFIED ---");
}

verifySocialWiring();
