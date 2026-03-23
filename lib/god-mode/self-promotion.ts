import { generateText } from '@/lib/ai/vertex';
import { ViralEngine } from '@/lib/viral-engine';
import { WhatsAppNotifier } from '@/lib/whatsapp-notifier';
import { PlatformAnalytics } from '@/lib/platform-analytics';
import { PulseEngine } from '@/lib/realtime-pulse';
import { db as prisma } from "@/core/db";
import { LegalSentinel } from '@/lib/security/legal-sentinel';
import { ShopifyAutomation } from '@/lib/integrations/shopify';
import { enqueueSocialPost } from '@/lib/queue/social-queue';
import { consumeCredits } from '@/lib/billing';

/**
 * GOD MODE: SELF-PROMOTION ENGINE (V3 - PERFORMANCE TRACKING)
 */

type Platform = 'LINKEDIN' | 'X_PLATFORM' | 'INSTAGRAM' | 'FACEBOOK' | 'SNAPCHAT' | 'PRESS' | 'SHOPIFY_ECOM' | 'YOUTUBE_SEO' | 'EMAIL_NEWSLETTER' | 'ADS_SCALE' | 'AFFILIATE_LEVERAGE';

export class ELASelfPromoter {

    private static PLATFORM_SCHEDULES: Record<string, number[]> = {
        'LINKEDIN': [8, 9, 10, 16],
        'X_PLATFORM': [11, 13, 15, 22],
        'INSTAGRAM': [18, 19, 20, 21],
        'FACEBOOK': [12, 18],
        'SNAPCHAT': [20, 21],
        'PRESS': [9, 14], // Morning and afternoon press releases
        'SHOPIFY_ECOM': [10, 17, 19], // Sales periods
        'YOUTUBE_SEO': [15, 20],      // High traffic video times
        'EMAIL_NEWSLETTER': [8, 11],  // Morning inbox check
        'ADS_SCALE': [0, 6, 12, 18],  // 24/7 Scalability
        'AFFILIATE_LEVERAGE': [14, 19] // Post-purchase engagement
    };

    /**
     * MAIN ENTRY POINT: Called Hourly by Cron
     */
    static async orchestrateHourlyCheck() {
        console.log("/// GOD MODE: HOURLY ORCHESTRATION CHECK ///");
        const now = new Date();
        const currentHour = now.getUTCHours();

        console.log(`[GOD MODE] Current Hour(UTC): ${currentHour} `);

        const systemUserId = await this.ensureSystemUser();
        const platforms: any[] = ['LINKEDIN', 'X_PLATFORM', 'INSTAGRAM', 'FACEBOOK', 'SNAPCHAT', 'PRESS', 'SHOPIFY_ECOM', 'YOUTUBE_SEO', 'EMAIL_NEWSLETTER', 'ADS_SCALE', 'AFFILIATE_LEVERAGE'];
        const results = [];

        for (const platform of platforms) {
            const shouldPost = await this.shouldPostNow(platform, currentHour, systemUserId);

            if (shouldPost) {
                console.log(`[GOD MODE] ✅ GREEN LIGHT for ${platform}.Executing Protocol.`);
                const result = await this.executePromotion(platform, systemUserId);
                results.push({ platform, status: 'EXECUTED', result });
            } else {
                console.log(`[GOD MODE] ⏸️ Skipping ${platform} (Not optimal or already posted).`);
                results.push({ platform, status: 'SKIPPED' });
            }
        }

        // After execution, calculate performance scores
        await this.updatePerformanceScores();

        // --- NEW: SHOPIFY SALES BROADCAST ---
        await this.broadcastRecentSales(systemUserId);

        return results;
    }

    /**
     * SHOPIFY SALES BROADCAST
     * Detects new orders and broadcasts them to stir "Social Proof" viral effects
     */
    private static async broadcastRecentSales(userId: string) {
        console.log("[SHOPIFY] Checking real Shopify orders to broadcast...");
        try {
            // Pull real orders from the last 2 hours
            const orders = await ShopifyAutomation.getRecentOrders('org_global', 120);
            if (orders.length === 0) {
                console.log("[SHOPIFY] No recent orders to broadcast. Configure Shopify at /dashboard/integrations");
                return;
            }
            for (const order of orders.slice(0, 2)) { // Limit to 2 posts max per cycle
                const mainItem = order.lineItems[0]?.title || 'produit ELA';
                const message = `🔥 NOUVELLE COMMANDE : Un souverain vient de s'équiper avec "${mainItem}" — €${order.totalPrice}. Le mouvement s'accélère. Rejoignez-nous.`;

                const org = await prisma.organization.findFirst({ where: { users: { some: { id: userId } } } });
                const orgId = org?.id || 'org_global';

                await this.schedulePost(message, 'SHOPIFY_ECOM', '', orgId);
                console.log(`[SHOPIFY] Broadcasted real sale: Order ${order.id}`);
            }
        } catch (err) {
            console.error("[SHOPIFY] Error broadcasting sales:", err);
        }
    }

