/**
 * VERTEX AI / GEMINI INTEGRATION
 * Uses Google Generative AI SDK (already installed)
 * For production, configure VERTEX_AI_API_KEY in environment
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VERTEX_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function generateText(prompt: string, options?: {
    temperature?: number;
    maxOutputTokens?: number;
}): Promise<string> {
    if (!apiKey) {
        console.warn('[AI] No API key configured, returning empty response');
        return '';
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: options?.temperature ?? 0.7,
                maxOutputTokens: options?.maxOutputTokens ?? 2048,
            },
        });

        return result.response.text() ?? '';
    } catch (error) {
        console.error('[AI] Generation error:', error);
        return '';
    }
}

export async function analyzeKeywords(domain: string, industry: string) {
    const prompt = `
You are an expert SEO strategist. Analyze the market for a business in the "${industry}" industry with domain "${domain}".

Provide a JSON response with 20 high-value keyword opportunities. For each keyword, include:
- keyword: the exact keyword phrase
- searchVolume: estimated monthly searches
- difficulty: SEO difficulty score (0-100)
- intent: commercial/informational/navigational/transactional
- cluster: topical cluster name
- priority: calculated priority score (0-100)

Format the response as valid JSON only, no markdown.
`;

    const response = await generateText(prompt, { temperature: 0.3 });

    try {
        // Try to extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (error) {
        console.error('[AI] Failed to parse keywords response:', error);
        return [];
    }
}

export async function generateSEOContent(keyword: string, wordCount: number = 1500) {
    const prompt = `
Write a comprehensive, SEO-optimized article about "${keyword}".

Requirements:
- ${wordCount} words minimum
- Include H2 and H3 headings
- Natural keyword integration (no keyword stuffing)
- Answer common user questions
- Include actionable insights
- Use markdown format

Write the article now:
`;

    return await generateText(prompt, { temperature: 0.8, maxOutputTokens: 4096 });
}

export async function scoreLeadQuality(leadData: {
    email: string;
    company?: string;
    industry?: string;
    engagement?: string[];
}) {
    const prompt = `
You are a lead scoring AI. Analyze this lead and provide a quality score:

Lead Data:
${JSON.stringify(leadData, null, 2)}

Provide a JSON response with:
- demographicScore: 0-100 based on company/industry fit
- behavioralScore: 0-100 based on engagement patterns  
- intentScore: 0-100 based on likelihood to convert
- totalScore: weighted average
- reasoning: brief explanation

Format as valid JSON only.
`;

    const response = await generateText(prompt, { temperature: 0.2 });

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (error) {
        console.error('[AI] Failed to parse lead score:', error);
        return {
            demographicScore: 50,
            behavioralScore: 50,
            intentScore: 50,
            totalScore: 50,
            reasoning: 'Default score due to parsing error'
        };
    }
}

export async function personalizeMessage(
    template: string,
    leadData: {
        name?: string;
        company?: string;
        pain_points?: string[];
    }
) {
    const prompt = `
Personalize this marketing message template for the lead:

Template: ${template}

Lead Data:
${JSON.stringify(leadData, null, 2)}

Requirements:
- Keep the core message structure
- Personalize with lead-specific details
- Make it feel natural, not robotic
- Maintain professional tone

Return only the personalized message, no explanations.
`;

    return await generateText(prompt, { temperature: 0.7 });
}

// Export the model for direct use if needed
export { model as vertexAI };
