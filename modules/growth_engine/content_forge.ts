import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/core/env";
import { z } from "zod";
import { db } from "@/core/db";

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY || "");

const AdCopySchema = z.object({
    headline: z.string(),
    primary_text: z.string(),
    call_to_action: z.string(),
});

export type AdCopy = z.infer<typeof AdCopySchema>;

export class ContentGenerationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ContentGenerationError";
    }
}

export async function transformPostToAd(originalPost: string): Promise<AdCopy> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Apprentissage (Few-Shot Learning)
        const winners = await db.post.findMany({
            where: { status: 'WINNER' },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });

        let contextString = "";
        if (winners.length > 0) {
            contextString = "LEARNING FROM SUCCESS - Here are your past high-performing ads (ROAS > 2.0). Analyze their tone and structure, and mimic their success:\n";
            winners.forEach((w, i) => {
                contextString += `[Example ${i + 1}]: ${w.content}\n`;
            });
        }

        // 2. Injection dans le Prompt
        const prompt = `
        Role: Elite Direct Response Copywriter.
        Task: Convert this social post into a High-Converting Meta Ad (Primary Text + Headline).
        
        Source Content: "${originalPost}"
        
        ${contextString} 
        
        Constraints:
        - Hook in the first line.
        - Use "System/Tactical" aesthetic tone.
        - Output JSON: { "headline": "...", "primary_text": "...", "call_to_action": "..." }
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const json = JSON.parse(cleanedText);
            return AdCopySchema.parse(json);
        } catch (e) {
            throw new ContentGenerationError("Failed to parse Gemini output or validation failed: " + (e instanceof Error ? e.message : String(e)));
        }
    } catch (error) {
        throw new ContentGenerationError(error instanceof Error ? error.message : "Unknown error");
    }
}

