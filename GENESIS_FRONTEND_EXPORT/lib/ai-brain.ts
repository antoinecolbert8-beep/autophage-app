import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "mock-key" });
const INDEX_NAME = "autophage-brain";

/**
 * Génère une réponse en utilisant le contexte RAG Pinecone.
 * - embeddings 512d (text-embedding-3-small)
 * - topK configurable (par défaut 4)
 */
export async function generateSmartResponse(userPrompt: string, topK = 4) {
  const index = pc.index(INDEX_NAME);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userPrompt,
    dimensions: 512,
  });

  const queryResponse = await index.query({
    vector: embedding.data[0].embedding,
    topK,
    includeMetadata: true,
  });

  const context = queryResponse.matches
    .map((m) => m.metadata?.content)
    .filter(Boolean)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Tu es l'expert de la stratégie Autophage.
Utilise UNIQUEMENT ces extraits de connaissance : ${context}
Règles : ton direct, pas de remplissage, va droit au but avec des tactiques actionnables.`,
      },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0].message.content;
}

/**
 * Génère du copy pour landing page selon le style demandé
 * @param style - Style de copywriting: 'agressif', 'professionnel', 'amical'
 */
export async function generateLandingCopy(style: string = 'agressif') {
  const stylePrompts: Record<string, string> = {
    agressif: 'Ton ultra-direct, urgence maximale, FOMO, call-to-action percutants',
    professionnel: 'Ton corporate, data-driven, ROI focalisé, crédibilité',
    amical: 'Ton conversationnel, empathique, storytelling, connexion émotionnelle',
  };

  const prompt = `Génère un headline accrocheur et 3 bullet points pour une landing page SaaS.
Style requis: ${stylePrompts[style] || stylePrompts.agressif}

Format de réponse:
HEADLINE: [headline puissant]
BULLET1: [avantage 1]
BULLET2: [avantage 2]  
BULLET3: [avantage 3]`;

  return generateSmartResponse(prompt, 3);
}
