import { generateText } from '@/lib/ai/vertex';
import { fetchRedditInsights, fetchHackerNewsInsights, fetchWikipediaData } from '@/lib/data-ingestion';

interface ContentGenerationInput {
    keyword: string;
    targetWordCount: number;
    leadPersona?: string;
    competitors?: string[];
}

interface SemanticAnalysis {
    painPoints: string[];
    entities: string[];
    relationships: Record<string, string[]>;
    gaps: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
}

// Phase 1: Extract semantic intelligence from raw data
export async function analyzeMarketSemantically(keyword: string): Promise<SemanticAnalysis> {
    // Collect multi-source data
    const [reddit, hn, wiki] = await Promise.all([
        fetchRedditInsights(keyword),
        fetchHackerNewsInsights(keyword),
        fetchWikipediaData(keyword),
    ]);

    const analysisPrompt = `
You are a semantic intelligence analyst. Analyze the following raw data about "${keyword}":

REDDIT DISCUSSIONS (${reddit.length} posts):
${reddit.slice(0, 10).map(p => `- ${p.title} (${p.score} upvotes, ${p.numComments} comments)`).join('\n')}

HACKERNEWS DISCUSSIONS (${hn.length} stories):
${hn.slice(0, 10).map(h => `- ${h.title} (${h.points} points, ${h.numComments} comments)`).join('\n')}

WIKIPEDIA CONTEXT:
${wiki?.extract || 'No data available'}

Extract and return ONLY valid JSON with:
{
  "painPoints": ["array of user frustrations and problems mentioned"],
  "entities": ["key concepts, tools, companies, methodologies"],
  "relationships": {"entity": ["related concepts"]},
  "gaps": ["information missing from discussions"],
  "sentiment": "positive|neutral|negative"
}

Be extremely precise. Focus on what's NOT being discussed but should be.
`;

    const result = await generateText(analysisPrompt, { temperature: 0.2 });

    try {
        return JSON.parse(result);
    } catch (error) {
        console.error('Failed to parse semantic analysis:', error);
        return {
            painPoints: [],
            entities: [],
            relationships: {},
            gaps: [],
            sentiment: 'neutral',
        };
    }
}

// Phase 2: Multi-perspective synthesis (Thesis → Antithesis → Synthesis)
export async function generateMultiPerspectiveContent(
    keyword: string,
    analysis: SemanticAnalysis,
    wordCount: number
): Promise<{ thesis: string; antithesis: string; synthesis: string }> {

    // THESIS: Current market consensus
    const thesisPrompt = `
Write a THESIS section (${Math.floor(wordCount * 0.3)} words) about "${keyword}".

Based on market consensus from Reddit, HN:
- Pain Points: ${analysis.painPoints.join(', ')}
- Key Entities: ${analysis.entities.join(', ')}

Present the MAINSTREAM perspective. What does the market currently believe?
Use data-driven arguments. Be authoritative but conventional.
`;

    // ANTITHESIS: Contrarian/alternative view
    const antithesisPrompt = `
Write an ANTITHESIS section (${Math.floor(wordCount * 0.3)} words) challenging the mainstream view on "${keyword}".

Mainstream beliefs to challenge:
- ${analysis.painPoints.slice(0, 3).join('\n- ')}

Identify:
1. Blind spots in current thinking
2. Underexplored alternatives
3. Emerging paradigm shifts

Be contrarian but evidence-based. Question assumptions.
`;

    // SYNTHESIS: Nuanced integration
    const synthesisPrompt = `
Write a SYNTHESIS section (${Math.floor(wordCount * 0.4)} words) integrating both perspectives on "${keyword}".

Information Gaps to fill (what Top 10 Google results miss):
${analysis.gaps.join('\n- ')}

Create a nuanced, deep analysis that:
1. Reconciles mainstream and alternative views
2. Fills critical information gaps
3. Provides actionable frameworks
4. Demonstrates E-E-A-T (Expertise, Experience, Authority, Trust)

Avoid generic advice. Be mathematically unique in structure.
Optimize for Knowledge Graph extraction without keyword stuffing.
`;

    const [thesis, antithesis, synthesis] = await Promise.all([
        generateText(thesisPrompt, { temperature: 0.7 }),
        generateText(antithesisPrompt, { temperature: 0.8 }),
        generateText(synthesisPrompt, { temperature: 0.6 }),
    ]);

    return { thesis, antithesis, synthesis };
}

