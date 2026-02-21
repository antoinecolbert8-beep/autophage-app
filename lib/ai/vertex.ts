import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { getOpenAIClient } from '@/lib/ai/openai-client';

let genAI: GoogleGenerativeAI | null = null;
let vertexModel: any = null;
let _openaiClient: OpenAI | null = null;

function getClients() {
    // 1. Try Initialize Vertex/Gemini
    if (!vertexModel) {
        const apiKey = process.env.VERTEX_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (apiKey) {
            genAI = new GoogleGenerativeAI(apiKey);
            vertexModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        }
    }

    // 2. Try Initialize OpenAI
    if (!_openaiClient) {
        _openaiClient = getOpenAIClient();
    }

    return { vertexModel, openaiClient: _openaiClient };
}

export async function generateText(prompt: string, options?: {
    temperature?: number;
    maxOutputTokens?: number;
}): Promise<string> {
    const { vertexModel, openaiClient } = getClients();

    // Strategy: Try OpenAI first if available (faster/more reliable for user context), 
    // or fallback to Vertex if OpenAI missing (or vice versa).
    // Given the user said "contourne le problème", we prioritize the one that works (OpenAI seems to have key).

    // Priority 1: OpenAI
    if (openaiClient) {
        try {
            console.log("brain: Using OpenAI (Bypass Mode)...");
            const completion = await openaiClient.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini", // Faster and cheaper for high-frequency agents
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxOutputTokens ?? 2048,
            });
            return completion.choices[0].message.content || '';
        } catch (openaiError: any) {
            console.warn("⚠️ OpenAI Failed:", openaiError.message || openaiError);
            // Fallthrough to Vertex
        }
    }

    // Priority 2: Vertex AI
    if (vertexModel) {
        try {
            console.log("brain: Using Vertex AI...");
            const result = await vertexModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: options?.temperature ?? 0.7,
                    maxOutputTokens: options?.maxOutputTokens ?? 2048,
                },
            });
            return result.response.text() ?? '';
        } catch (vertexError: any) {
            console.error('❌ Vertex AI Failed Details:', vertexError);
            if (vertexError.response) console.error('Vertex Response:', vertexError.response);
            // Fallthrough to return empty
        }
    }

    console.error("❌ CRITICAL: No functioning AI brain available. OpenAI Key:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...", "Vertex Key:", process.env.VERTEX_AI_API_KEY?.substring(0, 10) + "...");
    return '';
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
        // Try to extract JSON from response extract enclosing brackets too
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
export { vertexModel as vertexAI };
