#!/usr/bin/env tsx

/**
 * 🎬 SCRIPT: Génération de YouTube Shorts
 * Usage: tsx scripts/generate-youtube-short.ts [topic]
 */

// Charger les variables d'environnement
import { config } from "dotenv";
import { resolve } from "path";

// Charger .env depuis la racine du projet
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

import { createAndUploadShort, generateViralShortsBatch } from "../lib/youtube-short-generator";

async function main() {
  const args = process.argv.slice(2);
  
  // Sujets par défaut si aucun argument
  const defaultTopics = [
    "Comment l'IA peut doubler vos revenus en 2025",
    "5 secrets que les entrepreneurs à succès ne disent jamais",
    "La technique secrète pour attirer 10,000 abonnés en 30 jours",
  ];

  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  🎬 GÉNÉRATEUR DE YOUTUBE SHORTS - AUTOPHAGE             ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");

  if (args.length === 0) {
    console.log("📋 Aucun sujet fourni. Génération en mode BATCH avec sujets par défaut...\n");
    
    const results = await generateViralShortsBatch(defaultTopics);
    
    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║  📊 RÉSULTATS BATCH                                      ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log(`✅ Réussis: ${results.filter(r => r.uploadStatus === "success").length}`);
    console.log(`❌ Échoués: ${results.filter(r => r.uploadStatus === "error").length}`);
    console.log(`📊 Total: ${results.length}`);
    
    results.forEach((result, index) => {
      const status = result.uploadStatus === "success" ? "✅" : "❌";
      console.log(`\n${status} Short ${index + 1}/${results.length}:`);
      console.log(`   Titre: ${result.script.title}`);
      console.log(`   YouTube ID: ${result.youtubeId || "N/A"}`);
    });
  } else {
    const topic = args.join(" ");
    console.log(`📝 Sujet: "${topic}"\n`);
    
    const result = await createAndUploadShort(topic);
    
    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║  🎉 RÉSULTAT                                             ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log(`Titre: ${result.script.title}`);
    console.log(`Hook: ${result.script.hook}`);
    console.log(`CTA: ${result.script.cta}`);
    console.log(`Hashtags: ${result.script.hashtags.join(" ")}`);
    console.log(`\nStatut: ${result.uploadStatus}`);
    console.log(`YouTube ID: ${result.youtubeId || "N/A"}`);
    
    if (result.youtubeId) {
      console.log(`\n🔗 Lien: https://youtube.com/shorts/${result.youtubeId}`);
    }
  }

  console.log("\n✅ Script terminé !");
}

main().catch(console.error);

