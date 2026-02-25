import { publishToMultiplePlatforms } from '../lib/social-media-manager';
import { distributeTo100PercentFreeChannels } from '../lib/services/free-traffic';
import { db as prisma } from '../core/db';

async function globalAlertProtocol() {
    console.log("🚨 ACTIVATING GLOBAL ALERT PROTOCOL: MEDIA & PARTNERS LAUNCH\n");

    const releaseContent = {
        title: "OFFICIEL : ELA Ouvre son Infrastructure au Monde",
        excerpt: "Lancement de l'Espace Presse et du Programme Partenaire Souverain (30% récurrent).",
        content: `🚨 COMMUNIQUÉ OFFICIEL ELA 🚨\n\n` +
            `Nous ouvrons aujourd'hui les portes de la Manufacture ELA. \n\n` +
            `👉 ESPACE PRESSE : Accédez à notre kit média v10.4 pour les journalistes.\n` +
            `👉 PROGRAMME PARTENAIRE : Gagnez 30% de commission récurrente à vie en rejoignant l'Empire.\n\n` +
            `Bâtissez le futur souverain avec nous.\n\n` +
            `https://ela-revolution.com/press\n` +
            `https://ela-revolution.com/partners\n\n` +
            `#ELARevolution #IA #Affiliation #Presse #SaaS #Dominance`,
        mediaUrls: ["https://ela-revolution.com/og-image.png"],
        hashtags: ["ELARevolution", "IA", "Affiliation", "Sovereignty"]
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

    console.log(`🌐 Broadcasting to ${platforms.length} Social Platforms...`);

    const socialResults = await publishToMultiplePlatforms(
        {
            content: releaseContent.content,
            mediaUrls: releaseContent.mediaUrls,
            hashtags: releaseContent.hashtags,
            platform: 'LINKEDIN'
        } as any,
        platforms,
        'admin-org'
    );

    console.log("\n📊 BROADCAST RESULTS:");
    console.table(socialResults);

    console.log("\n📢 Saturating Free Traffic Channels (Reddit, HackerNews, Medium)...");
    try {
        const freeTrafficResults = await distributeTo100PercentFreeChannels({
            title: releaseContent.title,
            excerpt: releaseContent.excerpt,
            url: "https://ela-revolution.com/press"
        });
        console.log("✅ SATURATION COMPLETE:", freeTrafficResults);
    } catch (error: any) {
        console.error("❌ SATURATION ERROR:", error.message);
    }

    console.log("\n🏆 GLOBAL ALERT PROTOCOL FULLY EXECUTED. ELA IS NOW OMNIPRESENT.");
}

globalAlertProtocol().catch(err => {
    console.error("💥 PROTOCOL CRASHED:", err);
    process.exit(1);
});
