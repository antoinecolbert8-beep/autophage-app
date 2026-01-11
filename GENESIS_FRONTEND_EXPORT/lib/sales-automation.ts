/**
 * 💼 Sales Automation - Prospection et vente d'abonnements
 * Démarchage LinkedIn, qualification leads, pipeline de vente
 */

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type Lead = {
  id?: string;
  name: string;
  company?: string;
  position?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  score: number; // 0-100
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
  source: string;
  notes?: string;
};

export type SubscriptionPlan = {
  name: string;
  price: number;
  currency: string;
  interval: "MONTHLY" | "YEARLY";
  features: string[];
};

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  STARTER: {
    name: "Starter",
    price: 99,
    currency: "EUR",
    interval: "MONTHLY",
    features: [
      "Bot LinkedIn (100 actions/jour)",
      "Génération contenu (10 posts/mois)",
      "RAG basique",
    ],
  },
  PRO: {
    name: "Pro",
    price: 299,
    currency: "EUR",
    interval: "MONTHLY",
    features: [
      "Bot LinkedIn illimité",
      "Génération contenu (50 posts/mois)",
      "Multi-plateforme (Instagram, Facebook)",
      "RAG avancé",
      "Support prioritaire",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 999,
    currency: "EUR",
    interval: "MONTHLY",
    features: [
      "Tout inclus Pro",
      "Multi-comptes",
      "Téléphonie IA (1000 appels/mois)",
      "Intégrations CRM",
      "Module juridique",
      "Onboarding dédié",
    ],
  },
};

/**
 * Qualifie un lead (score 0-100)
 */
export async function qualifyLead(lead: Partial<Lead>): Promise<number> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un système de qualification de leads B2B.
Score 0-100 basé sur :
- Position (CEO/Director = +30, Manager = +20, Employee = +10)
- Entreprise (>50 employés = +20, <50 = +10)
- Besoin identifié (+30 si clair)
- Budget potentiel (+20 si >500€/mois)

Réponds uniquement avec un nombre entre 0 et 100.`,
        },
        {
          role: "user",
          content: `Lead: ${lead.name}, ${lead.position || "N/A"}, ${lead.company || "N/A"}`,
        },
      ],
    });

    const scoreText = completion.choices[0].message.content || "50";
    const score = parseInt(scoreText.match(/\d+/)?.[0] || "50", 10);

    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error("Erreur qualification lead:", error);
    return 50; // Score par défaut
  }
}

/**
 * Génère un message de prospection personnalisé
 */
export async function generateProspectMessage(
  lead: Lead,
  template: "INTRODUCTION" | "FOLLOW_UP" | "PROPOSAL"
): Promise<string> {
  const templates = {
    INTRODUCTION: `Salut {name},

J'ai vu ton profil et ton parcours chez {company} m'a interpellé.

Je travaille sur une solution d'automatisation IA qui aide les {position} comme toi à scaler leur présence LinkedIn et gérer leur prospection automatiquement.

Concrètement :
- Bot LinkedIn intelligent (engagement 24/7)
- Génération de contenu viral (Gemini AI)
- Téléphonie IA pour qualifier tes leads

Intéressé pour en discuter 15 min cette semaine ?

{signature}`,

    FOLLOW_UP: `Salut {name},

Je reviens vers toi suite à mon message de la semaine dernière.

J'ai vu que tu as posté sur {topic} - ça tombe bien, c'est exactement le type de défi que notre IA résout.

Nos clients (CEO/Founders comme toi) gagnent en moyenne 15h/semaine grâce à l'automatisation.

Dispo pour un call rapide ?

{signature}`,

    PROPOSAL: `Salut {name},

Suite à notre échange, voici ce que je te propose :

**Plan {plan}** - {price}€/mois
{features}

**Onboarding inclus** :
- Setup personnalisé (2h)
- Formation équipe
- Support prioritaire 30 jours

**Garantie** : Satisfait ou remboursé 14 jours.

Je t'envoie le lien de démo ?

{signature}`,
  };

  const template_text = templates[template];

  // Remplace les variables
  let message = template_text
    .replace(/{name}/g, lead.name.split(" ")[0])
    .replace(/{company}/g, lead.company || "ta boîte")
    .replace(/{position}/g, lead.position || "professionnels")
    .replace(/{signature}/g, "À bientôt,\n[Ton nom]");

  // Pour PROPOSAL, ajoute détails plan
  if (template === "PROPOSAL" && lead.score >= 70) {
    const plan = SUBSCRIPTION_PLANS.PRO;
    message = message
      .replace(/{plan}/g, plan.name)
      .replace(/{price}/g, plan.price.toString())
      .replace(/{features}/g, plan.features.map((f) => `✓ ${f}`).join("\n"));
  }

  return message;
}

/**
 * Crée ou met à jour un lead dans la DB
 */
export async function upsertLead(lead: Lead): Promise<Lead> {
  // Note: Nécessite ajout du model Lead dans Prisma
  // Pour l'instant, simulation

  console.log("💼 Lead enregistré:", lead);

  return {
    ...lead,
    id: lead.id || `LEAD-${Date.now()}`,
  };
}

/**
 * Relance automatique (basée sur statut)
 */
export async function scheduleFollowUp(
  leadId: string,
  daysBefore?: number
): Promise<{ scheduled: boolean; date: Date }> {
  const days = daysBefore || 7;
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + days);

  console.log(`📅 Relance programmée pour ${leadId} le ${followUpDate.toLocaleDateString()}`);

  // TODO: Implémenter queue system (BullMQ/Redis)
  // Pour l'instant, log uniquement

  return {
    scheduled: true,
    date: followUpDate,
  };
}

/**
 * Analyse du comportement prospect (scoring comportemental)
 */
export async function trackLeadBehavior(
  leadId: string,
  action: "PROFILE_VIEW" | "LINK_CLICK" | "EMAIL_OPEN" | "EMAIL_CLICK" | "DEMO_REQUEST"
): Promise<{ newScore: number }> {
  const scoreDeltas: Record<string, number> = {
    PROFILE_VIEW: +5,
    LINK_CLICK: +10,
    EMAIL_OPEN: +15,
    EMAIL_CLICK: +20,
    DEMO_REQUEST: +30,
  };

  const delta = scoreDeltas[action] || 0;

  console.log(`📊 Lead ${leadId}: ${action} (+${delta} points)`);

  // TODO: Update lead score in DB

  return { newScore: 50 + delta };
}

/**
 * Génère un pipeline de vente structuré
 */
export function generateSalesPipeline(): {
  stages: Array<{ name: string; description: string; avgDuration: number }>;
} {
  return {
    stages: [
      {
        name: "NEW",
        description: "Lead fraîchement identifié",
        avgDuration: 1,
      },
      {
        name: "CONTACTED",
        description: "Premier message envoyé",
        avgDuration: 3,
      },
      {
        name: "QUALIFIED",
        description: "Lead qualifié (score >60)",
        avgDuration: 5,
      },
      {
        name: "PROPOSAL",
        description: "Proposition commerciale envoyée",
        avgDuration: 7,
      },
      {
        name: "NEGOTIATION",
        description: "Négociation en cours",
        avgDuration: 10,
      },
      {
        name: "CLOSED_WON",
        description: "Client gagné 🎉",
        avgDuration: 0,
      },
      {
        name: "CLOSED_LOST",
        description: "Opportunité perdue",
        avgDuration: 0,
      },
    ],
  };
}





