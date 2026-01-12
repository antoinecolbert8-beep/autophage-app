/**
 * Script de feedback loop (à lancer en cron hebdomadaire)
 * Usage: npx tsx scripts/run-feedback-loop.ts
 */

import { analyzeFeedback, applyFeedback } from "../lib/feedback-loop";

async function main() {
  console.log("🔄 Lancement du Feedback Loop (Auto-amélioration)...\n");

  const platforms = ["LINKEDIN", "TIKTOK"];

  for (const platform of platforms) {
    console.log(`\n📊 Analyse de ${platform}:`);

    const analysis = await analyzeFeedback(platform);

    console.log(`\n✅ Patterns identifiés (${analysis.topPatterns.length}):`);
    analysis.topPatterns.forEach((pattern, i) => {
      console.log(`  ${i + 1}. ${pattern}`);
    });

    console.log(`\n💡 Recommandations (${analysis.recommendations.length}):`);
    analysis.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });

    console.log(`\n📈 Confiance: ${analysis.confidence}%`);

    // Applique si confiance >= 60%
    if (analysis.confidence >= 60) {
      console.log("\n🔄 Application du nouveau prompt système...");
      await applyFeedback(analysis);
      console.log("✅ Prompt mis à jour avec succès");
    } else {
      console.log("\n⚠️ Confiance trop faible, pas de mise à jour");
    }

    console.log("\n" + "=".repeat(60));
  }

  console.log("\n✅ Feedback Loop terminé");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erreur:", err);
    process.exit(1);
  });