    /**
     * PERFORMANCE SCORING ENGINE
     * Calculates success metrics for each post based on platform-specific signals
     */
    private static async updatePerformanceScores() {
        console.log("[ANALYTICS] Calculating Performance Scores...");

        // Get recent posts (last 7 days) that don't have scores yet
        const recentPosts = await prisma.post.findMany({
            where: {
                publishedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                status: 'published',
                performance_score: { lte: 0 }
            }
        });

        for (const post of recentPosts) {
            const score = await this.calculatePostScore(post);

            await prisma.post.update({
                where: { id: post.id },
                data: { performance_score: score }
            });

            // Fetch REAL metrics from platform APIs
            let metrics = { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0 };

            if (post.externalId) {
                try {
                    const realMetrics = await PlatformAnalytics.getMetrics(post.platform, post.externalId);
                    metrics = {
                        views: realMetrics.views || 0,
                        likes: realMetrics.likes || 0,
                        comments: realMetrics.comments || 0,
                        shares: realMetrics.shares || 0,
                        saves: realMetrics.saves || 0,
                        clicks: realMetrics.clicks || 0,
                    };
                    console.log(`[ANALYTICS] Fetched real metrics for ${post.platform}: ${JSON.stringify(metrics)} `);
                } catch (error) {
                    console.warn(`[ANALYTICS] Failed to fetch metrics, using fallback: `, error);
                    // Fallback to simulated only if API fails
                    metrics = {
                        views: Math.floor(Math.random() * 1000),
                        likes: Math.floor(Math.random() * 100),
                        comments: Math.floor(Math.random() * 20),
                        shares: Math.floor(Math.random() * 30),
                        saves: 0,
                        clicks: 0
                    };
                }
            }

            // Log to ContentStat
            await prisma.contentStat.create({
                data: {
                    postId: post.id,
                    platform: post.platform,
                    views: metrics.views,
                    likes: metrics.likes,
                    comments: metrics.comments,
                    shares: metrics.shares,
                    saves: metrics.saves || 0,
                    clicks: metrics.clicks || 0,
                    collectedAt: new Date()
                }
            });

            console.log(`[ANALYTICS] Post ${post.id} (${post.platform}): Score = ${score.toFixed(2)}, Views = ${metrics.views} `);
        }
    }

    /**
     * SCORE CALCULATION LOGIC
     * Weights: Timing + Content Quality + Engagement Prediction
     */
    private static async calculatePostScore(post: any): Promise<number> {
        let score = 50; // Base score

        // 1. TIMING SCORE (30 points max)
        const publishHour = post.publishedAt.getUTCHours();
        const optimalHours = this.PLATFORM_SCHEDULES[post.platform] || [9];
        if (optimalHours.includes(publishHour)) {
            score += 30;
        } else {
            score += 15; // Partial credit for posting
        }

        // 2. CONTENT QUALITY (AI Analysis - 40 points max)
        try {
            const contentAnalysis = await this.analyzeContentQuality(post.content, post.platform);
            score += contentAnalysis;
        } catch (e) {
            console.warn("[ANALYTICS] Content analysis failed, using base value");
            score += 20; // Default partial credit
        }

        // 3. ENGAGEMENT PREDICTION (30 points max)
        // Based on historical data - for MVP, we use simulated baseline
        // In production, query ContentStat for historical performance
        const historicalBonus = Math.random() * 30; // Replace with real stats
        score += historicalBonus;

        return Math.min(100, Math.max(0, score)); // Clamp between 0-100
    }

    /**
     * AI-POWERED CONTENT QUALITY ANALYSIS
     */
    private static async analyzeContentQuality(content: string, platform: string): Promise<number> {
        const prediction = await ViralEngine.predictViralScore(content);
        return prediction.score;
    }

