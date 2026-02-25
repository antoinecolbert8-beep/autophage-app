import { publishToMultiplePlatforms } from '../lib/social-media-manager';
import { distributeTo100PercentFreeChannels } from '../lib/services/free-traffic';
import { prisma } from '../lib/prisma';

async function testAllPlatforms() {
    console.log("🚀 STARTING GLOBAL OMNI-CHANNEL PUBLICATION TEST\n");

    const testContent = {
        title: "ELA Genesis : L'avènement de l'automatisation souveraine",
        excerpt: "Découvrez comment ELA redéfinit la domination numérique par l'IA.",
        content: "Test Global ELA Genesis V1 - $[TIMESTAMP]\n\n" +
            "Le futur n'est pas automatisé, il est souverain. Rejoignez la révolution ELA.\n\n" +
            "#ELAGenesis #AI #Sovereignty #Automation",
        mediaUrls: ["https://ela-revolution.com/assets/godmode-launch.png"],
        hashtags: ["ELAGenesis", "Sovereignty", "AI"]
    };

    const platforms: any[] = [
        'LINKEDIN',
        'FACEBOOK',
        'TWITTER',
        'INSTAGRAM',
        'TIKTOK',
        'SNAPCHAT',
        'YOUTUBE_SHORT'
    ];

    console.log(`🌐 Testing ${platforms.length} Social Platforms...`);

    // We use 'admin-org' to ensure we use the system integrations we configured
    const socialResults = await publishToMultiplePlatforms(
        {
            content: testContent.content.replace('$[TIMESTAMP]', new Date().toISOString()),
            mediaUrls: testContent.mediaUrls,
            hashtags: testContent.hashtags,
            platform: 'LINKEDIN' // Primary type
        } as any,
        platforms,
        'admin-org'
    );

    console.log("\n📊 SOCIAL PUBLICATION RESULTS:");
    console.table(socialResults);

    console.log("\n📢 Testing Free Traffic Channels (Reddit, HN, Medium via n8n)...");
    try {
        const freeTrafficResults = await distributeTo100PercentFreeChannels({
            title: testContent.title,
            excerpt: testContent.excerpt,
            url: "https://ela-revolution.com/blog/genesis-v1"
        });
        console.log("✅ FREE TRAFFIC RESULTS:", freeTrafficResults);
    } catch (error: any) {
        console.error("❌ FREE TRAFFIC FAILED:", error.message);
    }

    console.log("\n✨ TEST CYCLE COMPLETE");
}

testAllPlatforms().catch(err => {
    console.error("💥 TEST CRASHED:", err);
    process.exit(1);
});
