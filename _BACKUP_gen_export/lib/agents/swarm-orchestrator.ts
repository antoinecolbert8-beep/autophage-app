/**
 * 🐝 Swarm Orchestrator - Coordination des agents autonomes
 * Gère l'exécution et la communication entre agents
 */

import { TreasurerAgent } from "./treasurer-agent";
import { OpportunistAgent } from "./opportunist-agent";
import { ManagerAgent } from "./manager-agent";
import { CreatorAgent } from "./creator-agent";

export class SwarmOrchestrator {
  private agents: {
    treasurer: TreasurerAgent;
    opportunist: OpportunistAgent;
    manager: ManagerAgent;
    creator: CreatorAgent;
  };

  constructor() {
    this.agents = {
      treasurer: new TreasurerAgent(),
      opportunist: new OpportunistAgent(),
      manager: new ManagerAgent(),
      creator: new CreatorAgent(),
    };
  }

  /**
   * Exécute tous les agents en parallèle
   */
  async runAll() {
    console.log("🐝 [Swarm] Démarrage de tous les agents...\n");

    const results = await Promise.allSettled([
      this.agents.treasurer.execute(),
      this.agents.opportunist.execute(),
      this.agents.manager.execute(),
      this.agents.creator.execute(),
    ]);

    console.log("\n🐝 [Swarm] Cycle complet terminé");

    return {
      treasurer: results[0].status === "fulfilled" ? results[0].value : null,
      opportunist: results[1].status === "fulfilled" ? results[1].value : null,
      manager: results[2].status === "fulfilled" ? results[2].value : null,
      creator: results[3].status === "fulfilled" ? results[3].value : null,
    };
  }

  /**
   * Exécute un agent spécifique
   */
  async runAgent(agentName: keyof typeof this.agents) {
    console.log(`🐝 [Swarm] Exécution de ${agentName}...`);
    return await this.agents[agentName].execute();
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
}