// Phase 3: Information Gain Protocol (find what competitors miss)
export async function identifyInformationGaps(keyword: string): Promise<string[]> {
    const prompt = `
You are analyzing the top 10 Google results for "${keyword}".

Identify 3 CRUCIAL pieces of information that are MISSING from typical articles:
1. A unique data point or statistic
2. An underexplored perspective or use case
3. A practical framework or methodology

Return ONLY JSON array of strings:
["gap 1", "gap 2", "gap 3"]

Be specific and actionable.
`;

    const result = await generateText(prompt, { temperature: 0.3 });

    try {
        return JSON.parse(result);
    } catch (error) {
        return [
            'Quantitative benchmarks from real implementations',
            'Edge cases and failure modes rarely discussed',
            'Step-by-step decision framework for tool selection',
        ];
    }
}

// Phase 4: Generate final authority content
export async function generateAuthorityContent(input: ContentGenerationInput): Promise<string> {
    console.log(`🎯 Starting authority content generation for: ${input.keyword}`);

    // Step 1: Semantic analysis
    const analysis = await analyzeMarketSemantically(input.keyword);
    console.log(`📊 Semantic analysis complete: ${analysis.painPoints.length} pain points, ${analysis.gaps.length} gaps`);

    // Step 2: Multi-perspective generation
    const perspectives = await generateMultiPerspectiveContent(
        input.keyword,
        analysis,
        input.targetWordCount
    );
    console.log(`🔄 Multi-perspective synthesis complete`);

    // Step 3: Identify information gaps
    const gaps = await identifyInformationGaps(input.keyword);
    console.log(`🎓 Information gaps identified: ${gaps.length}`);

    // Step 4: Final assembly with persona adaptation
    const assemblyPrompt = `
You are writing THE definitive guide on "${input.keyword}".

THESIS (Mainstream View):
${perspectives.thesis}

ANTITHESIS (Alternative View):
${perspectives.antithesis}

SYNTHESIS (Integrated Truth):
${perspectives.synthesis}

CRITICAL INFORMATION TO INCLUDE (missing from competitors):
${gaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

${input.leadPersona ? `TARGET PERSONA: ${input.leadPersona}` : ''}

Create a FINAL, PUBLICATION-READY article with:

1. **Title**: SEO-optimized H1 (include "${input.keyword}")
2. **Meta Description**: 150-160 chars, high CTR
3. **Executive Summary**: 100 words
4. **Main Content**: ${input.targetWordCount} words
   - Use H2/H3 structure
   - Include the 3 critical information gaps seamlessly
   - Add actionable frameworks
   - Use data and examples
   - Optimize for E-E-A-T
5. **Conclusion**: Call to action

CRITICAL RULES:
- NO generic introductions like "In today's digital landscape..."
- NO keyword stuffing (natural semantic density)
- NO fluff or repetition
- MUST redefine the truth on this topic
- MUST be mathematically unique in structure

Return as MARKDOWN. Begin now:
`;

    const finalContent = await generateText(assemblyPrompt, {
        temperature: 0.7,
        maxOutputTokens: 4096,
    });

    return finalContent;
}

// Prisma integration helper
export async function createContentAsset(
    projectId: string,
    keyword: string,
    wordCount: number = 1500
) {
    const content = await generateAuthorityContent({
        keyword,
        targetWordCount: wordCount,
    });

    // Extract title from content (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `The Definitive Guide to ${keyword}`;

    // Extract meta description
    const metaMatch = content.match(/\*\*Meta Description\*\*:\s*(.+)/);
    const metaDescription = metaMatch ? metaMatch[1] : content.slice(0, 160);

    const slug = keyword.toLowerCase().replace(/\s+/g, '-');

    return {
        projectId,
        title,
        content,
        slug,
        metaTitle: title,
        metaDescription,
        keywords: [keyword].join(','),
        semanticScore: calculateSemanticScore(content, keyword),
        wordCount: content.split(/\s+/).length,
        publishedAt: null, // draft by default
    };
}

function calculateSemanticScore(content: string, keyword: string): number {
    // Simple TF-IDF approximation
    const words = content.toLowerCase().split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);

    let matches = 0;
    keywordWords.forEach(kw => {
        matches += words.filter(w => w.includes(kw)).length;
    });

    // Aim for 1-2% density
    const density = (matches / words.length) * 100;

    // Score: 100 if density is 1-2%, lower if outside range
    if (density >= 1 && density <= 2) return 95;
    if (density >= 0.5 && density < 1) return 75;
    if (density > 2 && density <= 3) return 70;
    return 50;
}
