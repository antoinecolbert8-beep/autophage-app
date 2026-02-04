import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

/**
 * 🔄 AUTO-GIT COMMIT & PUSH
 * Automatic version control - zero manual git commands
 */

const GIT_LOG = path.join(process.cwd(), '.auto-git.json');

interface GitLog {
    totalCommits: number;
    lastCommit?: {
        timestamp: string;
        hash?: string;
        message: string;
    };
}

function loadGitLog(): GitLog {
    if (!fs.existsSync(GIT_LOG)) {
        return { totalCommits: 0 };
    }
    return JSON.parse(fs.readFileSync(GIT_LOG, 'utf-8'));
}

function saveGitLog(log: GitLog) {
    fs.writeFileSync(GIT_LOG, JSON.stringify(log, null, 2));
}

/**
 * Auto-commit and push changes
 */
export async function autoCommitAndPush(message: string): Promise<boolean> {
    console.log("\n📝 [AUTO-GIT] Committing changes...");

    try {
        // Check if git is initialized
        const gitExists = fs.existsSync(path.join(process.cwd(), '.git'));
        if (!gitExists) {
            console.log("⚠️ Git not initialized, skipping commit");
            return false;
        }

        // Check if there are changes
        const { stdout: statusOut } = await execAsync('git status --porcelain');
        if (!statusOut.trim()) {
            console.log("✅ No changes to commit");
            return true;
        }

        // Add all changes
        await execAsync('git add .');

        // Commit with auto-generated message
        const commitMessage = `[AUTO] ${message} - ${new Date().toISOString()}`;
        await execAsync(`git commit -m "${commitMessage}"`);

        // Get commit hash
        const { stdout: hashOut } = await execAsync('git rev-parse HEAD');
        const hash = hashOut.trim().substring(0, 7);

        console.log(`✅ Committed: ${hash} - ${commitMessage}`);

        // Try to push (non-blocking if fails)
        try {
            await execAsync('git push');
            console.log("✅ Pushed to remote");
        } catch (e) {
            console.warn("⚠️ Push failed (no remote or auth issue) - commit is local");
        }

        // Log the commit
        const log = loadGitLog();
        log.totalCommits++;
        log.lastCommit = {
            timestamp: new Date().toISOString(),
            hash,
            message: commitMessage
        };
        saveGitLog(log);

        return true;

    } catch (error: any) {
        console.error("❌ Git operation failed:", error.message);
        return false;
    }
}

/**
 * Check git stats
 */
export function getGitStats() {
    return loadGitLog();
}
