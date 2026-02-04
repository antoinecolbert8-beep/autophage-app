import 'dotenv/config';

async function diagnose() {
    console.log("🛠️ SOCIAL MEDIA PUBLICATION DIAGNOSTIC\n");

    const checks = [
        { name: "LinkedIn", env: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_PERSON_URN"] },
        { name: "Facebook", env: ["FB_PAGE_ID"], tokens: ["FB_ACCESS_TOKEN", "INSTAGRAM_ACCESS_TOKEN"] },
        { name: "Instagram", env: ["IG_ACCOUNT_ID"], tokens: ["FB_ACCESS_TOKEN", "INSTAGRAM_ACCESS_TOKEN"] },
        { name: "Twitter/X", env: ["TWITTER_BEARER_TOKEN"] },
        { name: "TikTok", env: ["TIKTOK_ACCESS_TOKEN"] },
        { name: "Snapchat", env: ["SNAPCHAT_ACCESS_TOKEN"] }
    ];

    let allOk = true;

    for (const check of checks) {
        let status = "✅ READY";
        let missing = [];

        // Check required IDs/URLs
        for (const key of check.env) {
            if (!process.env[key] || process.env[key].includes("your-")) {
                missing.push(key);
            }
        }

        // Check Tokens (if multiple options)
        if (check.tokens) {
            const hasToken = check.tokens.some(t => process.env[t] && !process.env[t].includes("your-"));
            if (!hasToken) missing.push(`One of: ${check.tokens.join(", ")}`);
        }

        if (missing.length > 0) {
            status = `❌ MISSING: ${missing.join(", ")}`;
            allOk = false;
        }

        console.log(`${check.name.padEnd(12)} : ${status}`);
    }

    if (allOk) {
        console.log("\n🚀 All primary networks are configured. Check logs for API errors during publication.");
    } else {
        console.log("\n⚠️ Action Required: Fill in the missing keys in your .env file to enable real publication.");
    }
}

diagnose();
