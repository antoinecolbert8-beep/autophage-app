/**
 * 🐝 Swarm Orchestrator - Coordination des agents autonomes
 * Gère l'exécution et la communication entre agents
 */

import { BaseAgent } from "./base-agent";
import { TreasurerAgent } from "./treasurer-agent";
import { OpportunistAgent } from "./opportunist-agent";
import { ManagerAgent } from "./manager-agent";
import { CreatorAgent } from "./creator-agent";
import { SalesAgent } from "./sales-agent";
import { MarketingAgent } from "./marketing-agent";
import { PulseEngine } from "../realtime-pulse";

export class SwarmOrchestrator {
  private agents: BaseAgent[];

  constructor(customAgents?: BaseAgent[]) {
    this.agents = customAgents || [
      new TreasurerAgent(),
      new OpportunistAgent(),
      new ManagerAgent(),
      new CreatorAgent(),
      new SalesAgent(),
      new MarketingAgent()
    ];
  }

  /**
   * Exécute tous les agents en parallèle
   */
  async runAll() {
    console.log(`🐝 [Swarm] Démarrage de ${this.agents.length} agents...\n`);

    const results = await Promise.allSettled(
      this.agents.map(agent => agent.execute())
    );

    console.log("\n🐝 [Swarm] Cycle complet terminé");

    return results.map(r => r.status === "fulfilled" ? r.value : null);
  }

  /**
   * Exécute un agent spécifique
   */
  async runAgent(agentName: string) {
    const agent = this.agents.find(a => a.name.toLowerCase() === agentName.toLowerCase());
    if (!agent) {
      console.error(`❌ Agent ${agentName} non trouvé dans le swarm.`);
      return null;
    }
    console.log(`🐝 [Swarm] Exécution de ${agent.name}...`);
    const result = await agent.execute();
    PulseEngine.notifyAgent(agent.name);
    return result;
  }

  /**
   * Lance une campagne ciblée sur demande
   */
  async launchCampaign(topic: string) {
    console.log(`🐝 [Swarm] Lancement campagne manuelle sur: ${topic}`);
    const opportunist = this.agents.find(a => a.name === "Opportunist") as any;
    if (opportunist?.createTargetedCampaign) return await opportunist.createTargetedCampaign(topic);
    return null;
  }

  /**
   * Cycle automatique (cron)
   */
  async startAutonomousCycle(intervalHours: number = 6) {
    console.log(`🐝 [Swarm] Cycle autonome démarré (toutes les ${intervalHours}h)`);

    // Exécution immédiate
    await this.runAll();

    // Puis cycle régulier
    setInterval(
      async () => {
        console.log("\n🐝 [Swarm] Nouveau cycle automatique...");
        await this.runAll();
      },
      intervalHours * 60 * 60 * 1000
    );
  }

  /**
   * FLUX CONTINU (High Velocity)
   * Exécute les agents en boucle quasi-infinie
   */
  async startContinuousFlux(intervalMinutes: number = 2) {
    console.log(`🌊 [Swarm] Mode Flux Continu activé (toutes les ${intervalMinutes} min)`);

    const runLoop = async () => {
      console.log("\n⚡ [Flux] Cycle Haute Vélocité...");

      // Import autonomy monitoring
      const { autonomyMonitor } = await import('../services/autonomy-monitor');
      autonomyMonitor.recordCycleStart();

      try {
        await Promise.allSettled([
          // 1. Run Agents
          this.runAll(),

          // 2. Run Auto-SEO - Placeholder or dynamic require if needed
          (async () => {
             // SEO Flood logic would go here
          })(),

          // 3. AUTO-DEPLOY & GIT
          (async () => {
            try {
              const { autoCommitAndPush } = await import('../services/auto-git');
              await autoCommitAndPush(`Flux cycle #${autonomyMonitor.getMetrics().cyclesCompleted}`);
            } catch (e) {
              console.error("⚠️ Deploy/Git failed:", e);
            }
          })()
        ]);
      } catch (e) {
        console.error("⚠️ Global Flux loop failure:", e);
      }

      console.log(`⏳ Attente ${intervalMinutes}m avant prochain flux...`);
      setTimeout(runLoop, intervalMinutes * 60 * 1000);
    };

    await runLoop();
  }
}





