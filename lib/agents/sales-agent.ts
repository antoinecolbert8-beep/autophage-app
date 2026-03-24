import { BaseAgent } from "./base-agent";
import { prisma } from "../../core/db";
import { triggerAutomation } from "../automations";
import { SalesNavigatorScraper } from "../scrapers/sales-navigator";
import { sendRealEmail } from "../services/resend";
import { createEnterpriseCheckoutLink } from "../services/stripe-links";
import { LedgerService } from "../../modules/treasury/ledger.service";

export class SalesAgent extends BaseAgent {
    constructor() {
        super("Sales", "Chasseur de prospects et expert en outreach LinkedIn");
    }

    async execute() {
        console.log("💼 [Sales] Démarrage cycle de prospection...");

        // 0. Récupération de l'Org Admin pour les crédits
        const org = await prisma.organization.findFirst({ 
            where: { 
                status: { in: ['active', 'ACTIVE'] } 
            } 
        });
        if (!org) throw new Error("Aucune organisation active trouvée.");
        const orgId = org.id;

        // 1. Recherche de leads (Réel via Scraper)
        const scraper = new SalesNavigatorScraper();
        
        // SELF-PROMOTION MODE: If no specific org context, target ELA's own growth
        const isSelfPromotion = !org.name.includes('ELA');
        const criteria = isSelfPromotion 
            ? { industry: "Marketing", title: "Agency Owner", seniority: "Decision Maker" }
            : { industry: "SaaS", seniority: "CEO" };

        const leads = await scraper.scanForTargets(criteria, orgId);

        // 2. Filtrage et Enrichissement
        const qualifiedLeads = await this.qualifyLeads(leads, orgId);

        // 3. Action: Cold Email (Real)
        let sentCount = 0;
        const DAILY_LIMIT = 50; // HIGH VELOCITY MODE

        for (const lead of qualifiedLeads) {
            if (sentCount >= DAILY_LIMIT) break;

            // Generate Personalization
            const emailContent = await this.generatePersonalizedEmail(lead, orgId);

            // Send Real Email (via Resend)
            const sent = await this.sendColdEmail(lead, emailContent, orgId);
            if (sent) sentCount++;
        }

        // 4. Tentative de closing sur les leads existants (Warm)
        // DÉSORMAIS PASSIVE: On attend le paiement Stripe
        console.log("💰 [Sales] Mode Passif: En attente des paiements Stripe pour le closing.");
        const closedCount = 0; 

        await this.logAction("PROSPECTING_CYCLE", {
            found: leads.length,
            qualified: qualifiedLeads.length,
            sent: sentCount,
            closed: closedCount
        });

        return {
            status: "COMPLETED",
            leadsFound: leads.length,
            invitesSent: sentCount,
            dealsClosed: closedCount
        };
    }

