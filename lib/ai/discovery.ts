import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export interface IntentSearchResult {
  listingId: string;
  score: number;
}

/**
 * Moteur de Découverte Sémantique : Convertit l'intention en vecteur
 * et recherche les listings les plus pertinents (Simulation basique sur SQLite).
 */
export const searchByIntent = async (userIntent: string, topK: number = 10): Promise<IntentSearchResult[]> => {
  try {
    // 1. Convert the intent into a vector embedding
    const result = await embeddingModel.embedContent(userIntent);
    const queryVector = result.embedding.values;

    // 2. Récupération des annonces (Dans une vraie app avec Pinecone/PGVector, on ferait une Query vectorielle classique).
    // Sur SQLite, on simule en récupérant les annonces actives et en calculant la distance cosine basique si les vecteurs étaient stockés localement, ou on utilise le LLM pour faire du reranking.
    const allListings = await prisma.marketplaceListing.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, title: true, description: true, category: true, tags: true }
    });

    if (allListings.length === 0) return [];

    // Reranking via Gemini (Alternative à PGVector pour ce démonstrateur SQLite)
    const prompt = `
      Tu es le Moteur de Découverte Sémantique ELA.
      L'utilisateur recherche l'intention suivante : "${userIntent}"
      
      Voici la liste des annonces disponibles :
      ${JSON.stringify(allListings)}

      Retourne un tableau JSON ordonné des ${topK} meilleures annonces qui matchent l'intention de l'utilisateur (même si les mots clés diffèrent).
      Le format strict est : [{"listingId": "id", "score": 95}, ...] où le score est entre 0 et 100.
    `;

    const rankingResponse = await geminiFlash.generateContent(prompt);
    const jsonMatch = rankingResponse.response.text().match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as IntentSearchResult[];
    }

    return [];

  } catch (e) {
    console.error("Discovery Engine Error:", e);
    return [];
  }
};

/**
 * Le Traducteur de Réalité (Polyglot Native)
 * Traduction à la volée invisible pour l'utilisateur.
 */
export const nativeTranslate = async (content: string, targetLanguage: string): Promise<string> => {
  // Si la langue cible n'est pas spécifiée, ou c'est la même langue détectée (géré en amont), on ne fait rien.
  const prompt = `
      Traduis le contenu suivant de manière native, fluide et professionnelle en ${targetLanguage}. 
      Garde le ton intact (s'il est clivant, reste clivant). Ne rajoute aucun préambule, juste le contenu traduit.
      Contenu :
      "${content}"
    `;

  try {
    const response = await geminiFlash.generateContent(prompt);
    return response.response.text().trim();
  } catch (e) {
    console.error("Native Translation Error:", e);
    return content; // Fallback to original
  }
};

/**
 * Le "Matchmaker" Proactif
 * Envoie des notifications pour des correspondances idéales basées sur l'AI Profile
 */
export const proactiveMatchmaker = async (orgId: string): Promise<string[]> => {
  // 1. Récupérer le contexte de l'orga (son historique, ses besoins)
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { aiProfile: true }
  });

  if (!org) return [];

  const prompt = `
      Tu es le Matchmaker Proactif d'ELA. 
      Analyse l'Organisation. Son style de contenu est : ${org.aiProfile?.contentStyle}.
      Elle a généré ${org.aiProfile?.publishCount} posts.
      
      Génère une proposition clivante (SOVEREIGN) pour lui suggérer 3 profils de sous-traitants (ex: "J'ai trouvé 3 profils qui correspondent exactement à votre besoin de croissance pour le mois prochain. Voulez-vous que je lance les contrats ?")
      Sois convaincant et mystérieux. Maximum 2 ou 3 phrases.
    `;

  try {
    const response = await geminiFlash.generateContent(prompt);
    return [response.response.text().trim()];
    // Note: Dans un système complet, ça renverrait de vrais objets "Listing" présélectionnés.
  } catch (e) {
    console.error("Proactive Matchmaker Error:", e);
    return [];
  }
};
