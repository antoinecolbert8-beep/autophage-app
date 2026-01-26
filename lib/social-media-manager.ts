/**
 * 📱 Social Media Manager - Publication multi-plateforme
 * Délégué entièrement à Make.com via Conductor Pattern
 */

import { triggerAutomation } from "./automations";

export type SocialPost = {
  platform: "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "YOUTUBE_SHORT" | "LINKEDIN" | "TWITTER" | "SNAPCHAT";
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  scheduledFor?: Date;
};

export type PostResult = {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
};

/**
 * Publication générique via Make.com
 */
async function publishViaMake(post: SocialPost): Promise<PostResult> {
  const result = await triggerAutomation("PUBLISH_SOCIAL_POST", {
    platform: post.platform,
    content: post.content,
    mediaUrls: post.mediaUrls,
    hashtags: post.hashtags,
    scheduledFor: post.scheduledFor
  });

  if (result.success) {
    return {
      success: true,
      postId: result.data?.postId || "pending_make_execution",
      url: result.data?.url
    };
  }

  return {
    success: false,
    error: result.message
  };
}

/**
 * Publication sur Instagram
 */
export async function publishToInstagram(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "INSTAGRAM" });
}

/**
 * Publication sur Facebook
 */
export async function publishToFacebook(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "FACEBOOK" });
}

/**
 * Publication sur TikTok
 */
export async function publishToTikTok(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "TIKTOK" });
}

/**
 * Publication sur YouTube Shorts
 */
export async function publishToYouTubeShort(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "YOUTUBE_SHORT" });
}

/**
 * Publication sur LinkedIn
 */
export async function publishToLinkedIn(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "LINKEDIN" });
}

/**
 * Publication sur X / Twitter
 */
export async function publishToTwitter(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "TWITTER" });
}

/**
 * Publication sur Snapchat
 */
export async function publishToSnapchat(post: SocialPost): Promise<PostResult> {
  return publishViaMake({ ...post, platform: "SNAPCHAT" });
}

/**
 * Publication multi-plateforme (automatique)
 */
export async function publishToMultiplePlatforms(
  post: SocialPost,
  platforms: SocialPost["platform"][]
): Promise<Record<string, PostResult>> {
  const results: Record<string, PostResult> = {};

  // On peut soit déclencher un Webhook par plateforme, soit un gros Webhook "MULTI_POST"
  // Ici on garde la boucle pour compatibilité existante, mais chaque appel part vers Make.

  for (const platform of platforms) {
    console.log(`[SocialManager] Delegating publishing to ${platform} via Make...`);
    results[platform] = await publishViaMake({ ...post, platform });
  }

  return results;
}