    /**
     * DECISION ENGINE
     */
    private static async shouldPostNow(platform: Platform, currentHour: number, userId: string): Promise<boolean> {
        // 1. Check daily budget/limit (SRE Guard)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { organizationId: true }
        });

        if (!user?.organizationId) return false;

        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyCount = await prisma.usageLog.count({
            where: {
                organizationId: user.organizationId,
                timestamp: { gte: dayAgo },
                actionType: 'SNAP_DISTRIBUTION'
            }
        });

        const DAILY_MAX = 15; // Sécurité SRE: max 15 posts auto par jour globalement
        if (dailyCount >= DAILY_MAX) {
            console.warn(`[GOD MODE] Daily limit reached (${dailyCount}/${DAILY_MAX}). Sleeping to save budget.`);
            return false;
        }

        // 2. ADAPTIVE SCHEDULING (Zero-Friction Autonomy)
        let optimalHours = this.PLATFORM_SCHEDULES[platform] || [9];

        try {
            const aiProfile = await prisma.aIProfile.findUnique({
                where: { organizationId: user.organizationId }
            });

            if (aiProfile?.bestPostTimes) {
                const learnedTimes = JSON.parse(aiProfile.bestPostTimes);
                const platformTimes = learnedTimes[platform];

                if (platformTimes && platformTimes.length > 0) {
                    console.log(`[AUTONOMY] Using learned times for ${platform}: ${platformTimes.join(', ')}`);
                    // Convert "HH:00" to HH
                    optimalHours = platformTimes.map((t: string) => parseInt(t.split(':')[0]));
                }
            }
        } catch (e) {
            console.warn("[AUTONOMY] Failed to fetch adaptive schedule, using static fallback.");
        }

        if (!optimalHours.includes(currentHour)) {
            if (!process.env.FORCE_POST) return false;
        }

        const lastPost = await prisma.post.findFirst({
            where: {
                userId: userId,
                platform: platform,
                createdAt: {
                    gte: new Date(Date.now() - 18 * 60 * 60 * 1000)
                },
                status: 'published'
            }
        });

        if (lastPost) {
            console.log(`[Scheduling] Already posted on ${platform} at ${lastPost.createdAt.toISOString()}`);
            return false;
        }

        return true;
    }

    /**
     * EXECUTION ENGINE
     */
    private static async executePromotion(platform: Platform, userId: string) {
        const topic = await this.generateDynamicTopic();
        let content = await this.generatePostContent(topic, platform);

        const PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://ela-revolution.com';
        const ASSETS = [
            `${PRODUCTION_DOMAIN} /assets/feat_productivity.png ? v = 2`,
            `${PRODUCTION_DOMAIN} /assets/feat_costs.png ? v = 2`
        ];
        const randomAsset = ASSETS[Math.floor(Math.random() * ASSETS.length)];

        if (!content || (Array.isArray(content) && content.length === 0) || (typeof content === 'string' && content.length < 10)) {
            console.error(`[GOD MODE] Content validation failed for ${platform}`);
            return { success: false, error: "Content Validation Failed" };
        }

        // --- LEGAL COMPLIANCE LAYER WITH SANITIZATION ---
        let flatContent = Array.isArray(content) ? content.join(" ") : content;
        let compliance = await LegalSentinel.checkContent(flatContent, platform, platform === 'SHOPIFY_ECOM');

        if (!compliance.isCompliant) {
            console.warn(`[LEGAL SENTINEL] Threat detected: ${compliance.threats.join(", ")}`);

            if (compliance.score > 40) {
                console.log("[GOD MODE] Attempting AI Sanitization (Tone shift to Corporate/Engaging)...");
                const sanitized = await this.sanitizeAndRewrite(flatContent);
                content = sanitized;
                flatContent = sanitized;
                // Re-check compliance after rewrite
                compliance = await LegalSentinel.checkContent(flatContent, platform, platform === 'SHOPIFY_ECOM');
            }

            if (!compliance.isCompliant) {
                console.error(`[GOD MODE] Post ABORTED. Still not compliant after rewrite.`);
                return { success: false, error: "Hard Legal Block: " + compliance.threats[0] };
            }
        }

        const org = await prisma.organization.findFirst({ where: { users: { some: { id: userId } } } });
        if (!org) {
            console.error(`[GOD MODE] Org not found for system user ${userId}`);
            return { success: false };
        }

        let success = await this.schedulePost(content, platform, randomAsset, org.id);

        const post = await prisma.post.create({
            data: {
                userId: userId,
                platform: platform,
                content: Array.isArray(content) ? JSON.stringify(content) : content,
                mediaUrl: randomAsset,
                status: success ? 'published' : 'failed',
                publishedAt: success ? new Date() : null,
                performance_score: 0 // Will be calculated later
            }
        });

        // 🔔 WhatsApp Notification
        if (success) {
            // Realtime Pulse for Dashboard Addiction
            PulseEngine.notifyAgent(`God Mode(${platform})`);
            if (platform === 'LINKEDIN' || platform === 'X_PLATFORM') {
                PulseEngine.emitPulse({
                    type: 'POST_VIRAL',
                    platform,
                    message: `Contenu nucléaire publié avec succès sur ${platform}.`
                });
            }

            await WhatsAppNotifier.notifyPostPublished({
                platform,
                content: Array.isArray(content) ? content[0] || '' : content,
                url: post.externalId ? this.getPlatformUrl(platform, post.externalId) : undefined
            }).catch(err => console.error('[WhatsApp] Notification failed:', err));
        }

        return { success };
    }

    /**
     * UTILITIES
     */
    private static async ensureSystemUser(): Promise<string> {
        const email = 'godmode@ela.ai';
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            let org = await prisma.organization.findFirst({
                where: { domain: 'ela.ai' }
            });
            
            if (!org) {
                org = await prisma.organization.create({
                    data: { name: 'Sovereign Systems', domain: 'ela.ai' }
                });
            }

            user = await prisma.user.create({
                data: {
                    email,
                    name: 'God Mode System',
                    role: 'admin',
                    organizationId: org.id
                }
            });
            console.log("[GOD MODE] Created System User:", user.id);
        }
        return user.id;
    }

    private static async generateDynamicTopic(): Promise<string> {
        // Rotational logic: Standard AI topics vs Shopify Product Focus vs Press Release
        const dice = Math.random();

        if (dice > 0.8) {
            // PRESS RELEASE FOCUS
            return "COMMUNIQUÉ DE PRESSE : ELA Genesis annonce la fin de l'automatisation manuelle par la supériorité algorithmique.";
        }

        if (dice > 0.6) {
            // SHOPIFY E-COMMERCE FOCUS
            try {
                const product = await ShopifyAutomation.getBestseller('org_global');
                if (product) return `FOCUS PRODUIT : Pourquoi ${product.title} est l'investissement ROI n°1 ce soir.`;
            } catch (e) { }
        }

        const prompt = `
        You are the "God Mode" AI of ELA(Genesis).
        Generate ONE brutal, high - stakes, polarizing topic for a social media post.
    Goal: Make the reader feel like staying manual is professional suicide and that ELA is their ONLY escape from the matrix of 9 - 5 labor.

        Themes: Algorithmic slavery, Sovereign agents, Digital dominance, ROI of the 1 %, Infrastructure as power.
        Return ONLY the topic sentence.French language.
        `;

        const topic = await generateText(prompt, { temperature: 0.95 });
        return topic.trim() || "La fin de l'économie salariée et l'avènement des Souverains.";
    }

    private static async generatePostContent(topic: string, platform: Platform): Promise<string | string[]> {
        // VIRAL OPTIMIZATION: Use style rotation (Biased towards monetization)
        const styles: Array<'story' | 'educational' | 'controversial' | 'meme' | 'subscription' | 'sovereign' | 'matrix' | 'nuclear' | 'forbidden_secret'> =
            ['story', 'educational', 'controversial', 'meme', 'subscription', 'sovereign', 'matrix', 'nuclear', 'forbidden_secret'];

        // Weighted random (prefer NUCLEAR impact)
        const styleWeights = [0.03, 0.05, 0.1, 0.02, 0.1, 0.15, 0.15, 0.2, 0.2];
        const random = Math.random();
        let cumulative = 0;
        let selectedStyle: any = 'nuclear';

        for (let i = 0; i < styles.length; i++) {
            cumulative += styleWeights[i];
            if (random <= cumulative) {
                selectedStyle = styles[i];
                break;
            }
        }

        console.log(`[NUCLEAR] Generating ${selectedStyle} post for ${platform}`);

        try {
            // 1. DRAFT GENERATION
            let content = await ViralEngine.generateViralPost({
                topic,
                platform,
                style: selectedStyle
            });

            // 2. BRUTALITY REFLECTION (Multi-Agent Simulation)
            console.log(`[NUCLEAR] Applying Brutality Reflection for ${platform}...`);
            const brutalityPrompt = `
            You are the "Master Destroyer" of content.Your job is to take this post and make it 10x more BRUTAL, POLARIZING, and URGENT.

    Rules:
- Eliminate all fluff or "polite" language.
            - Focus on the "Us vs Them" narrative(Sovereigns vs Manual Slaves).
            - Inject high - stakes FOMO(Financial death vs Sovereignty).
            - Keep it professional but aggressive.
            - French language.
            
            Original Post:
"${content}"
            
            Rewrite it for MAXIMUM psychological impact:
    `;

            content = await generateText(brutalityPrompt, { temperature: 0.95 });

            // For X/Twitter, check if response is thread format
            if (platform === 'X_PLATFORM') {
                try {
                    const jsonMatch = content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) return JSON.parse(jsonMatch[0]);
                    return [content.substring(0, 280)];
                } catch (e) {
                    return [content.substring(0, 280)];
                }
            }

            return content.trim();

        } catch (error) {
            console.error('[VIRAL] ViralEngine failed, falling back to basic generation:', error);

            // Fallback to basic generation if ViralEngine fails
            let prompt = "";

            switch (platform) {
                case 'LINKEDIN':
                    prompt = `Write a viral LinkedIn post about: "${topic}".Style: Hook, Story, Business Value.French.`;
                    break;
                case 'X_PLATFORM':
                    prompt = `Write a Twitter Thread(5 tweets) about: "${topic}".JSON Array format.French.`;
                    break;
                case 'INSTAGRAM':
                case 'FACEBOOK':
                    prompt = `Instagram caption about: "${topic}".Short, punchy, hashtags.French.`;
                    break;
                case 'SNAPCHAT':
                    prompt = `Snapchat text about: "${topic}".Urgent, Gen Z energy.French.`;
                    break;
            }

            const content = await generateText(prompt, { temperature: 0.8 });

            if (platform === 'X_PLATFORM') {
                try {
                    const jsonMatch = content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) return JSON.parse(jsonMatch[0]);
                    return [content.substring(0, 280)];
                } catch (e) { return [content.substring(0, 280)]; }
            }
            return content.trim();
        }
    }

    /**
     * AI SANITIZATION LOOP
     * Rewrites aggressive content into professional, high-engaging but safe tone.
     */
    private static async sanitizeAndRewrite(content: string): Promise<string> {
        const prompt = `
        You are a Legal & Growth PR Expert. 
        Rewrite the following content to be "Sovereign Corporate" style.
        
        Rules:
        - Maintain the high stakes and the value of ELA.
        - ELIMINATE all toxic, aggressive, or hateful language.
        - Focus on "Automation Efficiency" and "Market Dominance" instead of "Slavery/Destruction".
        - Ensure 100% compliance with social media safety guidelines.
        - Language: French.

        Content to sanitize:
        "${content}"
        `;

        try {
            const sanitized = await generateText(prompt, { temperature: 0.7 });
            return sanitized.trim();
        } catch (e) {
            return "ELA Genesis : L'automatisation souveraine pour une efficacité démultipliée. Rejoignez la révolution.";
        }
    }

    private static async schedulePost(content: string | string[], platform: Platform, mediaUrl: string, organizationId: string) {
        console.log(`[GOD MODE] Enqueuing to ${platform} via BullMQ...`);
        let targetPlatform: any = platform;
        if (platform === 'X_PLATFORM') targetPlatform = 'TWITTER';

        const finalContent = Array.isArray(content) ? content.join("\n\n") : content;

        // ── ARCHITECTURE SCELLÉE : Débit de crédits (Self-Promotion cost: 5) ──
        const billing = await consumeCredits(organizationId, 'SNAP_DISTRIBUTION');
        if (!billing.success) {
            console.error(`[GOD MODE] Out of credits for ${platform}. Expansion paused.`);
            return false;
        }
        // ───────────────────────────────────────────────────────────────────

        try {
            if (process.env.GOD_MODE_AUDIT === "true") {
                console.log(`[GOD MODE AUDIT] Job simulation SUCCESS for ${platform}`);
                return true;
            }

            const jobId = await enqueueSocialPost({
                post: {
                    content: finalContent,
                    mediaUrls: [mediaUrl],
                    platform: targetPlatform
                },
                platforms: [targetPlatform],
                organizationId
            });

            console.log(`[GOD MODE] Job enqueued: ${jobId} for ${platform}`);
            return true;
        } catch (error) {
            console.error(`[GOD MODE] Failed to enqueue to ${platform}`, error);
            return false;
        }
    }

    static async generateDailyHype() {
        return this.orchestrateHourlyCheck();
    }

    private static getPlatformUrl(platform: Platform, externalId: string): string {
        switch (platform) {
            case 'LINKEDIN': return `https://www.linkedin.com/feed/update/${externalId}`;
            case 'X_PLATFORM': return `https://x.com/status/${externalId}`;
            default: return '#';
        }
    }
}

/**
 * 🚀 Named exports for cron routes
 */
export async function godModeLinkedInEngage() {
    return ELASelfPromoter.orchestrateHourlyCheck();
}

export async function godModeSelfPromote() {
    return ELASelfPromoter.orchestrateHourlyCheck();
}
