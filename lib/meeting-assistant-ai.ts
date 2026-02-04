import { generateText } from '@/lib/ai/vertex';

/**
 * MEETING ASSISTANT AI
 * Transcription, action items, CRM auto-update, next best action
 */

export interface MeetingTranscript {
    id: string;
    meetingTitle: string;
    participants: string[];
    duration: number; // seconds
    transcript: string;
    language: string;
}

export interface MeetingInsights {
    summary: string;
    actionItems: Array<{
        task: string;
        owner: string;
        deadline?: string;
        priority: 'high' | 'medium' | 'low';
    }>;
    keyDecisions: string[];
    nextSteps: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    dealStage: string;
    crmUpdates: Record<string, any>;
}

export class MeetingAssistantAI {

    /**
     * Transcription d'un call (via Deepgram ou Whisper)
     */
    static async transcribeCall(audioUrl: string): Promise<MeetingTranscript> {
        // En production: utiliser Deepgram API ou OpenAI Whisper
        console.log(`[Meeting Assistant] Transcribing audio: ${audioUrl}`);

        // Simulé pour MVP
        return {
            id: 'transcript_' + Date.now(),
            meetingTitle: 'Sales Call',
            participants: ['Sales Rep', 'Prospect CEO'],
            duration: 1800, // 30 min
            transcript: `[Sales Rep]: Bonjour! Merci d'avoir pris le temps aujourd'hui.\n[Prospect CEO]: Pas de problème, je suis très intéressé par votre solution...`,
            language: 'fr'
        };
    }

    /**
     * Extraction d'insights via IA
     */
    static async extractInsights(transcript: MeetingTranscript): Promise<MeetingInsights> {
        const prompt = `
        Analyse cette transcription de réunion et extrais:
        
        TRANSCRIPTION:
        ${transcript.transcript}
        
        EXTRAIS (format JSON):
        {
            "summary": "Résumé en 2-3 phrases",
            "actionItems": [
                {"task": "...", "owner": "...", "deadline": "YYYY-MM-DD", "priority": "high|medium|low"}
            ],
            "keyDecisions": ["Décision 1", "Décision 2"],
            "nextSteps": ["Étape 1", "Étape 2"],
            "sentiment": "positive|neutral|negative",
            "dealStage": "Discovery|Proposal|Negotiation|Closed",
            "crmUpdates": {
                "budget": "value if mentioned",
                "timeline": "value if mentioned",
                "painPoints": ["pain1", "pain2"],
                "competitors": ["comp if mentioned"]
            }
        }
        
        JSON SEULEMENT:
        `;

        const response = await generateText(prompt, { temperature: 0.3 });

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found');

            const insights = JSON.parse(jsonMatch[0]);

            console.log(`[Meeting Assistant] Extracted ${insights.actionItems.length} action items`);
            return insights;
        } catch (error) {
            console.error('[Meeting Assistant] Failed to parse insights:', error);

            // Fallback
            return {
                summary: 'Réunion de vente productive',
                actionItems: [],
                keyDecisions: [],
                nextSteps: ['Envoyer proposition'],
                sentiment: 'positive',
                dealStage: 'Discovery',
                crmUpdates: {}
            };
        }
    }

    /**
     * Auto-update CRM avec les insights
     */
    static async updateCRM(leadId: string, insights: MeetingInsights): Promise<void> {
        console.log(`[Meeting Assistant] Updating CRM for lead ${leadId}`);

        // En production: intégration HubSpot/Salesforce
        const updates: any = {
            lastMeetingDate: new Date(),
            lastMeetingSummary: insights.summary,
            dealStage: insights.dealStage,
            sentiment: insights.sentiment
        };

        if (insights.crmUpdates.budget) {
            updates.estimatedBudget = insights.crmUpdates.budget;
        }

        if (insights.crmUpdates.timeline) {
            updates.expectedCloseDate = insights.crmUpdates.timeline;
        }

        if (insights.crmUpdates.painPoints) {
            updates.painPoints = insights.crmUpdates.painPoints.join(', ');
        }

        console.log('[Meeting Assistant] CRM updated:', Object.keys(updates));
    }

    /**
     * Création automatique des tasks
     */
    static async createActionItems(insights: MeetingInsights, assignedTo: string): Promise<void> {
        for (const item of insights.actionItems) {
            console.log(`[Meeting Assistant] Creating task: ${item.task} (${item.priority})`);

            // En production: créer dans task management system
            // Notion API, Linear, Asana, etc.
        }
    }

    /**
     * Suggestion next best action
     */
    static async suggestNextAction(insights: MeetingInsights): Promise<string> {
        const prompt = `
        Basé sur ce résumé de meeting:
        
        Summary: ${insights.summary}
        Deal Stage: ${insights.dealStage}
        Sentiment: ${insights.sentiment}
        Next Steps: ${insights.nextSteps.join(', ')}
        
        Quelle est la MEILLEURE action à prendre MAINTENANT pour avancer ce deal?
        Réponds en 1 phrase courte et actionnable.
        `;

        const action = await generateText(prompt, { temperature: 0.7 });
        return action.trim();
    }

    /**
     * Génération du compte-rendu email
     */
    static async generateFollowUpEmail(
        transcript: MeetingTranscript,
        insights: MeetingInsights
    ): Promise<string> {
        const prompt = `
        Génère un email de follow-up professionnel après ce meeting:
        
        Participants: ${transcript.participants.join(', ')}
        Résumé: ${insights.summary}
        Décisions clés: ${insights.keyDecisions.join(', ')}
        Prochaines étapes: ${insights.nextSteps.join(', ')}
        
        L'email doit:
        - Remercier pour le temps
        - Résumer les points clés
        - Lister les action items avec responsables
        - Proposer next steps clairs
        - Ton professionnel mais amical
        - Max 200 mots
        
        Email:
        `;

        const email = await generateText(prompt, { temperature: 0.6 });
        return email.trim();
    }

    /**
     * Pipeline complet: transcription → insights → CRM → tasks → email
     */
    static async processFullMeeting(params: {
        audioUrl: string;
        leadId: string;
        assignedTo: string;
    }): Promise<{
        transcript: MeetingTranscript;
        insights: MeetingInsights;
        nextAction: string;
        followUpEmail: string;
    }> {
        const { audioUrl, leadId, assignedTo } = params;

        console.log('[Meeting Assistant] Processing full meeting pipeline...');

        // 1. Transcription
        const transcript = await this.transcribeCall(audioUrl);

        // 2. Extraction insights
        const insights = await this.extractInsights(transcript);

        // 3. Update CRM
        await this.updateCRM(leadId, insights);

        // 4. Create tasks
        await this.createActionItems(insights, assignedTo);

        // 5. Next action
        const nextAction = await this.suggestNextAction(insights);

        // 6. Email follow-up
        const followUpEmail = await this.generateFollowUpEmail(transcript, insights);

        console.log('[Meeting Assistant] Pipeline complete ✅');

        return {
            transcript,
            insights,
            nextAction,
            followUpEmail
        };
    }
}
