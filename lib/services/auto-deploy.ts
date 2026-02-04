import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

/**
 * 🚀 AUTO-DEPLOY TO VERCEL
 * Automatic production deployment after validated actions
 */

const DEPLOY_LOG = path.join(process.cwd(), '.vercel-deploys.json');

interface DeployLog {
    totalDeploys: number;
    lastDeploy?: {
        timestamp: string;
        url?: string;
        status: 'success' | 'failed';
    };
    deploys: Array<{
        timestamp: string;
        trigger: string;
        status: 'success' | 'failed';
        url?: string;
    }>;
}

/**
 * Load deploy history
 */
function loadDeployLog(): DeployLog {
    if (!fs.existsSync(DEPLOY_LOG)) {
        return {
            totalDeploys: 0,
            deploys: []
        };
    }
    return JSON.parse(fs.readFileSync(DEPLOY_LOG, 'utf-8'));
}

/**
 * Save deploy history
 */
function saveDeployLog(log: DeployLog) {
    fs.writeFileSync(DEPLOY_LOG, JSON.stringify(log, null, 2));
}

/**
 * Auto-deploy to Vercel (PRODUCTION)
 */
export async function autoDeployToVercel(trigger: string = 'auto'): Promise<boolean> {
    console.log("\n🚀 [AUTO-DEPLOY] Initiating Vercel deployment...");

    try {
        // Check if Vercel CLI is installed
        try {
            await execAsync('vercel --version');
        } catch (e) {
            console.warn("⚠️ Vercel CLI not installed.");
            console.log("Install: npm i -g vercel");
            console.log("Login: vercel login");
            return false;
        }

        // Deploy to production
        console.log("📦 Deploying to Vercel (production)...");
        const { stdout, stderr } = await execAsync('vercel --prod --yes', {
            cwd: process.cwd(),
            env: { ...process.env, CI: '1' }
        });

        // Extract deployment URL
        const urlMatch = stdout.match(/https:\/\/[^\s]+/);
        const deployUrl = urlMatch ? urlMatch[0] : undefined;

        console.log("✅ [DEPLOYED] Production URL:", deployUrl || 'pending');

        // Log the deployment
        const log = loadDeployLog();
        log.totalDeploys++;
        log.lastDeploy = {
            timestamp: new Date().toISOString(),
            url: deployUrl,
            status: 'success'
        };
        log.deploys.push({
            timestamp: new Date().toISOString(),
            trigger,
            status: 'success',
            url: deployUrl
        });
        saveDeployLog(log);

        return true;

    } catch (error: any) {
        console.error("❌ Deployment failed:", error.message);

        // Log the failure
        const log = loadDeployLog();
        log.deploys.push({
            timestamp: new Date().toISOString(),
            trigger,
            status: 'failed'
        });
        saveDeployLog(log);

        return false;
    }
}

/**
 * Check if auto-deploy should trigger
 */
export function shouldAutoDeploy(): boolean {
    const log = loadDeployLog();

    // Don't deploy if last deploy was less than 10 minutes ago
    if (log.lastDeploy) {
        const lastDeployTime = new Date(log.lastDeploy.timestamp).getTime();
        const now = Date.now();
        const minutesSinceLastDeploy = (now - lastDeployTime) / 1000 / 60;

        if (minutesSinceLastDeploy < 10) {
            console.log(`⏳ Last deploy was ${Math.floor(minutesSinceLastDeploy)}m ago, waiting...`);
            return false;
        }
    }

    return true;
}

/**
 * Get deployment stats
 */
export function getDeployStats() {
    const log = loadDeployLog();
    const successCount = log.deploys.filter(d => d.status === 'success').length;

    return {
        total: log.totalDeploys,
        successful: successCount,
        failed: log.deploys.length - successCount,
        lastDeploy: log.lastDeploy,
        recentDeploys: log.deploys.slice(-5)
    };
}
