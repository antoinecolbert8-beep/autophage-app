/**
 * 💬 Social Engagement - Gestion DM, commentaires, interactions multi-plateforme
 */

import { getOpenAIClient } from "./ai/openai-client";
import { generateSmartResponse } from "./ai-brain";

export type SocialMessage = {
  id: string;
  platform: "INSTAGRAM" | "FACEBOOK" | "LINKEDIN" | "TIKTOK";
  type: "DM" | "COMMENT";
  from: string;
  content: string;
  timestamp: Date;
  postId?: string;
};

export type MessageResponse = {
  text: string;
  action: "REPLY" | "IGNORE" | "ESCALATE";
  confidence: number;
};

/**
 * Réponse automatique aux DM Instagram
 */
export async function replyToInstagramDM(
  messageId: string,
  response: string
): Promise<{ success: boolean; error?: string }> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igAccountId = process.env.META_INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !igAccountId) {
    return { success: false, error: "Configuration Meta manquante" };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/me/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: messageId },
        message: { text: response },
        access_token: accessToken,
      }),
    });

    const data = await res.json();
    return { success: !!data.message_id };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Réponse automatique aux commentaires
 */
export async function replyToComment(
  platform: SocialMessage["platform"],
  commentId: string,
  response: string
): Promise<{ success: boolean; error?: string }> {
  // Implémentation selon plateforme
  if (platform === "INSTAGRAM" || platform === "FACEBOOK") {
    return replyToMetaComment(commentId, response);
  }

  return { success: false, error: `Plateforme ${platform} non supportée` };
}

async function replyToMetaComment(
  commentId: string,
  response: string
): Promise<{ success: boolean; error?: string }> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

  try {
    const url = `https://graph.facebook.com/v18.0/${commentId}/replies`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: response,
        access_token: accessToken,
      }),
    });

    const data = await res.json();
    return { success: !!data.id };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Génère une réponse intelligente à un message social
 */
export async function generateSocialResponse(
  message: SocialMessage
): Promise<MessageResponse> {
  try {
    // Utilise le RAG brain pour réponse contextuelle
    const response = await generateSmartResponse(
      `Réponds à ce ${message.type} ${message.platform}: "${message.content}"`
    );

    return {
      text: response || "Merci pour ton message ! 🙏",
      action: "REPLY",
      confidence: 0.8,
    };
  } catch (error) {
    return {
      text: "Merci pour ton message ! Un membre de notre équipe te répondra bientôt.",
      action: "ESCALATE",
      confidence: 0.3,
    };
  }
}





