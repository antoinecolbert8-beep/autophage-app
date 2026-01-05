"use server"
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function ingestSpecsAction() {
  try {
    const index = pc.index("autophage-brain");

    const modules = [
      {
        id: "mod-1",
        text: `MODULE 1 : ONBOARDING & INPUT (L'Acquisition Sans Friction)
        L'objectif : Convertir un visiteur en utilisateur actif en moins de 30 secondes.
        1. Extraction URL-to-Profile : L'utilisateur colle simplement l'URL de son LinkedIn, Instagram ou site web.
        2. Brand Morphing (UI Polymorphe) : L'interface du SaaS change instantanément de couleurs, de logo et de typographie.`
      },
      {
        id: "mod-2",
        text: `MODULE 2 : CONTENT FACTORY (Le Moteur de Production)
        L'objectif : Créer du contenu infini, varié et intelligent.
        1. Matrice Combinatoire d'idées : Algorithme croisant [Cibles] x [Problèmes] x [Angles] pour garantir des années de contenu.
        2. Scénarisation via Agents Adversaires : Un agent écrit le script, un agent le critique, le script est réécrit automatiquement.`
      },
      {
        id: "mod-3",
        text: `MODULE 3 : VIRALITY ENGINEERING (L'Optimisation Dopamine)
        L'objectif : Maximiser le watchtime et le taux de partage.
        1. Montage Dynamique (Attention Hack) : Suppression automatique des silences, changement de plan toutes les 2.5 secondes.
        2. Injection de Sons Viraux : Détection des musiques Trending sur TikTok/Reels.`
      }
    ];

    for (const mod of modules) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: mod.text,
        dimensions: 512, // Indispensable pour ton index AWS à 512d
      });

      const vector = embeddingResponse.data[0].embedding;

      await index.upsert([{
        id: mod.id,
        values: vector,
        metadata: { content: mod.text }
      }]);
    }
    return { success: true };
  } catch (error) {
    console.error("Erreur d'ingestion :", error);
    return { success: false };
  }
}
