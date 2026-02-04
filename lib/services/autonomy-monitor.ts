/**
 * 🛡️ AUTONOMY MONITOR
 * Tracks system health and ensures 100% autonomous operation
 */

export interface AutonomyMetrics {
    uptime: number; // seconds since system start
    cyclesCompleted: number;
    lastCycleSuccess: boolean;
    failures: {
        seo: number;
        video: number;
        deploy: number;
        git: number;
    };
    autonomyScore: number; // 0-100%
    status: 'autonomous' | 'degraded' | 'failed';
}

class AutonomyMonitor {
    private startTime: number;
    private metrics: AutonomyMetrics;

    constructor() {
        this.startTime = Date.now();
        this.metrics = {
            uptime: 0,
            cyclesCompleted: 0,
            lastCycleSuccess: true,
            failures: { seo: 0, video: 0, deploy: 0, git: 0 },
            autonomyScore: 100,
            status: 'autonomous'
        };
    }

    recordCycleStart() {
        this.metrics.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    }

    recordCycleComplete(success: boolean) {
        this.metrics.cyclesCompleted++;
        this.metrics.lastCycleSuccess = success;
        this.updateAutonomyScore();
    }

    recordFailure(component: keyof AutonomyMetrics['failures']) {
        this.metrics.failures[component]++;
        this.updateAutonomyScore();
    }

    private updateAutonomyScore() {
        const totalFailures = Object.values(this.metrics.failures).reduce((a, b) => a + b, 0);
        const failureRate = totalFailures / Math.max(this.metrics.cyclesCompleted, 1);

        // Score degrades with failure rate
        this.metrics.autonomyScore = Math.max(0, Math.floor(100 - (failureRate * 100)));

        // Update status
        if (this.metrics.autonomyScore > 80) {
            this.metrics.status = 'autonomous';
        } else if (this.metrics.autonomyScore > 50) {
            this.metrics.status = 'degraded';
        } else {
            this.metrics.status = 'failed';
        }
    }

    getMetrics(): AutonomyMetrics {
        return { ...this.metrics };
    }

    displayStatus() {
        const m = this.metrics;
        const hours = Math.floor(m.uptime / 3600);
        const minutes = Math.floor((m.uptime % 3600) / 60);

        console.log("\n" + "=".repeat(50));
        console.log("🤖 AUTONOMY STATUS");
        console.log("=".repeat(50));
        console.log(`Status: ${this.getStatusEmoji()} ${m.status.toUpperCase()}`);
        console.log(`Score: ${m.autonomyScore}%`);
        console.log(`Uptime: ${hours}h ${minutes}m`);
        console.log(`Cycles: ${m.cyclesCompleted}`);
        console.log(`Failures: SEO(${m.failures.seo}) Video(${m.failures.video}) Deploy(${m.failures.deploy}) Git(${m.failures.git})`);
        console.log("=".repeat(50) + "\n");
    }

    private getStatusEmoji(): string {
        switch (this.metrics.status) {
            case 'autonomous': return '🟢';
            case 'degraded': return '🟡';
            case 'failed': return '🔴';
        }
    }
}

export const autonomyMonitor = new AutonomyMonitor();
