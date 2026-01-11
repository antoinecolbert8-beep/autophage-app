import { PrismaClient } from "@prisma/client";
import { publishToMultiplePlatforms, SocialPost } from "../social-media-manager";

const prisma = new PrismaClient();

export class PublisherWorker {
    /**
     * Scan for posts scheduled in the past that aren't published yet
     */
    async processScheduledPosts() {
        console.log("📨 [Publisher] Scanning for scheduled posts...");

        const now = new Date();

        // 1. Find pending posts
        const pendingPosts = await prisma.post.findMany({
            where: {
                status: "SCHEDULED",
                scheduledAt: {
                    lte: now,
                },
            },
            include: {
                user: {
                    include: {
                        organization: {
                            include: {
                                integrations: true
                            }
                        }
                    }
                }
            },
        });

        if (pendingPosts.length === 0) {
            console.log("📨 [Publisher] No pending posts found.");
            return;
        }

        console.log(`📨 [Publisher] Found ${pendingPosts.length} posts to publish.`);

        for (const post of pendingPosts) {
            await this.publishPost(post);
        }
    }

    private async publishPost(post: any) {
        console.log(`🚀 [Publisher] Publishing post ${post.id} to ${post.platform}`);

        // Check credentials via Organization Integrations
        const integrations = post.user.organization.integrations;
        const platform = post.platform.toUpperCase(); // FACEBOOK, LINKEDIN, etc.

        // Simple mapping logic - in prod, match robustly
        const integration = integrations.find((i: any) =>
            i.provider.toUpperCase().includes(platform) ||
            (platform === 'LINKEDIN' && i.provider === 'linkedin') ||
            (platform === 'TWITTER' && i.provider === 'twitter') ||
            (platform === 'FACEBOOK' && i.provider === 'facebook')
        );

        // If no integration found but generic environment variables exist, we might try global fallback
        // But for "Souveraineté", we prefer user content. 
        // For now, we proceed to call the manager. social-media-manager might use ENV as fallback.

        try {
            const socialPost: SocialPost = {
                platform: post.platform.toUpperCase() as any, // Cast to type
                content: post.content,
                mediaUrls: post.mediaUrl ? [post.mediaUrl] : undefined,
            };

            // Execute via the manager
            const results = await publishToMultiplePlatforms(socialPost, [socialPost.platform]);

            const result = results[socialPost.platform];

            if (result && result.success) {
                console.log(`✅ [Publisher] Success: ${result.url}`);
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        status: "PUBLISHED",
                        publishedAt: new Date(),
                        externalId: result.postId
                    }
                });
            } else {
                console.error(`❌ [Publisher] Failed: ${result?.error}`);
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        status: "FAILED",
                    }
                });
            }

        } catch (error) {
            console.error(`❌ [Publisher] Critical Error on ${post.id}:`, error);
            await prisma.post.update({
                where: { id: post.id },
                data: { status: "FAILED" }
            });
        }
    }
}

export const publisherWorker = new PublisherWorker();
