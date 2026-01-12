import { DataSyncWorker } from '@/lib/supabase/sync';
import { executeMarketDominationWorkflow } from '@/lib/workflows/market-domination';
import { prisma } from '@/lib/prisma';
import { IgnitionManager } from '@/lib/god-mode/tactical/ignition-manager';
import { LinkedInWarMachine } from '@/lib/god-mode/tactical/linkedin-machine';
import { FinancialWarEngine } from '@/lib/god-mode/financial-engine';
import { TreasuryGuard } from '@/lib/god-mode/treasury-guard';

const ignitionManager = new IgnitionManager();
const linkedInMachine = new LinkedInWarMachine();
const financialEngine = new FinancialWarEngine();
const treasuryGuard = TreasuryGuard.getInstance();

// Extended DataSyncWorker with market domination cycle
export class UnifiedDominationWorker extends DataSyncWorker {
    private dominationInterval: NodeJS.Timeout | null = null;

    startDominationCycle(intervalMs: number = 300000) { // 5 minutes default
        if (this.dominationInterval) return;

        console.log('🔥 Unified Domination Cycle started');

        this.dominationInterval = setInterval(async () => {
            await this.executeDominationCycle();
        }, intervalMs);

        // Start base sync worker too
        this.start(5000);
    }

    stopDomination() {
        if (this.dominationInterval) {
            clearInterval(this.dominationInterval);
            this.dominationInterval = null;
        }
        this.stop();
        console.log('⏸️ Domination cycle stopped');
    }

    private async executeDominationCycle() {
        try {
            console.log('🔄 Executing domination cycle...');

            // 1. Find high-priority keywords not yet processed
            const opportunities = await prisma.keywordOpportunity.findMany({
                where: {
                    priority: { gte: 70 },
                    status: 'pending',
                },
                orderBy: { priority: 'desc' },
                take: 3, // Process top 3 per cycle
            });

            for (const opp of opportunities) {
                console.log(`Processing: ${opp.keyword} (priority: ${opp.priority})`);

                // Execute full workflow
                const result = await executeMarketDominationWorkflow(
                    opp.keyword,
                    opp.projectId
                );
                if (result.success) {
                    // Mark as processed
                    await prisma.keywordOpportunity.update({
                        where: { id: opp.id },
                        data: { status: 'in-progress' },
                    });

                    console.log(`✅ Workflow completed for ${opp.keyword}`);
                }
            }

            // B. GOD MODE: Ignition (Viral Injection)
            await this.executeGodModeIgnition();

            // C. GOD MODE: B2B Sniper
            await this.executeGodModeSniper();

            // D. GOD MODE: Financial Treasury (Daily/Hourly Check)
            await this.executeTreasuryProtocols();

            // 2. Execute pending distribution tasks
            await this.executeDistributionTasks();

            // 3. Execute pending outreach tasks
            await this.executeOutreachTasks();

            // 4. Update heatmap data
            await this.updateDominationHeatmap();

        } catch (error) {
            console.error('Domination cycle error:', error);
        }
    }

    private async executeDistributionTasks() {
        const tasks = await prisma.aIActionLog.findMany({
            where: {
                actionType: 'social_distribution',
                status: 'pending',
            },
            take: 10,
        });

        for (const task of tasks) {
            // In production, would call actual social APIs
            console.log(`📤 Distributing to ${(task.decisionReasoning as any)?.platform}`);

            await prisma.aIActionLog.update({
                where: { id: task.id },
                data: { status: 'completed', executedAt: new Date() },
            });
        }
    }

    private async executeOutreachTasks() {
        const tasks = await prisma.aIActionLog.findMany({
            where: {
                actionType: 'influencer_outreach',
                status: 'pending',
            },
            take: 5,
        });

        for (const task of tasks) {
            // In production, would send actual emails
            console.log(`📧 Sending outreach for ${task.entityId}`);

            await prisma.aIActionLog.update({
                where: { id: task.id },
                data: { status: 'completed', executedAt: new Date() },
            });
        }
    }

    private async updateDominationHeatmap() {
        // Calculate domination metrics
        const stats = await this.calculateDominationStats();

        // Store in analytics
        await prisma.analyticsSnapshot.create({
            data: {
                organizationId: 'demo-org',
                period: 'hourly',
                timestamp: new Date(),
                metrics: JSON.stringify(stats),
            },
        });

        console.log(`📊 Heatmap updated: ${stats.keywordsCaptured} keywords captured`);
    }

    private async calculateDominationStats() {
        const [keywords, content, actions] = await Promise.all([
            prisma.keywordOpportunity.count({
                where: { status: 'in-progress' },
            }),
            prisma.contentAsset.count({
                where: { publishedAt: { not: null } },
            }),
            prisma.aIActionLog.count({
                where: { status: 'completed' },
            }),
        ]);

        return {
            keywordsCaptured: keywords,
            contentPublished: content,
            actionsExecuted: actions,
            estimatedReach: keywords * 10000, // Approximation
            dominationScore: Math.min((keywords / 100) * 100, 100),
        };
    }

    private async executeGodModeIgnition() {
        // "La Meute" sur les posts NEW
        const newPosts = await prisma.post.findMany({
            where: { status: 'PUBLISHED', createdAt: { gt: new Date(Date.now() - 300000) } }, // Last 5 mins
            take: 5
        });

        for (const post of newPosts) {
            // Trigger Ignition if not already done
            await ignitionManager.triggerThePack(post.id, ['growth', 'saas']);
        }

        // Traffic Hijacking (Simulé sur concurrents)
        // await ignitionManager.hijackTraffic("competitor_post_id", "context");
    }

    private async executeGodModeSniper() {
        // LinkedIn Warmachine sur leads HOT
        const hotLeads = await prisma.lead.findMany({
            where: { stage: 'hot' },
            take: 3
        });

        for (const lead of hotLeads) {
            // Mock profile URL logic
            const profileUrl = `https://linkedin.com/in/${lead.name?.replace(/\s+/g, '').toLowerCase()}`;
            await linkedInMachine.executeWarmIntro(profileUrl, lead.id);
        }
    }

    private async executeTreasuryProtocols() {
        // Check Treasury Guard (Kill Switch)
        const orgs = await prisma.organization.findMany({ where: { status: 'active' }, take: 5 });

        for (const org of orgs) {
            const healthy = await treasuryGuard.checkHealth(org.id);
            if (!healthy) continue;

            // Run Financial Engine (Allocation)
            // Mock ROAS/Revenue
            await financialEngine.executeTreasuryProtocol({
                dailyRevenue: 1500, // Mock
                currentROAS: 3.5,
                opCoBalance: 75000,
                holdCoBalance: 0
            });
        }
    }
}

export const unifiedWorker = new UnifiedDominationWorker();
