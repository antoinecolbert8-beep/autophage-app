import { generateText } from '@/lib/ai/vertex';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PROPOSAL GENERATOR
 * Génération de propositions personnalisées en 30s
 */

export interface ProposalData {
    clientName: string;
    companyName: string;
    industry: string;
    painPoints: string[];
    estimatedBudget: number;
    timeline: string;
    projectScope: string;
}

export interface GeneratedProposal {
    id: string;
    title: string;
    executiveSummary: string;
    problemStatement: string;
    proposedSolution: string;
    timeline: string;
    pricing: {
        basePrice: number;
        addOns: Array<{ name: string; price: number }>;
        total: number;
        paymentTerms: string;
    };
    roi: {
        expectedRevenueIncrease: number;
        timeSaving: number;
        paybackPeriod: number;
    };
    nextSteps: string[];
    signatureLink?: string;
}

export class ProposalGenerator {

    /**
     * Templates par industrie
     */
    private static templates: Record<string, any> = {
        'SaaS': {
            focus: 'automation, scalability, integration',
            painPoints: ['manual processes', 'data silos', 'low conversion'],
            value: 'recurring revenue, customer lifetime value'
        },
        'E-commerce': {
            focus: 'conversion optimization, customer retention',
            painPoints: ['cart abandonment', 'low AOV', 'customer churn'],
            value: 'revenue per visitor, retention rate'
        },
        'Services': {
            focus: 'lead generation, qualification, booking',
            painPoints: ['lead quality', 'no-shows', 'manual follow-up'],
            value: 'qualified leads, show rate, time saved'
        },
        'Manufacturing': {
            focus: 'supply chain, inventory, B2B sales',
            painPoints: ['inventory costs', 'lead times', 'manual quoting'],
            value: 'inventory turnover, production efficiency'
        }
    };

    /**
     * Génération complète d'une proposition
     */
    static async generateProposal(data: ProposalData): Promise<GeneratedProposal> {
        console.log(`[Proposal] Generating for ${data.companyName}...`);

        const template = this.templates[data.industry] || this.templates['SaaS'];

        // Génération des sections via IA
        const executiveSummary = await this.generateExecutiveSummary(data, template);
        const problemStatement = await this.generateProblemStatement(data);
        const proposedSolution = await this.generateSolution(data, template);
        const pricing = this.calculatePricing(data);
        const roi = this.calculateROI(data, pricing);

        const proposal: GeneratedProposal = {
            id: 'proposal_' + Date.now(),
            title: `Proposition de Transformation Digitale pour ${data.companyName}`,
            executiveSummary,
            problemStatement,
            proposedSolution,
            timeline: data.timeline,
            pricing,
            roi,
            nextSteps: [
                'Validation de la proposition',
                'Signature du contrat',
                'Kickoff meeting J+2',
                'Onboarding et formation',
                'Go-live et optimisation'
            ]
        };

        console.log(`[Proposal] Generated proposal: ${proposal.id}`);
        return proposal;
    }

    /**
     * Executive Summary
     */
    private static async generateExecutiveSummary(data: ProposalData, template: any): Promise<string> {
        const prompt = `
        Génère un executive summary professionnel pour une proposition commerciale.
        
        Client: ${data.companyName} (${data.industry})
        Pain Points: ${data.painPoints.join(', ')}
        Scope: ${data.projectScope}
        Budget: €${data.estimatedBudget}
        
        L'executive summary doit:
        - Être concis (100-150 mots)
        - Montrer la compréhension des enjeux
        - Présenter la valeur unique
        - Créer l'urgence
        - Être en français professionnel
        
        Executive Summary:
        `;

        const summary = await generateText(prompt, { temperature: 0.6 });
        return summary.trim();
    }

