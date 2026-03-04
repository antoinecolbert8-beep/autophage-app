import OpenAI from "openai";
import { getOpenAIClient } from "./openai-client";

/**
 * 🎨 DALL-E 3 Image Generation Service
 * Provides high-quality, unique visuals for social media automation.
 */
export class DalleService {
    private static client: OpenAI | null = null;

    private static getClient(): OpenAI {
        if (!this.client) {
            this.client = getOpenAIClient();
        }
        return this.client;
    }

    /**
     * Generates a high-quality image based on a prompt.
     * @param prompt Detailed description for DALL-E 3
     * @param size "1024x1024" (Standard), "1024x1792" (Portrait/Stories/Shorts)
     * @returns URL of the generated image (OpenAI temporary URL)
     */
    static async generateImage(
        prompt: string,
        size: "1024x1024" | "1024x1792" = "1024x1024"
    ): Promise<string> {
        const openai = this.getClient();

        try {
            console.log(`🎨 [DALL-E 3] Generating image: "${prompt.substring(0, 50)}..."`);

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: size,
                quality: "standard",
                style: "vivid",
            });

            const imageUrl = response.data[0]?.url;

            if (!imageUrl) {
                throw new Error("No image URL returned from OpenAI");
            }

            console.log("✅ [DALL-E 3] Image generated successfully.");
            return imageUrl;

        } catch (error: any) {
            console.error("❌ [DALL-E 3] Generation failed:", error.message || error);
            throw error;
        }
    }
}
