/**
 * 📱 Social Media Manager - Publication multi-plateforme
 * Supporte Instagram, Facebook, TikTok, YouTube Shorts
 */

export type SocialPost = {
  platform: "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "YOUTUBE_SHORT";
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
 * Publication sur Instagram (Graph API)
 */
export async function publishToInstagram(post: SocialPost): Promise<PostResult> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igAccountId = process.env.META_INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !igAccountId) {
    return { success: false, error: "META_INSTAGRAM_ACCOUNT_ID ou TOKEN manquant" };
  }

  try {
    const caption = `${post.content}\n\n${post.hashtags?.join(" ") || ""}`;

    // Étape 1 : Créer le container média
    const mediaUrl = post.mediaUrls?.[0];
    if (!mediaUrl) {
      return { success: false, error: "URL média requise pour Instagram" };
    }

    const createContainerUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media`;
    const containerResponse = await fetch(createContainerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: mediaUrl,
        caption,
        access_token: accessToken,
      }),
    });

    const containerData = await containerResponse.json();
    if (!containerData.id) {
      return { success: false, error: containerData.error?.message || "Erreur création container" };
    }

    // Étape 2 : Publier le container
    const publishUrl = `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    });

    const publishData = await publishResponse.json();

    if (publishData.id) {
      return {
        success: true,
        postId: publishData.id,
        url: `https://www.instagram.com/p/${publishData.id}`,
      };
    }

    return { success: false, error: publishData.error?.message || "Erreur publication" };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Publication sur Facebook (Graph API)
 */
export async function publishToFacebook(post: SocialPost): Promise<PostResult> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;

  if (!accessToken || !pageId) {
    return { success: false, error: "META_PAGE_ID ou TOKEN manquant" };
  }

  try {
    const message = `${post.content}\n\n${post.hashtags?.join(" ") || ""}`;

    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    const body: any = {
      message,
      access_token: accessToken,
    };

    // Si média fourni
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      body.link = post.mediaUrls[0];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.id) {
      return {
        success: true,
        postId: data.id,
        url: `https://www.facebook.com/${data.id}`,
      };
    }

    return { success: false, error: data.error?.message || "Erreur publication" };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Publication sur TikTok (TikTok API)
 */
export async function publishToTikTok(post: SocialPost): Promise<PostResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return { success: false, error: "TIKTOK_ACCESS_TOKEN manquant" };
  }

  try {
    // TikTok nécessite upload vidéo en 2 étapes
    const videoUrl = post.mediaUrls?.[0];
    if (!videoUrl) {
      return { success: false, error: "URL vidéo requise pour TikTok" };
    }

    // Étape 1 : Init upload
    const initUrl = "https://open.tiktokapis.com/v2/post/publish/video/init/";
    const initResponse = await fetch(initUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: {
          title: post.content.slice(0, 150),
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: "FILE_UPLOAD",
          video_url: videoUrl,
        },
      }),
    });

    const initData = await initResponse.json();

    if (initData.data?.publish_id) {
      return {
        success: true,
        postId: initData.data.publish_id,
        url: `https://www.tiktok.com/@user/video/${initData.data.publish_id}`,
      };
    }

    return { success: false, error: initData.error?.message || "Erreur publication TikTok" };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Publication sur YouTube Shorts (YouTube Data API)
 */
export async function publishToYouTubeShort(post: SocialPost): Promise<PostResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return { success: false, error: "YOUTUBE_API_KEY manquante" };
  }

  try {
    // YouTube Shorts nécessite OAuth2 + upload vidéo
    // Implémentation simplifiée - nécessite un flow OAuth complet en production

    const videoUrl = post.mediaUrls?.[0];
    if (!videoUrl) {
      return { success: false, error: "URL vidéo requise pour YouTube Shorts" };
    }

    // Note: En production, utiliser google-auth-library pour OAuth2
    return {
      success: false,
      error: "YouTube Shorts nécessite OAuth2 - À configurer manuellement",
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Publication multi-plateforme (automatique)
 */
export async function publishToMultiplePlatforms(
  post: SocialPost,
  platforms: SocialPost["platform"][]
): Promise<Record<string, PostResult>> {
  const results: Record<string, PostResult> = {};

  const publishers: Record<SocialPost["platform"], (p: SocialPost) => Promise<PostResult>> = {
    INSTAGRAM: publishToInstagram,
    FACEBOOK: publishToFacebook,
    TIKTOK: publishToTikTok,
    YOUTUBE_SHORT: publishToYouTubeShort,
  };

  for (const platform of platforms) {
    const publisher = publishers[platform];
    if (publisher) {
      results[platform] = await publisher({ ...post, platform });
    }
  }

  return results;
}





