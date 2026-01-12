/**
 * Script d'initialisation ChromaDB
 * Usage: npm run setup:chromadb
 */

import { initializeChromaDB, getChromaStats } from "../lib/chromadb-client";

async function main() {
  console.log("🧠 Initialisation de ChromaDB (Alternative souveraine à Pinecone)...\n");

  // Initialise la collection
  const initResult = await initializeChromaDB();

  if (!initResult.success) {
    console.error("❌ Erreur:", initResult.error);
    console.log("\n💡 Assure-toi que ChromaDB tourne:");
    console.log("   docker-compose up -d chromadb");
    process.exit(1);
  }

  console.log("✅ Collection initialisée");

  // Affiche les stats
  console.log("\n📊 Statistiques:");
  const stats = await getChromaStats();
  console.log(stats);

  console.log("\n🎉 ChromaDB prêt à l'emploi !");
  console.log("📍 URL: http://localhost:8000");
  console.log("\n💡 Prochaine étape: Ingère des documents avec npm run ingest");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Erreur:", err);
    process.exit(1);
  });





