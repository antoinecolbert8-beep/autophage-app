import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

import { SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (_supabase) return _supabase;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
            throw new Error('Supabase credentials missing');
        }
        // Return a dummy client during build to prevent crashes
        return createClient(
            url || 'https://dummy.supabase.co',
            key || 'dummy_key'
        );
    }

    _supabase = createClient(url, key);
    return _supabase;
}

// For backward compatibility or internal use if needed
const supabase = getSupabaseClient();

// Real-time sync from Prisma to Supabase
export async function syncToSupabase<T>(
    table: string,
    data: T,
    operation: 'insert' | 'update' | 'delete'
) {
    try {
        if (operation === 'insert') {
            const { error } = await supabase.from(table).insert(data);
            if (error) throw error;
        } else if (operation === 'update') {
            const { error } = await supabase.from(table).upsert(data);
            if (error) throw error;
        } else if (operation === 'delete') {
            const { error } = await supabase.from(table).delete().match(data as Record<string, unknown>);
            if (error) throw error;
        }

        console.log(`Synced to Supabase: ${table} (${operation})`);
        return { success: true };
    } catch (error) {
        console.error('Supabase sync error:', error);
        return { success: false, error };
    }
}

// Listen to Supabase changes and trigger AI
export function setupRealtimeListener() {
    // Listen to keyword opportunities
    const keywordChannel = supabase
        .channel('keyword-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'KeywordOpportunity',
            },
            async (payload) => {
                console.log('Keyword change detected:', payload);

                // Trigger AI analysis
                if (payload.eventType === 'INSERT') {
                    await analyzeKeywordWithAI(payload.new);
                }
            }
        )
        .subscribe();

    // Listen to leads
    const leadChannel = supabase
        .channel('lead-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'Lead',
            },
            async (payload) => {
                console.log('New lead detected:', payload);

                // Trigger AI scoring
                await scoreLeadWithAI(payload.new);
            }
        )
        .subscribe();

    return { keywordChannel, leadChannel };
}

// AI Analysis triggered by Supabase
async function analyzeKeywordWithAI(keyword: any) {
    const { generateText } = await import('@/lib/ai/vertex');

    const prompt = `
Analyze this SEO keyword opportunity:
Keyword: ${keyword.keyword}
Volume: ${keyword.volume}
Difficulty: ${keyword.difficulty}
Intent: ${keyword.intent}

Provide:
1. Content strategy
2. Targeting recommendations
3. Competition level
4. Expected ROI

Return as JSON.
`;

    const analysis = await generateText(prompt, { temperature: 0.3 });

    // Store AI insights back in Supabase
    await supabase.from('KeywordInsights').insert({
        keyword_id: keyword.id,
        analysis: JSON.parse(analysis || '{}'),
        generated_at: new Date().toISOString(),
    });

    console.log(`AI analysis completed for keyword: ${keyword.keyword}`);
}

async function scoreLeadWithAI(lead: any) {
    const { scoreLeadQuality } = await import('@/lib/ai/vertex');

    const scoreData = await scoreLeadQuality({
        email: lead.email,
        company: lead.company,
        industry: lead.industry,
    });

    // Update lead with AI score in Supabase
    await supabase
        .from('Lead')
        .update({
            score: scoreData.totalScore,
            score_breakdown: scoreData,
            stage: scoreData.totalScore > 70 ? 'hot' :
                scoreData.totalScore > 40 ? 'warm' : 'cold',
        })
        .eq('id', lead.id);

    console.log(`AI scoring completed for lead: ${lead.email}`);
}

// Continuous data flow worker
export class DataSyncWorker {
    private isRunning = false;
    private interval: NodeJS.Timeout | null = null;

    start(intervalMs: number = 5000) {
        if (this.isRunning) return;

        this.isRunning = true;
        console.log('🔄 Data Sync Worker started');

        this.interval = setInterval(async () => {
            await this.syncCycle();
        }, intervalMs);

        // Also setup realtime listeners
        setupRealtimeListener();
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏸️ Data Sync Worker stopped');
    }

    private async syncCycle() {
        try {
            // 1. Fetch new data from external sources (OAuth)
            await this.fetchExternalData();

            // 2. Sync to Supabase
            await this.syncPendingData();

            // 3. Trigger AI analysis on new data
            await this.triggerAIAnalysis();

            // 4. Apply AI insights back to data
            await this.applyAIInsights();

        } catch (error) {
            console.error('Sync cycle error:', error);
        }
    }

    private async fetchExternalData() {
        // Fetch from Google Analytics, Search Console, Instagram, etc.
        // Based on user consents
    }

    private async syncPendingData() {
        // Sync any pending Prisma data to Supabase
        const pendingKeywords = await prisma.keywordOpportunity.findMany({
            where: { status: 'pending' },
            take: 10,
        });

        for (const kw of pendingKeywords) {
            await syncToSupabase('KeywordOpportunity', kw, 'insert');
        }
    }

    private async triggerAIAnalysis() {
        // Trigger AI on unanalyzed data
        const { data: unanalyzed } = await supabase
            .from('KeywordOpportunity')
            .select('*')
            .is('ai_analyzed', null)
            .limit(5);

        if (unanalyzed) {
            for (const item of unanalyzed) {
                await analyzeKeywordWithAI(item);
            }
        }
    }

    private async applyAIInsights() {
        // Apply AI recommendations back to system
        const { data: insights } = await supabase
            .from('KeywordInsights')
            .select('*')
            .is('applied', null)
            .limit(5);

        if (insights) {
            for (const insight of insights) {
                // Apply recommendation (create content, adjust strategy, etc.)
                await this.applyRecommendation(insight);
            }
        }
    }

    private async applyRecommendation(insight: any) {
        // Example: Auto-generate content for high-priority keywords
        if (insight.analysis?.priority === 'high') {
            const { generateSEOContent } = await import('@/lib/ai/vertex');

            const content = await generateSEOContent(insight.keyword, 1500);

            await supabase.from('ContentAsset').insert({
                keyword_id: insight.keyword_id,
                title: `Guide: ${insight.keyword}`,
                content: content,
                status: 'draft',
                generated_by: 'ai',
            });

            // Mark insight as applied
            await supabase
                .from('KeywordInsights')
                .update({ applied: true })
                .eq('id', insight.id);
        }
    }
}

// Export singleton worker
export const dataSyncWorker = new DataSyncWorker();
