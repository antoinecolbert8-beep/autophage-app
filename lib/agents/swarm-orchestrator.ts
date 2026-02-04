/**
 * 🐝 Swarm Orchestrator - Coordination des agents autonomes
 * Gère l'exécution et la communication entre agents
 */

import { TreasurerAgent } from "./treasurer-agent";
import { OpportunistAgent } from "./opportunist-agent";
import { ManagerAgent } from "./manager-agent";
import { CreatorAgent } from "./creator-agent";
import { SalesAgent } from "./sales-agent";
import { PulseEngine } from "../realtime-pulse";
import { executeMarketDominationWorkflow } from '../workflows/market-domination';
// Using require to avoid TS path issues with scripts/lib duality if needed, 
// or relative import if tsconfig allows. Let's try relative import first assuming standard structure.
// Actually, scripts are outside lib, so we might need relative path ../../scripts/seo-flood
// BUT usually importing script logic is bad practice. Proper way is to move logic to lib.
// For speed, let's use dynamic import or replicate logic. 
// Re-implementing logic lightly here to keep it clean in Lib.
import { getRealTrends } from "../services/real-trends";

export class SwarmOrchestrator {
  private agents: {
    treasurer: TreasurerAgent;
    opportunist: OpportunistAgent;
    manager: ManagerAgent;
    creator: CreatorAgent;
    sales: SalesAgent;
  };

  constructor() {
    this.agents = {
      treasurer: new TreasurerAgent(),
      opportunist: new OpportunistAgent(),
      manager: new ManagerAgent(),
      creator: new CreatorAgent(),
      sales: new SalesAgent(),
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
      this.agents.sales.execute(),
    ]);

    console.log("\n🐝 [Swarm] Cycle complet terminé");

    return {
      treasurer: results[0].status === "fulfilled" ? results[0].value : null,
      opportunist: results[1].status === "fulfilled" ? results[1].value : null,
      manager: results[2].status === "fulfilled" ? results[2].value : null,
      creator: results[3].status === "fulfilled" ? results[3].value : null,
      sales: results[4].status === "fulfilled" ? results[4].value : null,
    };
  }

  /**
   * Exécute un agent spécifique
   */
  async runAgent(agentName: keyof typeof this.agents) {
    console.log(`🐝 [Swarm] Exécution de ${agentName}...`);
    const result = await this.agents[agentName].execute();
    PulseEngine.notifyAgent(agentName.charAt(0).toUpperCase() + agentName.slice(1));
    return result;
  }

  /**
   * Lance une campagne ciblée sur demande
   */
  async launchCampaign(topic: string) {
    console.log(`🐝 [Swarm] Lancement campagne manuelle sur: ${topic}`);
    return await this.agents.opportunist.createTargetedCampaign(topic);
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

      let cycleSuccess = true;

      // 1. Run Agents
      try {
        await this.runAll();
      } catch (e) {
        console.error("⚠️ Agent execution failed:", e);
        cycleSuccess = false;
      }

      // 2. Run Auto-SEO (Embedded Logic for speed)
      try {
        // Dynamic import of the script function we just exported
        const seoFlood = require('../../scripts/seo-flood');
        if (seoFlood && seoFlood.runHighVolumeSEO) {
          await seoFlood.runHighVolumeSEO();
        }
      } catch (e) {
        console.error("⚠️ SEO Flood trigger failed:", e);
        autonomyMonitor.recordFailure('seo');
      }

      // 3. Run Video Flood (Omni-Channel)
      try {
        const videoFlood = require('../../scripts/video-flood');
        if (videoFlood && videoFlood.runVideoFlood) {
          await videoFlood.runVideoFlood();
        }
      } catch (e) {
        console.error("⚠️ Video Flood trigger failed:", e);
        autonomyMonitor.recordFailure('video');
      }

      // 4. AUTO-DEPLOY TO VERCEL (Production)
      try {
        const { autoDeployToVercel, shouldAutoDeploy, getDeployStats } = await import('../services/auto-deploy');

        if (shouldAutoDeploy()) {
          console.log("\n🚀 [AUTO-DEPLOY] Triggering production deployment...");
          const deployed = await autoDeployToVercel('continuous-flux');

          if (deployed) {
            const stats = getDeployStats();
            console.log(`✅ Deploy #${stats.total} SUCCESS`);
            console.log(`   URL: ${stats.lastDeploy?.url || 'pending'}`);
          }
        } else {
          console.log("🕒 Skipping deploy (rate limit)");
        }
      } catch (e: any) {
        console.error("⚠️ Auto-deploy failed:", e.message);
        autonomyMonitor.recordFailure('deploy');
      }

      // 5. AUTO-GIT COMMIT (Version Control)
      try {
        const { autoCommitAndPush } = await import('../services/auto-git');
        await autoCommitAndPush(`Flux cycle #${autonomyMonitor.getMetrics().cyclesCompleted}`);
      } catch (e: any) {
        console.error("⚠️ Auto-git failed:", e.message);
        autonomyMonitor.recordFailure('git');
      }

      // Record cycle completion
      autonomyMonitor.recordCycleComplete(cycleSuccess);
      autonomyMonitor.displayStatus();

      // 6. MARKET DOMINATION WORKFLOW (Every 10 cycles)
      const cycleCount = autonomyMonitor.getMetrics().cyclesCompleted;
      if (cycleCount % 10 === 0) {
        try {
          console.log("\n🎯 [MARKET DOMINATION] Executing full workflow...");
          const firstOrg = await (await import('@prisma/client')).PrismaClient.prototype.organization.findFirst();
          const firstProject = await (await import('@prisma/client')).PrismaClient.prototype.project.findFirst();

          if (firstProject) {
            const result = await executeMarketDominationWorkflow(
              'AI Marketing Automation',
              firstProject.id
            );
            console.log(`✅ Market Domination: ${result.success ? 'SUCCESS' : 'FAILED'}`);
          }
        } catch (e: any) {
          console.error("⚠️ Market Domination failed:", e.message);
        }
      }

      console.log(`⏳ Attente ${intervalMinutes}m avant prochain flux...`);
      setTimeout(runLoop, intervalMinutes * 60 * 1000);
    };

    await runLoop();
  }
}





