import { generateText } from '@/lib/ai/vertex';

/**
 * OFFENSIVE PULSE - Multi-Channel Distribution Engine
 * Generates platform-optimized content for maximum reach
 */

interface DistributionRequest {
    contentTitle: string;
    contentSummary: string;
    keyword: string;
    targetAudience?: string;
}

interface PlatformContent {
    platform: string;
    format: string;
    content: string;
    hashtags: string[];
    cta: string;
}

interface DistributionPlan {
    linkedin: PlatformContent;
    twitter: PlatformContent;
    instagram: PlatformContent;
    tiktok: PlatformContent;
    snapchat: PlatformContent;
}

/**
 * Generate optimized content for each platform
 */
export async function generateDistributionPlan(
    request: DistributionRequest
): Promise<DistributionPlan> {
    const prompt = `
You are a viral content strategist. Create platform-specific content for:

TOPIC: "${request.keyword}"
TITLE: "${request.contentTitle}"
SUMMARY: "${request.contentSummary}"
${request.targetAudience ? `TARGET AUDIENCE: ${request.targetAudience}` : ''}

Generate content for EACH platform in this exact JSON format:
{
  "linkedin": {
    "platform": "LinkedIn",
    "format": "Professional Post",
    "content": "Full post text (max 3000 chars, use line breaks)",
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "cta": "Call to action"
  },
  "twitter": {
    "platform": "X/Twitter",
    "format": "Thread Hook",
    "content": "First tweet of thread (max 280 chars)",
    "hashtags": ["#tag1", "#tag2"],
    "cta": "Thread continuation hook"
  },
  "instagram": {
    "platform": "Instagram",
    "format": "Carousel Caption",
    "content": "Caption for carousel post",
    "hashtags": ["up to 10 relevant hashtags"],
    "cta": "Bio link call to action"
  },
  "tiktok": {
    "platform": "TikTok",
    "format": "Video Script Hook",
    "content": "First 3 seconds hook + script outline",
    "hashtags": ["#fyp", "#viral", "topic tags"],
    "cta": "Comment engagement prompt"
  },
  "snapchat": {
    "platform": "Snapchat",
    "format": "Story Sequence",
    "content": "5 story slides summary (slide 1 | slide 2 | etc)",
    "hashtags": [],
    "cta": "Swipe up action"
  }
}

Make each version NATIVE to the platform. LinkedIn = professional, TikTok = casual/viral, etc.
Return ONLY valid JSON, no markdown.
`;

    const result = await generateText(prompt, { temperature: 0.8 });

    try {
        return JSON.parse(result);
    } catch (error) {
        console.error('Failed to parse distribution plan:', error);
        return getDefaultPlan(request);
    }
}

function getDefaultPlan(request: DistributionRequest): DistributionPlan {
    return {
        linkedin: {
            platform: 'LinkedIn',
            format: 'Professional Post',
            content: `New insights on ${request.keyword}:\n\n${request.contentSummary}\n\nRead the full analysis →`,
            hashtags: ['#business', '#strategy', `#${request.keyword.replace(/\s+/g, '')}`],
            cta: 'Link in comments',
        },
        twitter: {
            platform: 'X/Twitter',
            format: 'Thread Hook',
            content: `The truth about ${request.keyword} that nobody talks about 🧵`,
            hashtags: [`#${request.keyword.replace(/\s+/g, '')}`, '#thread'],
            cta: 'Read on 👇',
        },
        instagram: {
            platform: 'Instagram',
            format: 'Carousel Caption',
            content: `Swipe to learn about ${request.keyword} 📊`,
            hashtags: ['#marketing', '#business', '#strategy', '#tips', '#growth'],
            cta: 'Link in bio for full guide',
        },
        tiktok: {
            platform: 'TikTok',
            format: 'Video Script Hook',
            content: `POV: You finally understand ${request.keyword}...`,
            hashtags: ['#fyp', '#business', '#learnontiktok'],
            cta: 'Comment "GUIDE" for the full breakdown',
        },
        snapchat: {
            platform: 'Snapchat',
            format: 'Story Sequence',
            content: `SLIDE 1: Hook | SLIDE 2: Problem | SLIDE 3: Solution | SLIDE 4: Proof | SLIDE 5: CTA`,
            hashtags: [],
            cta: 'Swipe up to learn more',
        },
    };
}

/**
 * Generate personalized outreach messages (ethical version)
 */
export async function generateOutreachMessages(
    leadName: string,
    leadCompany: string,
    contentTopic: string
): Promise<string[]> {
    const prompt = `
Write 3 personalized, NON-SPAMMY outreach messages for:

Person: ${leadName} at ${leadCompany}
Topic: ${contentTopic}

Rules:
- Be genuine and helpful, not pushy
- Offer value before asking anything
- Keep it brief (under 100 words each)
- Different tone for each (casual, professional, curious)

Return as JSON array of strings.
`;

    const result = await generateText(prompt, { temperature: 0.7 });

    try {
        return JSON.parse(result);
    } catch {
        return [
            `Hi ${leadName}, I wrote something about ${contentTopic} that I think could be valuable for ${leadCompany}. Would you be interested in taking a look?`,
        ];
    }
}

/**
 * Schedule distribution (stub for external API integration)
 */
export async function scheduleDistribution(
    plan: DistributionPlan,
    publishTime?: Date
): Promise<{ scheduled: boolean; platforms: string[] }> {
    const scheduled = Object.keys(plan);

    // In production, this would call actual social APIs:
    // - LinkedIn API
    // - Twitter API
    // - Instagram Graph API
    // - TikTok Marketing API
    // - Snapchat Marketing API

    console.log(`📤 Distribution scheduled for ${scheduled.length} platforms`);

    return {
        scheduled: true,
        platforms: scheduled,
    };
}
