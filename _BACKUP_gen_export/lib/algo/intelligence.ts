import { generateText } from '@/lib/ai/vertex';
import { prisma } from '@/lib/prisma';

/**
 * ALGORITHM INTELLIGENCE ENGINE
 * Predicts optimal timing and amplifies successful content cross-platform
 */

interface EngagementPattern {
    hour: number;
    dayOfWeek: number;
    engagementScore: number;
    platform: string;
}

interface OptimalTiming {
    platform: string;
    optimalHour: number;
    optimalDay: string;
    confidence: number;
    adjustmentMinutes: number;
}

// Days mapping
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * CHRONO-PREDICTIVE ENGINE
 * Analyzes historical engagement to predict optimal posting times
 */
export async function predictOptimalTiming(
    organizationId: string,
    platform: string
): Promise<OptimalTiming> {
    // Get historical touchpoint data
    const touchpoints = await prisma.touchpoint.findMany({
        where: {
            channel: platform,
            lead: {
                organizationId,
            },
            clicked: true, // Focus on successful engagements
        },
        select: {
            createdAt: true,
            opened: true,
            clicked: true,
        },
        take: 500,
    });

    // Analyze patterns
    const patterns: EngagementPattern[] = [];

    for (const tp of touchpoints) {
        const date = new Date(tp.createdAt);
        patterns.push({
            hour: date.getHours(),
            dayOfWeek: date.getDay(),
            engagementScore: tp.clicked ? 2 : tp.opened ? 1 : 0,
            platform,
        });
    }

    // Find optimal time slots
    const hourScores: Record<number, number> = {};
    const dayScores: Record<number, number> = {};

    for (const p of patterns) {
        hourScores[p.hour] = (hourScores[p.hour] || 0) + p.engagementScore;
        dayScores[p.dayOfWeek] = (dayScores[p.dayOfWeek] || 0) + p.engagementScore;
    }

    // Get best hour and day
    const optimalHour = Object.entries(hourScores)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || '10';

    const optimalDayNum = Object.entries(dayScores)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || '2';

    // Calculate confidence based on data volume
    const confidence = Math.min(patterns.length / 100, 1) * 100;

    // Calculate adjustment (+/- 15 min based on AI prediction)
    const adjustmentMinutes = await predictMicroAdjustment(platform, parseInt(optimalHour));

    return {
        platform,
        optimalHour: parseInt(optimalHour),
        optimalDay: DAYS[parseInt(optimalDayNum)],
        confidence,
        adjustmentMinutes,
    };
}

/**
 * AI-based micro-adjustment for timing (+/- 15 min)
 */
async function predictMicroAdjustment(platform: string, hour: number): Promise<number> {
    const prompt = `
You are analyzing social media algorithm patterns for ${platform}.

Given a target posting hour of ${hour}:00, predict the optimal micro-adjustment in minutes.

Consider:
- Algorithm refresh cycles (usually every 15-30 min)
- User check-in patterns (before/after work, lunch breaks)
- Competition timing (avoid :00 and :30 when everyone posts)

Return ONLY a JSON object:
{"adjustment": <number between -15 and 15>, "reason": "brief reason"}
`;

    try {
        const result = await generateText(prompt, { temperature: 0.3 });
        const parsed = JSON.parse(result);
        return parsed.adjustment || 0;
    } catch {
        // Default: post 7 min before the hour to beat competition
        return -7;
    }
}

/**
 * CROSS-PLATFORM AMPLIFICATION
 * When content succeeds on one platform, adapt and spread to others
 */
