/**
 * 💼 Sales Automation - Prospection et vente d'abonnements
 * Délégué à Make.com via Conductor Pattern
 */

import { PrismaClient } from "@prisma/client"; // Gardé si utilisé ailleurs pour les types, mais logic déplacée
import { triggerAutomation } from "./automations";

const prisma = new PrismaClient();

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
 * Qualifie un lead (via Make AI)
 */
export async function qualifyLead(lead: Partial<Lead>): Promise<number> {
  // On envoie à Make pour scoring avancé (enrichissement Clearbit/Dropcontact + GPT)
  const result = await triggerAutomation("QUALIFY_LEAD_AI", { lead });

  if (result.success && typeof result.data?.score === 'number') {
    return result.data.score;
  }

  // Fallback si échec
  console.warn("⚠️ Qualification Make échouée, fallback local");
  return 50;
}

/**
 * Génère un message de prospection personnalisé (via Make AI)
 */
export async function generateProspectMessage(
  lead: Lead,
  template: "INTRODUCTION" | "FOLLOW_UP" | "PROPOSAL"
): Promise<string> {
  const result = await triggerAutomation("GENERATE_PROSPECT_MESSAGE", {
    lead,
    template
  });

  if (result.success && result.data?.message) {
    return result.data.message;
  }

  return "Erreur lors de la génération du message.";
}

/**
 * Crée ou met à jour un lead (Sync CRM/DB via Make)
 */
export async function upsertLead(lead: Lead): Promise<Lead> {
  const result = await triggerAutomation("UPSERT_LEAD_CRM", { lead });

  if (result.success && result.data?.lead) {
    console.log("💼 Lead upserted via Make:", result.data.lead.id);
    return { ...lead, ...result.data.lead };
  }

  console.log("💼 Make upsert request sent, assuming success for async flow.");
  return { ...lead, id: lead.id || "pending_make_id" };
}

/**
 * Relance automatique (Schedule via Make)
 */
export async function scheduleFollowUp(
  leadId: string,
  daysBefore?: number
): Promise<{ scheduled: boolean; date: Date }> {
  const days = daysBefore || 7;
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + days);

  const result = await triggerAutomation("SCHEDULE_FOLLOW_UP", {
    leadId,
    date: followUpDate.toISOString()
  });

  return {
    scheduled: result.success,
    date: followUpDate,
  };
}

/**
 * Analyse du comportement prospect
 */
export async function trackLeadBehavior(
  leadId: string,
  action: "PROFILE_VIEW" | "LINK_CLICK" | "EMAIL_OPEN" | "EMAIL_CLICK" | "DEMO_REQUEST"
): Promise<{ newScore: number }> {

  const result = await triggerAutomation("TRACK_LEAD_EVENT", {
    leadId,
    action,
    timestamp: new Date().toISOString()
  });

  if (result.success && result.data?.newScore) {
    return { newScore: result.data.newScore };
  }

  return { newScore: 50 }; // Default/Unchanged
}

/**
 * Envoie une invitation LinkedIn (Démarchage Automatique)
 * Nécessite un outil tiers connecté à Make (ex: Phantombuster, Unipile, Waalaxy)
 */
export async function sendLinkedInInvitation(leadId: string, linkedinUrl: string, message?: string): Promise<{ success: boolean }> {
  const result = await triggerAutomation("SEND_LINKEDIN_INVITE", {
    leadId,
    linkedinUrl,
    message,
    note: message // Alias souvent utilisé
  });

  return { success: result.success };
}

/**
 * Envoie un message privé LinkedIn (DM)
 * Nécessite que le prospect soit déjà connexion de 1er degré
 */
export async function sendLinkedInMessage(leadId: string, linkedinUrl: string, message: string): Promise<{ success: boolean }> {
  const result = await triggerAutomation("SEND_LINKEDIN_DM", {
    leadId,
    linkedinUrl,
    message
  });

  return { success: result.success };
}

/**
 * Génère un pipeline de vente structuré (Données statiques)
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
