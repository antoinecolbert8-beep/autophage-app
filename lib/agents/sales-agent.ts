import { BaseAgent } from "./base-agent";
import { PrismaClient } from "@prisma/client";
import { generateContentWithGemini } from "../gemini-content";
import { sendRealEmail } from "../services/send-grid";

const prisma = new PrismaClient();

export class SalesAgent extends BaseAgent {
    constructor() {
        super("Sales", "Chasseur de prospects et expert en outreach LinkedIn");
    }

    async execute() {
        console.log("💼 [Sales] Démarrage cycle de prospection...");

        // 1. Recherche de leads
        const leads = await this.searchLeads({ role: "CEO", industry: "SaaS" });

        // 2. Filtrage et Enrichissement
        const qualifiedLeads = await this.qualifyLeads(leads);

        // 3. Action: Cold Email (Real)
        let sentCount = 0;
        const DAILY_LIMIT = 50; // HIGH VELOCITY MODE

        for (const lead of qualifiedLeads) {
            if (sentCount >= DAILY_LIMIT) break;

            // Generate Personalization
            const emailContent = await this.generatePersonalizedEmail(lead);

            // Send Real Email
            const sent = await this.sendColdEmail(lead, emailContent);
            if (sent) sentCount++;
        }

        await this.logAction("PROSPECTING_CYCLE", {
            found: leads.length,
            qualified: qualifiedLeads.length,
            sent: sentCount
        });

        return {
            status: "COMPLETED",
            leadsFound: leads.length,
            invitesSent: sentCount
        };
    }

    /**
     * Simule une recherche LinkedIn Sales Navigator
     */
    async searchLeads(criteria: any) {
        console.log(`🔎 [Sales] Recherche ciblée: ${JSON.stringify(criteria)}`);

        // Simulation - En prod, utiliser API LinkedIn ou PhantomBuster
        // Génération procédurale de leads pour simuler du volume "High Flux"
        const baseLeads = [
            { name: "Jean Dupont", role: "CEO", company: "TechFlow", url: "linkedin.com/in/jeandupont", score: 85 },
            { name: "Marie Curie", role: "Founder", company: "ScienceNext", url: "linkedin.com/in/mariecurie", score: 92 },
            { name: "Paul Martin", role: "CTO", company: "DevCorp", url: "linkedin.com/in/paulmartin", score: 70 },
            { name: "Sophie Durant", role: "CMO", company: "MarketPulse", url: "linkedin.com/in/sophiedurant", score: 88 }
        ];

        // Add 20 more generated leads to feed the beast
        for (let i = 0; i < 20; i++) {
            baseLeads.push({
                name: `Prospect Generated ${i}`,
                role: "Director of Operations",
                company: `Startup Alpha ${i}`,
                url: `linkedin.com/in/prospect${i}`,
                score: 75 + Math.floor(Math.random() * 20)
            });
        }

        return baseLeads;
    }

    /**
     * Qualifie les leads via Gemini (Reel)
     */
    async qualifyLeads(leads: any[]) {
        console.log("🧠 [Sales] Qualification réelle via IA...");
        const qualified = [];
        for (const lead of leads) {
            const prompt = `Lead: ${lead.name}, ${lead.role} chez ${lead.company}. Score this lead from 0-100 for a SaaS B2B offer. Return ONLY the number.`;
            const scoreText = await generateContentWithGemini({
                topic: "Lead Scoring",
                platform: "LINKEDIN", // Context reuse
                contentType: "TEXT",
                tone: "analytical",
                keywords: [prompt]
            });

            // Extract number from AI response
            const score = parseInt(scoreText.text.match(/\d+/)?.[0] || "50");
            console.log(`   -> ${lead.name}: Score IA = ${score}`);

            if (score > 70) {
                lead.score = score;
                qualified.push(lead);
            }
        }
        return qualified;
    }

    async generatePersonalizedEmail(lead: any) {
        return await generateContentWithGemini({
            topic: `Cold Email for ${lead.role}`,
            platform: "LINKEDIN", // reusing generation logic
            contentType: "TEXT",
            tone: "professional",
            keywords: [`Write a short cold email to ${lead.name} from ${lead.company}. Value prop: Automation.`]
        });
    }

    /**
     * Envoie un email réel
     */
    async sendColdEmail(lead: any, content: any) {
        const email = `mock.${lead.name.replace(' ', '.')}@example.com`; // In prod, use real lead.email
        console.log(`📧 [Sales] Envoi email réel à ${lead.name} (${email})...`);

        // Use SendGrid
        const sent = await sendRealEmail(email, "Collaboration Opportunité", content.text);

        if (sent) {
            // Log to DB
            const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
            if (admin) {
                await prisma.touchpoint.create({
                    data: {
                        type: 'COLD_EMAIL',
                        channel: 'EMAIL',
                        leadId: 'temp_lead_id', // Simplify for valid execution
                        message: content.text.substring(0, 100) + "...",
                        delivered: true,
                        campaignId: undefined // Optional
                    }
                });
            }
        }

        return sent;
    }
}
