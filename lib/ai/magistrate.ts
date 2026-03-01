import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma'; // Assuming standard prisma client setup

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export type Verdict = 'FULL_RELEASE' | 'FULL_REFUND' | 'SPLIT_50_50';

export interface MagistrateVerdict {
    verdict: Verdict;
    justification: string;
    confidenceScore: number;
}

export const validateProofOfWork = async (
    proofOfWorkUrl: string,
    initialPrompt: string,
    platform: string = 'LINKEDIN'
): Promise<{ isValid: boolean; score: number; feedback: string }> => {
    // Dans un système réel, ici on ferait un fetch/scrape de l'URL pour obtenir le contenu brut.
    // Pour cet exemple, on simule l'extraction du texte.
    const extractedContent = `[Contenu simulé provenant de ${proofOfWorkUrl}]`;

    const prompt = `
    Tu es le Magistrat IA de la plateforme ELA.
    Ta mission est d'évaluer le livrable d'un sous-traitant de manière objective.
    
    Consignes initiales du contrat (AI Prompt) :
    "${initialPrompt}"
    
    Livrable soumis (depuis ${proofOfWorkUrl}) :
    "${extractedContent}"
    
    Évalue si le livrable respecte les consignes.
    Format JSON attendu :
    {
       "isValid": true/false (true si le score est > 80),
       "score": 0-100,
       "feedback": "Explication claire et professionnelle du score"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { isValid: false, score: 0, feedback: "Erreur de format du Magistrat." };
    } catch (e) {
        console.error("Erreur Magistrate Validation:", e);
        return { isValid: false, score: 0, feedback: "Erreur interne du Magistrat." };
    }
};

export const resolveDispute = async (
    contractId: string,
    buyerEvidence: string,
    sellerEvidence: string,
    initialPrompt: string
): Promise<MagistrateVerdict> => {
    const prompt = `
    Tu es le Magistrat Suprême de la plateforme souveraine ELA.
    Tu dois trancher un litige commercial de manière incorruptible.
    
    Consigne initiale du contrat : "${initialPrompt}"
    
    Preuves de l'Acheteur : "${buyerEvidence}"
    Preuves du Vendeur : "${sellerEvidence}"
    
    Analyse les faits, détermine qui a tort et qui a raison.
    Tu dois rendre un des 3 verdicts stricts suivants :
    - FULL_RELEASE (L'argent va au vendeur)
    - FULL_REFUND (L'argent retourne à l'acheteur)
    - SPLIT_50_50 (Responsabilité partagée)
    
    Format JSON attendu :
    {
       "verdict": "FULL_RELEASE" | "FULL_REFUND" | "SPLIT_50_50",
       "justification": "Explication stricte et légale du verdict",
       "confidenceScore": 0-100
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as MagistrateVerdict;
        }
        return { verdict: 'SPLIT_50_50', justification: 'Erreur technique. Équité forcée.', confidenceScore: 0 };
    } catch (e) {
        console.error("Erreur Magistrate Dispute:", e);
        return { verdict: 'SPLIT_50_50', justification: 'Erreur de jugement IA.', confidenceScore: 0 };
    }
};
