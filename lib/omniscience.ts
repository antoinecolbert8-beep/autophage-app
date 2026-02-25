/**
 * 👁️ OMNISCIENCE MASTER CONTROLLER
 * "Be everywhere. Prospect everyone. Retain with 100% ratio."
 * 
 * Orchestrator and Singularity Point for all Autophage Swarms.
 */

import { ELASelfPromoter } from './god-mode/self-promotion';
import * as SalesAutomation from './sales-automation';
import * as FeedbackLoop from './feedback-loop';
import { db as prisma } from "@/core/db";
import { PulseEngine } from './realtime-pulse';
import { AutoEngagementBot } from './engagement-bot';
import { LeadScoringAI } from './lead-scoring-ai';

export class Omniscience {

    /**
     * TRIGGER SINGULARITY: One call to launch the total domination loop.
     */
    static async triggerSingularity(organizationId: string) {
        console.log("👁️ [OMNISCIENCE] INITIATING SINGULARITY PROTOCOL...");

        const results = {
            saturation: null as any,
            prospecting: null as any,
            retention: null as any,
            timestamp: new Date()
        };

        try {
            // 1. SATURATION (Be Everywhere)
            console.log("🚀 [SATURATION] Orchestrating multi-channel distribution...");
            results.saturation = await ELASelfPromoter.orchestrateHourlyCheck();
            PulseEngine.emitPulse({
                type: 'SYSTEM_UPGRADE',
                message: "Global Saturation initiated."
            });

            // 2. PROSPECTING (Reach Everyone)
            console.log("💼 [DOMINATION] Scaling outreach to qualified leads...");
            results.prospecting = await this.scaleOutreach(organizationId);

            // 3. RETENTION (100% Loyalty)
            console.log("🔄 [LOYALTY] Applying 100% Retention Pressure...");
            results.retention = await this.enforceTotalRetention(organizationId);

            // 4. SELF-IMPROVEMENT
            console.log("🧠 [EVOLUTION] Closing the feedback loop...");
            const analysis = await FeedbackLoop.analyzeFeedback();
            await FeedbackLoop.applyFeedback(analysis);

            console.log("✅ [SINGULARITY] Full deployment active.");
            return { success: true, results };
        } catch (error) {
            console.error("❌ [SINGULARITY] Protocol failed:", error);
            return { success: false, error };
        }
    }

    /**
     * SCALED OUTREACH: Finds and contacts EVERY qualified lead.
     */
    private static async scaleOutreach(organizationId: string) {
        const leads = await prisma.lead.findMany({
            where: {
                organizationId,
                stage: 'cold',
                score: { gte: 70 } // Target high probability first
            },
            take: 50
        });

        console.log(`[DOMINATION] Found ${leads.length} high-potential leads. Triggering automated sequences.`);

        for (const lead of leads) {
            // Extract LinkedIn URL from metadata JSON string
            let linkedinUrl = '';
            try {
                if (lead.metadata) {
                    const meta = JSON.parse(lead.metadata);
                    linkedinUrl = meta.linkedinUrl || meta.salesNavUrl || '';
                }
            } catch (e) {
                console.warn(`[DOMINATION] Failed to parse metadata for lead ${lead.id}`);
            }

            // Programmatically reach out via available channels
            if (linkedinUrl) {
                await SalesAutomation.sendLinkedInInvitation(lead.id, linkedinUrl, "Le futur n'attend pas.");
            }
            // Update status
            await prisma.lead.update({
                where: { id: lead.id },
                data: { stage: 'warm' }
            });
        }

        return { contactedCount: leads.length };
    }

    /**
     * TOTAL RETENTION: Predicts churn and neutralizes it.
     */
    private static async enforceTotalRetention(organizationId: string) {
        console.log("[LOYALTY] Checking for churn signals...");

        // Find users with low activity who haven't churned yet
        const riskyUsers = await prisma.user.findMany({
            where: {
                organizationId,
                updatedAt: { lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } // No activity for 3 days
            }
        });

        console.log(`[LOYALTY] Neutralizing churn for ${riskyUsers.length} users.`);

        for (const user of riskyUsers) {
            // Apply "Nuclear Value" offer
            await AutoEngagementBot.sendRetentionMessage(user.id, "Pourquoi laisser vos concurrents gagner ? Nous venons de débloquer 500 crédits bonus pour votre domination.");
        }

        return { retainedCount: riskyUsers.length };
    }
}
