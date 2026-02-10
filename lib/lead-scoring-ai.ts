import { db as prisma } from "@/core/db";
import { generateText } from '@/lib/ai/vertex';

/**
 * LEAD SCORING AI
 * Score prédictif 0-100 avec intent signals et optimal timing
 */

export interface LeadScore {
    leadId: string;
    score: number; // 0-100
    tier: 'hot' | 'warm' | 'cold';
    buyingIntent: number; // 0-100
    optimalContactTime: Date;
    nextBestAction: string;
    reasoning: string[];
}

export interface IntentSignal {
    type: 'website_visit' | 'email_open' | 'content_download' | 'pricing_view' | 'demo_request' | 'competitor_research';
    timestamp: Date;
    value: number; // Weight 0-10
}

export class LeadScoringAI {

    /**
     * Score un lead avec tous les signaux
     */
    static async scoreLead(leadId: string): Promise<LeadScore> {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                organization: true
            }
        });

        if (!lead) {
            throw new Error('Lead not found');
        }

        // Collecter tous les signals
        const signals = await this.collectIntentSignals(leadId);

        // Calcul du score
        const score = this.calculateScore(lead, signals);
        const buyingIntent = this.calculateBuyingIntent(signals);
        const tier = this.determineTier(score);
        const optimalContactTime = this.predictOptimalTime(lead, signals);
        const nextBestAction = await this.determineNextAction(lead, score, signals);
        const reasoning = this.generateReasoning(lead, signals, score);

        return {
            leadId,
            score,
            tier,
            buyingIntent,
            optimalContactTime,
            nextBestAction,
            reasoning
        };
    }

    /**
     * Collecte des intent signals
     */
    private static async collectIntentSignals(leadId: string): Promise<IntentSignal[]> {
        // En production, connecté à analytics, CRM, website tracking
        const signals: IntentSignal[] = [];

        // Simulé pour MVP - à remplacer par vraies sources
        const recentActivity = [
            { type: 'website_visit' as const, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), value: 3 },
            { type: 'pricing_view' as const, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), value: 8 },
            { type: 'email_open' as const, timestamp: new Date(Date.now() - 30 * 60 * 1000), value: 2 }
        ];

        return recentActivity;
    }

    /**
     * Calcul du score basé sur multiples facteurs
     */
    private static calculateScore(lead: any, signals: IntentSignal[]): number {
        let score = 0;

        // Firmographic score (30 points max)
        if (lead.organization) {
            // Taille entreprise
            if (lead.companySize && lead.companySize > 50) score += 10;
            else if (lead.companySize && lead.companySize > 10) score += 5;

            // Industrie (secteurs à forte valeur)
            const highValueIndustries = ['SaaS', 'Tech', 'Finance', 'Healthcare'];
            if (lead.industry && highValueIndustries.includes(lead.industry)) {
                score += 15;
            }

            // Budget
            if (lead.estimatedBudget && lead.estimatedBudget > 10000) score += 5;
        }

        // Behavioral score (40 points max)
        const recentSignals = signals.filter(s =>
            new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        const behaviorScore = recentSignals.reduce((sum, signal) => sum + signal.value, 0);
        score += Math.min(behaviorScore, 40);

        // Engagement score (30 points max)
        const emailEngagement = signals.filter(s => s.type === 'email_open').length * 3;
        const contentEngagement = signals.filter(s => s.type === 'content_download').length * 5;
        const demoInterest = signals.filter(s => s.type === 'demo_request').length * 15;

        const engagementScore = emailEngagement + contentEngagement + demoInterest;
        score += Math.min(engagementScore, 30);

        return Math.min(Math.round(score), 100);
    }

    /**
     * Calcul buying intent
     */
    private static calculateBuyingIntent(signals: IntentSignal[]): number {
        const highIntentActions = ['pricing_view', 'demo_request', 'competitor_research'];

        const recentHighIntent = signals.filter(s =>
            highIntentActions.includes(s.type) &&
            new Date(s.timestamp) > new Date(Date.now() - 48 * 60 * 60 * 1000)
        );

        const intentScore = recentHighIntent.reduce((sum, s) => sum + s.value, 0);
        return Math.min(Math.round((intentScore / 30) * 100), 100);
    }

    /**
     * Détermination du tier
     */
    private static determineTier(score: number): 'hot' | 'warm' | 'cold' {
        if (score >= 70) return 'hot';
        if (score >= 40) return 'warm';
        return 'cold';
    }

    /**
     * Prédiction du meilleur moment pour contacter
     */
    private static predictOptimalTime(lead: any, signals: IntentSignal[]): Date {
        // Analyser l'historique d'activité pour détecter les patterns
        const activityHours = signals.map(s => new Date(s.timestamp).getHours());

        // Trouver l'heure la plus fréquente
        const hourFrequency: Record<number, number> = {};
        activityHours.forEach(hour => {
            hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
        });

        const optimalHour = Object.entries(hourFrequency)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || '14'; // Default 14h

        // Prochaine occurrence de cette heure
        const now = new Date();
        const optimal = new Date();
        optimal.setHours(parseInt(optimalHour), 0, 0, 0);

        if (optimal < now) {
            optimal.setDate(optimal.getDate() + 1);
        }

        return optimal;
    }

    /**
     * Détermination de la next best action
     */
    private static async determineNextAction(lead: any, score: number, signals: IntentSignal[]): Promise<string> {
        if (score >= 80) {
            return "Call immédiat - Lead ultra-chaud, proposer demo dans les 2h";
        } else if (score >= 60) {
            return "Email personnalisé avec case study pertinent, suivre par call J+1";
        } else if (score >= 40) {
            return "Nurture sequence - Envoyer contenu éducatif, suivre engagement";
        } else {
            return "Campagne automatique - Newsletter mensuelle, surveiller signaux";
        }
    }

    /**
     * Génération du raisonnement
     */
    private static generateReasoning(lead: any, signals: IntentSignal[], score: number): string[] {
        const reasons: string[] = [];

        if (score >= 70) {
            reasons.push("⚡ Score élevé - Lead très qualifié");
        }

        const recentPricingViews = signals.filter(s =>
            s.type === 'pricing_view' &&
            new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length;

        if (recentPricingViews > 0) {
            reasons.push(`💰 ${recentPricingViews} vue(s) pricing récente(s) - Fort intent d'achat`);
        }

        if (lead.companySize && lead.companySize > 50) {
            reasons.push("🏢 Entreprise de taille moyenne/grande - Bon fit ICP");
        }

        const emailOpens = signals.filter(s => s.type === 'email_open').length;
        if (emailOpens >= 3) {
            reasons.push(`📧 ${emailOpens} emails ouverts - Engagement élevé`);
        }

        if (reasons.length === 0) {
            reasons.push("📊 Lead récent - Score basé sur firmographics");
        }

        return reasons;
    }

    /**
     * Batch scoring de tous les leads
     */
    static async scoreAllLeads(): Promise<LeadScore[]> {
        const leads = await prisma.lead.findMany({
            where: {
                stage: { not: 'customer' }
            }
        });

        const scores: LeadScore[] = [];

        for (const lead of leads) {
            try {
                const score = await this.scoreLead(lead.id);
                scores.push(score);

                // Update lead avec le score
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        score: score.score,
                        // tier: score.tier // Si champ existe
                    }
                });
            } catch (error) {
                console.error(`[Lead Scoring] Failed to score ${lead.id}:`, error);
            }
        }

        console.log(`[Lead Scoring] Scored ${scores.length} leads`);
        return scores;
    }

    /**
     * Auto-routing basé sur le score
     */
    static async autoRoute(leadId: string): Promise<{ assignedTo: string; reason: string }> {
        const score = await this.scoreLead(leadId);

        // Logique de routing
        if (score.tier === 'hot') {
            return {
                assignedTo: 'senior_sales_rep',
                reason: 'Lead chaud - Priorité maximale pour senior'
            };
        } else if (score.tier === 'warm') {
            return {
                assignedTo: 'sales_rep',
                reason: 'Lead warm - Sales rep standard'
            };
        } else {
            return {
                assignedTo: 'marketing_automation',
                reason: 'Lead froid - Nurture automatique'
            };
        }
    }
}
