import { generateText } from '@/lib/ai/vertex';
import { db as prisma } from "@/core/db";

/**
 * VIDEO CONTENT GENERATOR
 * Transforms text posts into video scripts for Reels/Shorts/TikTok
 */

export interface VideoScript {
    hook: string;
    scenes: Array<{
        duration: number; // seconds
        text: string;
        visualDescription: string;
        voiceover: string;
    }>;
    cta: string;
    totalDuration: number;
    music?: string;
}

export class VideoContentGenerator {

    /**
     * Generate video script from text post
     */
    static async generateVideoScript(textPost: string, platform: 'tiktok' | 'reels' | 'shorts'): Promise<VideoScript> {
        const maxDuration = platform === 'tiktok' ? 60 : platform === 'reels' ? 60 : 60;

        const prompt = `
        Transform this text post into a ${platform} video script:
        
        "${textPost}"
        
        Create a video script with:
        - Hook (first 3 seconds - must grab attention)
        - 3-5 scenes (each 8-15 seconds)
        - Each scene: text overlay + visual description + voiceover
        - CTA at end
        - Total: max ${maxDuration} seconds
        
        Format as JSON:
        {
            "hook": "text",
            "scenes": [
                {
                    "duration": 10,
                    "text": "text overlay",
                    "visualDescription": "what to show",
                    "voiceover": "what to say"
                }
            ],
            "cta": "call to action"
        }
        
        French language. Make it dynamic and viral.
        `;

        const response = await generateText(prompt, { temperature: 0.8 });

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found');

            const script = JSON.parse(jsonMatch[0]);

            const totalDuration = script.scenes.reduce((sum: number, scene: any) => sum + scene.duration, 0);

            return {
                ...script,
                totalDuration,
                music: this.suggestMusic(textPost)
            };
        } catch (error) {
            console.error('[Video] Failed to parse script:', error);
            throw error;
        }
    }

    /**
     * Suggest background music based on content
     */
    private static suggestMusic(content: string): string {
        const isMotivational = content.toLowerCase().includes('success') || content.toLowerCase().includes('growth');
        const isTech = content.toLowerCase().includes('ai') || content.toLowerCase().includes('tech');

        if (isMotivational) return 'upbeat_motivational.mp3';
        if (isTech) return 'electronic_upbeat.mp3';
        return 'corporate_inspiring.mp3';
    }

    /**
     * Auto-sync posts to video platforms
     */
    static async syncPostToVideo(postId: string): Promise<void> {
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) return;

        console.log(`[Video] Generating video script for post ${postId}...`);

        // Generate scripts for each platform
        const platforms: Array<'tiktok' | 'reels' | 'shorts'> = ['tiktok', 'reels', 'shorts'];

        for (const platform of platforms) {
            const script = await this.generateVideoScript(post.content, platform);

            // Save script for production
            console.log(`[Video] ${platform} script ready (${script.totalDuration}s)`);

            // In production, would send to video generation API (e.g., Pictory, Synthesia)
        }
    }

    /**
     * Generate voiceover using ElevenLabs
     */
    static async generateVoiceover(text: string): Promise<Buffer> {
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            console.warn('[Video] ElevenLabs API key missing');
            // Fallback to lib/elevenlabs-tts.ts if exists
            return Buffer.from('');
        }

        // Use existing ElevenLabs integration
        const { generateVoice } = await import('@/lib/elevenlabs-tts');

        try {
            const audio = await generateVoice(text, 'professional');
            return audio;
        } catch (error) {
            console.error('[Video] Voiceover generation failed:', error);
            return Buffer.from('');
        }
    }

    /**
     * Suggest B-roll footage
     */
    static suggestBRoll(visualDescription: string): string[] {
        // Stock footage keywords
        const keywords = this.extractKeywords(visualDescription);

        return keywords.map(kw => `https://stock-footage-api.com/search?q=${encodeURIComponent(kw)}`);
    }

    private static extractKeywords(text: string): string[] {
        // Simple extraction - in production would use NLP
        const words = text.toLowerCase().split(' ');
        const keywords = words.filter(w => w.length > 4);
        return keywords.slice(0, 3);
    }

    /**
     * Create video compilation from top posts
     */
    static async createWeeklyCompilation(): Promise<VideoScript> {
        const topPosts = await prisma.post.findMany({
            where: {
                publishedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                performance_score: {
                    gte: 75
                }
            },
            orderBy: {
                performance_score: 'desc'
            },
            take: 5
        });

        const compiledText = topPosts.map((p, idx) =>
            `#${idx + 1}: ${p.content.substring(0, 100)}...`
        ).join('\n\n');

        const prompt = `
        Create a "Top 5 Insights This Week" video script from:
        
        ${compiledText}
        
        Format: Fast-paced countdown (5 to 1)
        Each insight: 10 seconds
        Total: 60 seconds max
        
        Return JSON script format.
        `;

        const response = await generateText(prompt, { temperature: 0.7 });
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('No JSON found');

        const script = JSON.parse(jsonMatch[0]);
        const totalDuration = script.scenes.reduce((sum: number, scene: any) => sum + scene.duration, 0);

        return {
            ...script,
            totalDuration
        };
    }
}
