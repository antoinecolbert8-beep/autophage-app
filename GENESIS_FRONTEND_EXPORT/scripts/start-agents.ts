/**
 * 🤖 Script de démarrage des agents autonomes
 * Usage: npm run agents:start
 */

import { SwarmOrchestrator } from "../lib/agents/swarm-orchestrator";
import { startSelfHealing } from "../lib/self-healing";

async function main() {
  console.log("🤖 Démarrage du système multi-agent...\n");

  // 1. Démarre le système d'auto-réparation
  console.log("🔧 Activation du système d'auto-réparation...");
  startSelfHealing();

  // 2. Démarre les agents
  const swarm = new SwarmOrchestrator();

  // Exécution immédiate
  console.log("\n🐝 Première exécution des agents...");
  await swarm.runAll();

  // Lance le cycle autonome (toutes les 6h)
  console.log("\n🔄 Activation du cycle autonome (toutes les 6h)...");
  await swarm.startAutonomousCycle(6);

  console.log("\n✅ Système multi-agent opérationnel !");
  console.log("📊 Les agents tournent en arrière-plan");
  console.log("⏱️ Prochaine exécution dans 6 heures");
}

main().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});





