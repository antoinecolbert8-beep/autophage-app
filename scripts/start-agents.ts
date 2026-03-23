import 'dotenv/config';
/**
 * 🤖 Script de démarrage des agents autonomes
 * Usage: npm run agents:start
 */

import { SwarmOrchestrator } from "../lib/agents/swarm-orchestrator";
import { MarketingAgent } from "../lib/agents/marketing-agent";
import { OpportunistAgent } from "../lib/agents/opportunist-agent";
import { ManagerAgent } from "../lib/agents/manager-agent"; // Assuming these are needed based on the diff
import { CreatorAgent } from "../lib/agents/creator-agent"; // Assuming these are needed based on the diff
import { SalesAgent } from "../lib/agents/sales-agent"; // Assuming these are needed based on the diff
import { startSelfHealing } from "../lib/self-healing";
import { ELASelfPromoter } from "../lib/god-mode/self-promotion";
import { socialWorker } from "../lib/queue/social-worker";

async function main() {
  console.log("🤖 Démarrage du système multi-agent (Enterprise Mode)...\n");

  // 0. Activation du Worker Social (BullMQ)
  console.log("👷 Initialisation du Worker Social...");
  socialWorker?.on('ready', () => console.log("✅ Worker Social prêt et à l'écoute."));

  // 1. Démarre le système d'auto-réparation
  console.log("🔧 Activation du système d'auto-réparation...");
  startSelfHealing();

  // 2. Démarre les agents (Swarm) - MODE HAUTE VELOCITE
  console.log("\n🐝 Démarrage du Swarm (Continuous Flux Mode)...");
  const agents = [
    new ManagerAgent(),
    new CreatorAgent(),
    new SalesAgent(),
    new MarketingAgent(),
    new OpportunistAgent(),
  ];
  const swarm = new SwarmOrchestrator(agents); // Pass agents to the orchestrator
  // On lance le cycle continu (toutes les 2 min)
  await swarm.startContinuousFlux(2);

  // 3. Démarre l'Auto-Promotion (God Mode)
  console.log("\n🚀 Activation du God Mode (High Frequency)...");
  // Exécution immédiate
  await ELASelfPromoter.orchestrateHourlyCheck();

  // Cycle Rapide (10 min)
  setInterval(async () => {
    console.log("\n🚀 [God Mode] Check de domination...");
    await ELASelfPromoter.orchestrateHourlyCheck();
  }, 10 * 60 * 1000);

  console.log("\n✅ Système multi-agent en mode FLUX CONTINU !");
  console.log("🌊 Agents & SEO: toutes les 2 min | God Mode: toutes les 10 min");
}

main().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});





