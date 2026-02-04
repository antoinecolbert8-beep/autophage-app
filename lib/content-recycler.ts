import { PrismaClient } from '@prisma/client';
import { generateText } from '@/lib/ai/vertex';

const prisma = new PrismaClient();

/**
 * CONTENT RECYCLING SYSTEM
 * Repurposes top-performing content with new angles
 */

export class ContentRecycler {

    /**
     * Get top performing posts for recycling
     */
    static async getTopPosts(minScore: number = 70, minAge: number = 30): Promise<any[]> {
        const cutoffDate = new Date(Date.now() - minAge * 24 * 60 * 60 * 1000);

        const topPosts = await prisma.post.findMany({
            where: {
                status: 'published',
                performance_score: {
                    gte: minScore
                },
                publishedAt: {
                    lte: cutoffDate // At least X days old
                }
            },
            orderBy: {
                performance_score: 'desc'
            },
            take: 20
        });

        console.log(`[Recycler] Found ${topPosts.length} high-performing posts for recycling`);
        return topPosts;
    }

    /**
     * Recycle post with new angle
     */
    static async recyclePost(originalPost: any, newAngle: 'update' | 'different_platform' | 'thread' | 'case_study'): Promise<string> {
        const originalContent = originalPost.content;

        let prompt = '';

        switch (newAngle) {
            case 'update':
                prompt = `
                This is a high-performing post from ${new Date(originalPost.publishedAt).toLocaleDateString()}:
                
                "${originalContent}"
                
                Rewrite this with a fresh angle for 2026. Add:
                - "Update:" prefix
                - New stats or insights
                - What changed since original
                - Same core message but fresh hook
                - French language
                `;
                break;

            case 'different_platform':
                const targetPlatform = originalPost.platform === 'LINKEDIN' ? 'X_PLATFORM' : 'LINKEDIN';
                prompt = `
                Adapt this ${originalPost.platform} post for ${targetPlatform}:
                
                "${originalContent}"
                
                Adjust:
                - Tone and format for ${targetPlatform}
                - Length appropriate for platform
                - Keep core value
                - French language
                `;
                break;

            case 'thread':
                prompt = `
                Expand this successful post into a 5-tweet thread:
                
                "${originalContent}"
                
                Thread structure:
                1. Hook (reference original)
                2-4. Deep dive with examples
                5. CTA
                
                Return as JSON array. French.
                `;
                break;

            case 'case_study':
                prompt = `
                Transform this post into a mini case study:
                
                "${originalContent}"
                
                Format:
                - Problem
                - Solution (reference original insight)
                - Results
                - Lesson
                
                French language, storytelling style.
                `;
                break;
        }

        const recycled = await generateText(prompt, { temperature: 0.75 });

        console.log(`[Recycler] Recycled post ${originalPost.id} as ${newAngle}`);
        return recycled.trim();
    }

    /**
     * Create recycling schedule
     */
    static async scheduleRecycling(): Promise<void> {
        const topPosts = await this.getTopPosts();

        for (const post of topPosts) {
            // Recycle in different ways
            const angles: Array<'update' | 'different_platform' | 'thread' | 'case_study'> =
                ['update', 'different_platform'];

            for (const angle of angles) {
                const recycled = await this.recyclePost(post, angle);

                // Save as draft for future posting
                await prisma.post.create({
                    data: {
                        userId: post.userId,
                        platform: angle === 'different_platform'
                            ? (post.platform === 'LINKEDIN' ? 'X_PLATFORM' : 'LINKEDIN')
                            : post.platform,
                        content: `[RECYCLED:${post.id}] ${recycled}`,
                        status: 'draft',
                        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Schedule for next week
                    }
                });
            }
        }

        console.log(`[Recycler] Created ${topPosts.length * 2} recycled posts`);
    }

    /**
     * Create "Best Of" compilation
     */
    static async createBestOfCompilation(timeframe: 'week' | 'month' | 'quarter'): Promise<string> {
        const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const topPosts = await prisma.post.findMany({
            where: {
                publishedAt: {
                    gte: cutoffDate
                },
                status: 'published',
                performance_score: {
                    gte: 75
                }
            },
            orderBy: {
                performance_score: 'desc'
            },
            take: 5
        });

        const prompt = `
        Create a "Best Insights This ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}" compilation post from these top performers:
        
        ${topPosts.map((p, idx) => `${idx + 1}. ${p.content.substring(0, 100)}...`).join('\n')}
        
        Format:
        - Hook: "Top ${topPosts.length} Insights de ${timeframe === 'week' ? 'la semaine' : timeframe === 'month' ? 'ce mois' : 'ce trimestre'}"
        - Bullet points with key takeaways
        - CTA to engage
        
        French language, LinkedIn format.
        `;

        const compilation = await generateText(prompt, { temperature: 0.7 });

        console.log(`[Recycler] Created Best Of compilation for ${timeframe}`);
        return compilation.trim();
    }

    /**
     * Identify evergreen content
     */
    static async identifyEvergreenPosts(): Promise<any[]> {
        // Evergreen = consistent performance over time
        const posts = await prisma.post.findMany({
            where: {
                status: 'published',
                publishedAt: {
                    lte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // At least 60 days old
                }
            },
            include: {
                // Would need stats relation
            }
        });

        // Filter posts with consistent engagement
        const evergreen = posts.filter(post => post.performance_score >= 60);

        console.log(`[Recycler] Found ${evergreen.length} evergreen posts`);
        return evergreen;
    }
}