    /**
     * Problem Statement
     */
    private static async generateProblemStatement(data: ProposalData): Promise<string> {
        const problems = data.painPoints.map((p, i) => `${i + 1}. **${p}**`).join('\n');

        return `
## Analyse de la Situation Actuelle

${data.companyName} fait face à plusieurs défis stratégiques:

${problems}

Ces problématiques entraînent:
- Perte de revenus potentiels estimée à €${Math.round(data.estimatedBudget * 2)}/mois
- Inefficacité opérationnelle coûtant ${Math.round(data.estimatedBudget * 0.3)} heures/mois
- Risque de perte de parts de marché face à la concurrence digitalisée

**L'inaction n'est plus une option.**
        `.trim();
    }

    /**
     * Solution proposée
     */
    private static async generateSolution(data: ProposalData, template: any): Promise<string> {
        const prompt = `
        Génère une section "Solution Proposée" pour:
        
        Industrie: ${data.industry}
        Pain Points: ${data.painPoints.join(', ')}
        Scope: ${data.projectScope}
        
        La solution doit inclure:
        - 3-4 modules clés de notre plateforme ELA
        - Comment chaque module résout un pain point
        - Bénéfices concrets et mesurables
        - Français professionnel
        - Format markdown
        
        Solution:
        `;

        const solution = await generateText(prompt, { temperature: 0.7 });
        return solution.trim();
    }

    /**
     * Calcul du pricing
     */
    private static calculatePricing(data: ProposalData): GeneratedProposal['pricing'] {
        const basePrice = data.estimatedBudget || 197;

        // Add-ons recommandés
        const addOns: Array<{ name: string; price: number }> = [];

        if (data.painPoints.includes('manual processes')) {
            addOns.push({ name: 'Automation Premium Pack', price: 97 });
        }

        if (data.industry === 'SaaS' || data.industry === 'E-commerce') {
            addOns.push({ name: 'Advanced Analytics', price: 47 });
        }

        addOns.push({ name: 'Priority Support 24/7', price: 67 });

        const total = basePrice + addOns.reduce((sum, addon) => sum + addon.price, 0);

        return {
            basePrice,
            addOns,
            total,
            paymentTerms: 'Mensuel - Annulation à tout moment'
        };
    }

    /**
     * Calcul du ROI
     */
    private static calculateROI(data: ProposalData, pricing: any): GeneratedProposal['roi'] {
        // Utilise le ROI Calculator
        const expectedRevenueIncrease = data.estimatedBudget * 3; // Conservative
        const timeSaving = 60; // heures/mois
        const paybackPeriod = pricing.total / expectedRevenueIncrease;

        return {
            expectedRevenueIncrease,
            timeSaving,
            paybackPeriod: parseFloat(paybackPeriod.toFixed(1))
        };
    }

    /**
     * Génération du PDF
     */
    static async generatePDF(proposal: GeneratedProposal): Promise<Buffer> {
        // En production: utiliser Puppeteer ou PDFKit
        console.log(`[Proposal] Generating PDF for ${proposal.id}`);

        // Retourner buffer vide pour MVP
        return Buffer.from('PDF content would be here');
    }

    /**
     * Intégration e-signature (DocuSign/HelloSign)
     */
    static async createSignatureRequest(proposal: GeneratedProposal, signerEmail: string): Promise<string> {
        // En production: DocuSign API
        console.log(`[Proposal] Creating signature request for ${signerEmail}`);

        // Simulé
        const signatureLink = `https://app.ela.com/sign/${proposal.id}`;
        return signatureLink;
    }

    /**
     * Suggestions d'upsell
     */
    static async suggestUpsells(data: ProposalData): Promise<Array<{ name: string; value: string; price: number }>> {
        const upsells: Array<{ name: string; value: string; price: number }> = [];

        // Logique basée sur industrie et scope
        if (data.industry === 'SaaS') {
            upsells.push({
                name: 'White-Label Program',
                value: 'Revendez ELA à vos clients avec votre marque',
                price: 497
            });
        }

        if (data.painPoints.includes('lead quality')) {
            upsells.push({
                name: 'Lead Scoring AI Premium',
                value: 'Prédiction ultra-précise du closing probability',
                price: 147
            });
        }

        upsells.push({
            name: 'Dedicated Account Manager',
            value: 'Support dédié + stratégie mensuelle',
            price: 297
        });

        return upsells;
    }
}