export async function amplifySuccessfulContent(
    contentId: string,
    sourcePlatform: string,
    engagementRate: number
): Promise<{ triggered: boolean; targetPlatforms: string[] }> {
    // Threshold for "success" - engagement rate above 5%
    const SUCCESS_THRESHOLD = 0.05;

    if (engagementRate < SUCCESS_THRESHOLD) {
        return { triggered: false, targetPlatforms: [] };
    }

    console.log(`🚀 Content ${contentId} succeeded on ${sourcePlatform} (${(engagementRate * 100).toFixed(1)}%)`);

    // Get original content
    const content = await prisma.contentAsset.findUnique({
        where: { id: contentId },
    });

    if (!content) return { triggered: false, targetPlatforms: [] };

    // Determine target platforms
    const allPlatforms = ['linkedin', 'twitter', 'instagram', 'tiktok', 'snapchat'];
    const targetPlatforms = allPlatforms.filter(p => p !== sourcePlatform);

    // Generate adapted versions
    for (const platform of targetPlatforms) {
        const adaptedContent = await adaptContentForPlatform(
            content.title,
            content.content.slice(0, 500),
            sourcePlatform,
            platform
        );

        // Schedule for optimal time
        const timing = await predictOptimalTiming(content.projectId, platform);

        // Create distribution task
        await prisma.aIActionLog.create({
            data: {
                actionType: 'cross_platform_amplification',
                entityType: 'content',
                entityId: contentId,
                status: 'pending',
                decisionReasoning: JSON.stringify({
                    sourcePlatform,
                    targetPlatform: platform,
                    engagementRate,
                    adaptedContent,
                    scheduledHour: timing.optimalHour,
                    adjustmentMinutes: timing.adjustmentMinutes,
                }),
            },
        });
    }

    console.log(`📤 Amplification scheduled for ${targetPlatforms.length} platforms`);

    return { triggered: true, targetPlatforms };
}

/**
 * Adapt content for specific platform
 */
async function adaptContentForPlatform(
    title: string,
    summary: string,
    sourcePlatform: string,
    targetPlatform: string
): Promise<string> {
    const platformStyles: Record<string, string> = {
        linkedin: 'Professional, thought-leadership, use line breaks, end with question',
        twitter: 'Punchy thread hook, max 280 chars, use emojis sparingly',
        instagram: 'Visual-first caption, storytelling, use emojis, hashtags at end',
        tiktok: 'Casual hook "POV:" or "Things nobody tells you about...", trendy',
        snapchat: 'Ultra-short, urgent, FOMO-inducing, swipe-up ready',
    };

    const prompt = `
Adapt this content from ${sourcePlatform} to ${targetPlatform}:

ORIGINAL TITLE: ${title}
SUMMARY: ${summary}

TARGET STYLE: ${platformStyles[targetPlatform]}

Return ONLY the adapted post text, no explanation.
`;

    return await generateText(prompt, { temperature: 0.7 });
}

/**
 * ENGAGEMENT MONITORING
 * Track real-time engagement and trigger amplification
 */
export async function monitorAndAmplify(contentId: string, platform: string) {
    // Simulate fetching engagement metrics (in production: use platform APIs)
    const metrics = await getEngagementMetrics(contentId, platform);

    if (metrics.engagementRate > 0.05) {
        await amplifySuccessfulContent(contentId, platform, metrics.engagementRate);
    }

    return metrics;
}

async function getEngagementMetrics(contentId: string, platform: string) {
    // In production, this would call LinkedIn/Twitter/etc APIs
    // For now, return simulated data
    return {
        impressions: Math.floor(Math.random() * 10000),
        engagements: Math.floor(Math.random() * 500),
        engagementRate: Math.random() * 0.1, // 0-10%
        platform,
    };
}

/**
 * ALGORITHM LEARNING REPORT
 * Summary of learned patterns for dashboard
 */
export async function generateAlgorithmReport(organizationId: string) {
    const platforms = ['linkedin', 'twitter', 'instagram', 'tiktok', 'snapchat'];

    const timingData = await Promise.all(
        platforms.map(p => predictOptimalTiming(organizationId, p))
    );

    const amplifications = await prisma.aIActionLog.count({
        where: {
            actionType: 'cross_platform_amplification',
            status: 'completed',
        },
    });

    return {
        optimalTimings: timingData,
        totalAmplifications: amplifications,
        topPerformingPlatform: timingData.sort((a, b) => b.confidence - a.confidence)[0]?.platform || 'linkedin',
        recommendation: 'Focus on high-confidence platforms during optimal windows',
    };
}
