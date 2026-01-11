/**
 * Script d'ingestion de connaissances dans Pinecone
 * Usage: npx tsx scripts/ingest-knowledge.ts
 * 
 * Place tes PDF/TXT/MD dans le dossier ./data avant de lancer ce script
 */

import { ingestLocalDocs } from "../lib/pinecone-ingest";
import { getPineconeStats } from "../lib/pinecone-setup";

async function main() {
  console.log("📚 Ingestion de la base de connaissances...\n");

  // Stats avant ingestion
  console.log("📊 État de l'index AVANT ingestion:");
  const statsBefore = await getPineconeStats();
  console.log(statsBefore);

  // Ingestion
  console.log("\n🔄 Démarrage de l'ingestion...");
  const result = await ingestLocalDocs();

  if (result.success) {
    console.log(`\n✅ ${result.count} documents traités avec succès`);
  } else {
    console.error(`\n❌ Erreur: ${result.error}`);
  }

  // Stats après ingestion
  console.log("\n📊 État de l'index APRÈS ingestion:");
  const statsAfter = await getPineconeStats();
  console.log(statsAfter);
}

main()
  .then(() => {
    console.log("\n✅ Ingestion terminée");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Erreur fatale:", err);
    process.exit(1);
  });