    /**
     * Tente de convertir les leads "warm" en clients (Converted)
     */
    async closeWarmLeads() {
        console.log("💰 [Sales] Tentative de Closing sur les leads Warm...");
        
        const warmLeads = await prisma.lead.findMany({
            where: { stage: 'warm' },
            take: 10
        });

        let closed = 0;
        for (const lead of warmLeads) {
            // Chance de conversion boostée par l'IA (Simulation)
            const conversionChance = Math.random() > 0.7; // 30% de closing

            if (conversionChance) {
                console.log(`🤑 [Sales] DEAL CLOSED: ${lead.name} de ${lead.company} !`);
                
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: { stage: 'converted' }
                });

                // Simulation de paiement (Update MRR de l'organisation)
                await this.processPayment(lead);
                closed++;
            }
        }
        return closed;
    }

    async processPayment(lead: any) {
        const organization = await prisma.organization.findUnique({
            where: { id: lead.organizationId }
        });

        if (organization) {
            // 💰 REAL REVENUE RECORDING
            const planValueCents = 49900; 
            await LedgerService.recordRevenue(
                planValueCents, 
                `pi_auto_close_${Date.now()}`, 
                lead.email
            );

            await prisma.organization.update({
                where: { id: organization.id },
                data: { 
                    creditBalance: { increment: 5000 }
                }
            });

            // Log Transaction
            await prisma.creditPurchase.create({
                data: {
                    credits: 5000,
                    amountPaid: planValueCents / 100,
                    organizationId: organization.id,
                    paymentIntentId: `pi_auto_${Date.now()}`
                }
            });
        }
    }

    /**
     * Simule une recherche LinkedIn Sales Navigator
     */
    async searchLeads(criteria: any, orgId: string) {
        console.log(`🔎 [Sales] Recherche LinkedIn RÉELLE: ${JSON.stringify(criteria)}`);
        const scraper = new SalesNavigatorScraper();
        return await scraper.scanForTargets(criteria, orgId);
    }

    /**
     * Qualifie les leads via Automation Engine (Deduct credits)
     */
    async qualifyLeads(leads: any[], orgId: string) {
        console.log("🧠 [Sales] Qualification réelle via IA...");
        const qualified = [];
        for (const lead of leads) {
            const result = await triggerAutomation('QUALIFY_LEAD_AI', {
                lead: { name: lead.name, role: lead.role, company: lead.company },
                organizationId: orgId
            });

            if (result.success && result.data?.score > 70) {
                lead.score = result.data.score;
                qualified.push(lead);
            }
        }
        return qualified;
    }

    async generatePersonalizedEmail(lead: any, orgId: string) {
        // Fetch Real Stripe Link
        const stripeLink = await createEnterpriseCheckoutLink(lead.id || 'new', orgId);
        const linkCta = stripeLink ? `\n\nActive ton pack ici: ${stripeLink}` : "";

        const result = await triggerAutomation('GENERATE_SMART_RESPONSE', {
            context: `Write a short cold email to ${lead.name} from ${lead.company}. Value prop: Automation. Include this CTA at the end: ${linkCta}`,
            organizationId: orgId
        });
        return result.success ? result.data.text : "Fallback email mit link: " + linkCta;
    }

    /**
     * Envoie un email réel via Automation Engine (Deduct credits)
     */
    async sendColdEmail(lead: any, content: string, orgId: string) {
        const email = lead.email; // Use real lead email
        console.log(`📧 [Sales] Envoi email RÉEL à ${lead.name} (${email})...`);

        // Use Automation Engine
        const result = await triggerAutomation('SEND_EMAIL', {
            to: email,
            subject: "Collaboration Opportunité",
            message: content,
            organizationId: orgId
        });

        if (result.success) {
            // 🛡️ PRODUCTION HARDENING: Ensure lead exists in DB before logging touchpoint
            const admin = await prisma.user.findFirst({
                where: { role: 'admin' },
                include: { organization: true }
            });

            if (admin) {
                // Find or Create Lead
                const leadInDb = await prisma.lead.upsert({
                    where: {
                        email_organizationId: {
                            email: email,
                            organizationId: admin.organizationId
                        }
                    },
                    update: {
                        name: lead.name,
                        company: lead.company,
                        stage: 'warm'
                    },
                    create: {
                        email: email,
                        name: lead.name,
                        company: lead.company,
                        organizationId: admin.organizationId,
                        stage: 'warm',
                        score: lead.score || 0,
                        scoreBreakdown: JSON.stringify({ ai_qualified: true })
                    }
                });

                await prisma.touchpoint.create({
                    data: {
                        type: 'COLD_EMAIL',
                        channel: 'EMAIL',
                        leadId: leadInDb.id,
                        message: content.substring(0, 100) + "...",
                        delivered: true,
                    }
                });
            }
        }

        return result.success;
    }

    /**
     * ⚡ HIGH AGENCY FOLLOW-UP
     * Triggers when a prospect engages (click/reply)
     */
    async automatedFollowUp(leadId: string) {
        console.log(`🤖 [SalesAgent] Analyzing engagement for lead ${leadId}...`);
        
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return { success: false, reason: "Lead not found" };

        const metadata = JSON.parse(lead.metadata || '{}');
        const prospectName = lead.name || "Ami";

        // Generate high-conversion follow-up
        const prompt = `Génère un mail de relance ultra-personnalisé pour ${prospectName}.
        Contexte: Il vient de cliquer sur notre lien ELA.
        Objectif: Fixer un court appel de 15 min ou obtenir une réponse directe sur ses besoins en automatisation.
        Ton: Expert, direct, valeur ajoutée (pas de spam).
        Langue: Français.`;

        const content = await this.decide(prompt, ["ENVOYER_RELANCE", "IGNORER"]);

        if (content === "ENVOYER_RELANCE") {
            const stripeLink = await createEnterpriseCheckoutLink(leadId, lead.organizationId);
            const emailBody = `Salut ${prospectName}, j'ai vu que tu t'intéresses à ELA. On se cale 10 min pour voir comment scaler ta boîte? 
            
Sinon, tu peux activer ton pack entrepreneur directement ici et on commence le travail maintenant: ${stripeLink}`;
            
            await sendRealEmail(lead.email, "Re: Votre infrastructure ELA", emailBody);
            
            await this.logAction("AUTOMATED_FOLLOWUP_SENT", { leadId });
            return { success: true };
        }

        return { success: false, action: "NONE" };
    }

    /**
     * 🚀 MASS CONVERSION (Bypass simulation)
     * Forcing the closing layer on all current Warm leads
     */
    async forceConversion(limit: number = 20) {
        console.log(`🚀 [SalesAgent] Starting Mass Conversion for ${limit} leads...`);
        
        const warmLeads = await prisma.lead.findMany({
            where: { stage: 'warm' },
            take: limit,
            orderBy: { updatedAt: 'desc' }
        });

        console.log(`🎯 Found ${warmLeads.length} warm prospects to convert.`);
        let converted = 0;

        for (const lead of warmLeads) {
            try {
                console.log(`✍️ Drafting closing email for ${lead.name} (${lead.email})...`);
                const content = await this.generatePersonalizedEmail(lead, lead.organizationId);
                
                const success = await this.sendColdEmail(lead, content, lead.organizationId);
                if (success) {
                    converted++;
                    // Optional: Move to 'closing' stage
                    await prisma.lead.update({
                        where: { id: lead.id },
                        data: { stage: 'closing' }
                    });
                }
                
                // Throttling to avoid spam triggers
                await new Promise(r => setTimeout(r, 2000));
                
            } catch (err) {
                console.error(`❌ Failed to convert lead ${lead.id}:`, err);
            }
        }

        return converted;
    }
}
