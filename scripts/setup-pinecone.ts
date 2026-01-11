/**
 * Script d'initialisation Pinecone
 * Usage: npx tsx scripts/setup-pinecone.ts
 */

import { initializePinecone, getPineconeStats } from "../lib/pinecone-setup";

async function main() {
  console.log("🚀 Initialisation de Pinecone...\n");

  // Initialise l'index
  const initResult = await initializePinecone();
  console.log(initResult);

  // Affiche les stats
  console.log("\n📊 Statistiques de l'index:");
  const statsResult = await getPineconeStats();
  console.log(statsResult);
}

main()
  .then(() => {
    console.log("\n✅ Configuration Pinecone terminée");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Erreur:", err);
    process.exit(1);
  });





