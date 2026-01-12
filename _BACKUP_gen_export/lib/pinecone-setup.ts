/**
 * 🧠 Pinecone Setup - Configuration et initialisation de l'index vectoriel
 * Crée l'instance Pinecone si elle n'existe pas déjà
 */

import { Pinecone } from "@pinecone-database/pinecone";

const INDEX_NAME = "autophage-brain";
const DIMENSION = 512; // text-embedding-3-small dimensions

export async function initializePinecone() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

  try {
    // Vérifie si l'index existe déjà
    const indexes = await pc.listIndexes();
    const existingIndex = indexes.indexes?.find((idx) => idx.name === INDEX_NAME);

    if (existingIndex) {
      console.log(`✅ Index '${INDEX_NAME}' existe déjà`);
      return { success: true, message: "Index déjà configuré" };
    }

    // Crée l'index avec la spec serverless (recommandé)
    console.log(`🔨 Création de l'index '${INDEX_NAME}'...`);
    
    await pc.createIndex({
      name: INDEX_NAME,
      dimension: DIMENSION,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log(`✅ Index '${INDEX_NAME}' créé avec succès`);
    return { success: true, message: "Index créé" };
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation Pinecone:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Nettoie complètement l'index (à utiliser avec précaution)
 */
export async function clearPineconeIndex() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(INDEX_NAME);

  try {
    await index.deleteAll();
    console.log(`🗑️ Index '${INDEX_NAME}' nettoyé`);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Récupère les statistiques de l'index
 */
export async function getPineconeStats() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(INDEX_NAME);

  try {
    const stats = await index.describeIndexStats();
    return {
      success: true,
      stats: {
        totalVectors: stats.totalRecordCount,
        dimension: stats.dimension,
        namespaces: stats.namespaces,
      },
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stats:", error);
    return { success: false, error: (error as Error).message };
  }
}





