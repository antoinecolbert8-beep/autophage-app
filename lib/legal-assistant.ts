/**
 * ⚖️ Legal Assistant - Module juridique et administratif
 * Génération de documents légaux, conseil juridique
 */

import { getOpenAIClient } from "./ai/openai-client";

export type LegalDocumentType =
  | "CONTRACT"
  | "NDA"
  | "STATUTS"
  | "PV_AG"
  | "CGV"
  | "RGPD"
  | "EMPLOYMENT_CONTRACT";

/**
 * Génère un document juridique
 */
export async function generateLegalDocument(
  type: LegalDocumentType,
  params: Record<string, any>
): Promise<{ content: string; warnings: string[] }> {
  const prompts: Record<LegalDocumentType, string> = {
    CONTRACT: `Rédige un contrat de prestation de services entre ${params.company1} et ${params.company2}.
Durée: ${params.duration || "12 mois"}
Montant: ${params.amount}€
Objet: ${params.object}`,

    NDA: `Rédige un accord de confidentialité (NDA) entre ${params.party1} et ${params.party2}.
Durée: ${params.duration || "2 ans"}
Périmètre: ${params.scope}`,

    STATUTS: `Rédige les statuts d'une ${params.companyType || "SAS"} nommée ${params.companyName}.
Capital: ${params.capital}€
Siège: ${params.address}
Activité: ${params.activity}`,

    PV_AG: `Rédige un procès-verbal d'assemblée générale pour ${params.companyName}.
Date: ${params.date}
Décisions: ${params.decisions.join(", ")}`,

    CGV: `Rédige des conditions générales de vente pour ${params.companyName}.
Activité: ${params.activity}
Modalités de paiement: ${params.paymentTerms}`,

    RGPD: `Rédige une politique de confidentialité RGPD pour ${params.companyName}.
Données collectées: ${params.dataCollected.join(", ")}
DPO: ${params.dpo || "Non désigné"}`,

    EMPLOYMENT_CONTRACT: `Rédige un contrat de travail ${params.contractType || "CDI"}.
Employeur: ${params.employer}
Poste: ${params.position}
Salaire: ${params.salary}€`,
  };

  const prompt = prompts[type];

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant juridique spécialisé en droit français.
Rédige des documents légaux précis, conformes au Code civil, Code du travail et Code de commerce.
Utilise un langage juridique clair mais accessible.
Ajoute des clauses standards essentielles.
IMPORTANT: Précise toujours qu'une relecture par un avocat est recommandée.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content || "";

    const warnings = [
      "⚠️ Ce document est généré par IA et doit être relu par un avocat",
      "⚠️ Adapte les clauses selon ta situation spécifique",
      "⚠️ Vérifie la conformité avec les lois en vigueur",
    ];

    return { content, warnings };
  } catch (error) {
    throw new Error(`Erreur génération document: ${(error as Error).message}`);
  }
}

/**
 * Conseil juridique (Q&A)
 */
export async function legalAdvice(question: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un conseiller juridique expert en droit français.
Réponds aux questions en citant les articles de loi pertinents (Code civil, Code du travail, Code de commerce).
Sois précis mais accessible.
Précise toujours les limites de ton conseil et recommande de consulter un avocat pour des cas complexes.`,
        },
        { role: "user", content: question },
      ],
    });

    return completion.choices[0].message.content || "Désolé, je n'ai pas pu traiter cette question juridique.";
  } catch (error) {
    throw new Error(`Erreur conseil juridique: ${(error as Error).message}`);
  }
}

/**
 * Simplification de texte juridique
 */
export async function simplifyLegalText(legalText: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu traduis le jargon juridique en langage simple et accessible, sans perdre le sens légal.",
        },
        {
          role: "user",
          content: `Simplifie ce texte juridique:\n\n${legalText}`,
        },
      ],
    });

    return completion.choices[0].message.content || legalText;
  } catch (error) {
    throw new Error(`Erreur simplification: ${(error as Error).message}`);
  }
}





