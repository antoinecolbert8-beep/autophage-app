/**
 * 🧠 ChromaDB Client - Alternative souveraine à Pinecone
 * Base vectorielle auto-hébergée, zéro dépendance externe
 */

import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import OpenAI from "openai";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const COLLECTION_NAME = "autophage-brain";

const chromaClient = new ChromaClient({ path: CHROMA_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to get embedding function
const getEmbeddingFunction = () => {
  return new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY!,
    openai_model: "text-embedding-3-small",
  });
};

/**
 * Initialise la collection ChromaDB
 */
export async function initializeChromaDB() {
  const embeddingFunction = getEmbeddingFunction();
  try {
    // Essaie de récupérer la collection existante
    let collection;
    try {
      collection = await chromaClient.getCollection({
        name: COLLECTION_NAME,
        embeddingFunction
      });
      console.log(`✅ Collection '${COLLECTION_NAME}' existe déjà`);
    } catch {
      // Crée la collection si elle n'existe pas
      collection = await chromaClient.createCollection({
        name: COLLECTION_NAME,
        embeddingFunction,
      });
      console.log(`✅ Collection '${COLLECTION_NAME}' créée`);
    }

    return { success: true, collection };
  } catch (error) {
    console.error("❌ Erreur ChromaDB:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Ajoute des documents à ChromaDB
 */
export async function addDocuments(
  documents: Array<{ id: string; text: string; metadata?: Record<string, any> }>
) {
  try {
    const collection = await chromaClient.getCollection({
      name: COLLECTION_NAME,
      embeddingFunction: getEmbeddingFunction()
    });

    await collection.add({
      ids: documents.map((d) => d.id),
      documents: documents.map((d) => d.text),
      metadatas: documents.map((d) => d.metadata || {}),
    });

    console.log(`✅ ${documents.length} documents ajoutés à ChromaDB`);
    return { success: true, count: documents.length };
  } catch (error) {
    console.error("❌ Erreur ajout documents:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Recherche sémantique dans ChromaDB
 */
export async function queryChromaDB(query: string, topK: number = 5) {
  try {
    const collection = await chromaClient.getCollection({
      name: COLLECTION_NAME,
      embeddingFunction: getEmbeddingFunction()
    });

    const results = await collection.query({
      queryTexts: [query],
      nResults: topK,
    });

    // Handle results safely - Chroma results structure has changed in recent versions
    // Assuming structure: { documents: [[...]], metadatas: [[...]], distances: [[...]] }
    const documents = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];
    const distances = results.distances?.[0] || [];

    return {
      success: true,
      results: documents.map((doc, i) => ({
        content: doc,
        metadata: metadatas[i] || {},
        score: 1 - (distances[i] || 0), // Convert distance to similarity
      })),
    };
  } catch (error) {
    console.error("❌ Erreur query ChromaDB:", error);
    return { success: false, error: (error as Error).message, results: [] };
  }
}

/**
 * Génère une réponse avec RAG ChromaDB
 */
export async function generateWithChromaRAG(userPrompt: string, topK: number = 4) {
  try {
    // Recherche dans ChromaDB
    const searchResults = await queryChromaDB(userPrompt, topK);

    if (!searchResults.success) {
      throw new Error(searchResults.error);
    }

    // Construit le contexte
    const context = searchResults.results
      .map((r) => r.content)
      .filter(Boolean)
      .join("\n\n");

    // Génère la réponse avec GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es l'expert de la stratégie Autophage.
Utilise UNIQUEMENT ce contexte : ${context}
Règles : ton direct, pas de blabla, tactiques actionnables.`,
        },
        { role: "user", content: userPrompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Erreur RAG ChromaDB:", error);
    throw error;
  }
}

/**
 * Statistiques de la collection
 */
export async function getChromaStats() {
  try {
    const collection = await chromaClient.getCollection({
      name: COLLECTION_NAME,
      embeddingFunction: getEmbeddingFunction()
    });
    const count = await collection.count();

    return {
      success: true,
      stats: {
        totalDocuments: count,
        collectionName: COLLECTION_NAME,
        type: "ChromaDB (Souverain)",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
