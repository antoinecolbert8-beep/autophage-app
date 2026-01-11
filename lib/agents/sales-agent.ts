import { BaseAgent } from "./base-agent";
import { PrismaClient } from "@prisma/client";

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

        // 3. Action: Demande de connexion
        let sentCount = 0;
        for (const lead of qualifiedLeads) {
            if (sentCount >= 5) break; // Sécurité anti-spam
            await this.sendConnectionRequest(lead);
            sentCount++;
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
        return [
            { name: "Jean Dupont", role: "CEO", company: "TechFlow", url: "linkedin.com/in/jeandupont", score: 85 },
            { name: "Marie Curie", role: "Founder", company: "ScienceNext", url: "linkedin.com/in/mariecurie", score: 92 },
            { name: "Paul Martin", role: "CTO", company: "DevCorp", url: "linkedin.com/in/paulmartin", score: 70 },
            { name: "Sophie Durant", role: "CMO", company: "MarketPulse", url: "linkedin.com/in/sophiedurant", score: 88 }
        ];
    }

    /**
     * Qualifie les leads via Gemini ?
     */
    async qualifyLeads(leads: any[]) {
        return leads.filter(l => l.score > 80);
    }

    /**
     * Envoie une invitation
     */
    async sendConnectionRequest(lead: any) {
        console.log(`🤝 [Sales] Invitation envoyée à ${lead.name} (${lead.company})`);

        // Sauvegarde en BDD
        // On assume qu'on attache ça à l'organisation Admin
        const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
        if (admin) {
            // Upsert lead
            const dbLead = await prisma.lead.upsert({
                where: { email_organizationId: { email: `mock.${lead.name.replace(' ', '.')}@example.com`, organizationId: admin.organizationId } },
                update: { stage: 'contacted' },
                create: {
                    email: `mock.${lead.name.replace(' ', '.')}@example.com`,
                    name: lead.name,
                    company: lead.company,
                    organizationId: admin.organizationId,
                    stage: 'contacted',
                    scoreBreakdown: JSON.stringify({ demographic: 20, behavioral: 0, engagement: 0, intent: 0 }),
                    metadata: JSON.stringify({ linkedinUrl: lead.url, score: lead.score })
                }
            });

            // Log interaction
            await prisma.touchpoint.create({
                data: {
                    type: 'CONNECTION_REQUEST',
                    channel: 'LINKEDIN',
                    leadId: dbLead.id,
                    message: `Bonjour ${lead.name}, échangeons sur votre croissance ?`,
                    delivered: true
                }
            });
        }

        return true;
    }
}
