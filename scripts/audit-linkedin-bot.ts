import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * 🤖 AUDIT BOT LINKEDIN (APEX CERTIFICATION)
 */
async function auditLinkedInBot() {
    console.log("\n///  🤖 AUDIT BOT DÉMARCHAGE LINKEDIN  ///\n");

    const botDir = path.join(__dirname, '../SaaS_Bot_LinkedIn');
    const results: { check: string; status: '✅' | '⚠️' | '❌'; detail: string }[] = [];

    // 1. Vérification de l'existence du dossier
    const botExists = fs.existsSync(botDir);
    results.push({
        check: "Dossier SaaS_Bot_LinkedIn",
        status: botExists ? '✅' : '❌',
        detail: botExists ? `Trouvé à ${botDir}` : "MANQUANT - Repository corrompu"
    });

    if (!botExists) {
        printResults(results);
        return;
    }

    // 2. Vérification des fichiers critiques
    const criticalFiles = [
        'engagement_bot.py', 'login_saver.py', 'stealth_config.py',
        'autopilot.py', 'worker.py', 'requirements.txt', 'targets.json'
    ];
    for (const file of criticalFiles) {
        const filePath = path.join(botDir, file);
        const exists = fs.existsSync(filePath);
        results.push({
            check: `Fichier: ${file}`,
            status: exists ? '✅' : '❌',
            detail: exists ? `Présent (${fs.statSync(filePath).size} bytes)` : "MANQUANT"
        });
    }

    // 3. Vérification de la session LinkedIn (storage_state.json)
    const sessionFile = path.join(botDir, 'storage_state.json');
    if (fs.existsSync(sessionFile)) {
        try {
            const session = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
            const hasCookies = session.cookies && session.cookies.length > 0;
            const liCookie = session.cookies?.find((c: any) => c.name === 'li_at');
            results.push({
                check: "Session LinkedIn (storage_state.json)",
                status: liCookie ? '✅' : '⚠️',
                detail: liCookie
                    ? `Session active - Cookie li_at présent (expire: ${new Date(liCookie.expires * 1000).toLocaleDateString()})`
                    : `Session fichier présent mais cookie li_at manquant (${session.cookies?.length || 0} cookies)`
            });
        } catch (e) {
            results.push({
                check: "Session LinkedIn",
                status: '❌',
                detail: "Fichier storage_state.json corrompu"
            });
        }
    } else {
        results.push({
            check: "Session LinkedIn (storage_state.json)",
            status: '⚠️',
            detail: "Pas de session sauvegardée. Lancer: python login_saver.py"
        });
    }

    // 4. Vérification des cibles
    const targetsFile = path.join(botDir, 'targets.json');
    if (fs.existsSync(targetsFile)) {
        const targets = JSON.parse(fs.readFileSync(targetsFile, 'utf-8'));
        results.push({
            check: "Cibles de démarchage (targets.json)",
            status: targets.profiles?.length > 0 ? '✅' : '⚠️',
            detail: `${targets.profiles?.length || 0} profils, ${targets.posts?.length || 0} posts à surveiller`
        });
    }

    // 5. Vérification Python et Playwright
    const { execSync } = require('child_process');
    const pythonChecks = ['python3 --version', 'python --version'];
    let pythonFound = false;
    for (const cmd of pythonChecks) {
        try {
            const version = execSync(cmd, { stdio: 'pipe' }).toString().trim();
            results.push({ check: "Python", status: '✅', detail: version });
            pythonFound = true;
            break;
        } catch (e) { }
    }
    if (!pythonFound) {
        results.push({ check: "Python", status: '❌', detail: "Non installé. Requis pour le bot." });
    }

    // 6. Vérification clé Instagram (même compte)
    const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    results.push({
        check: "Token Instagram (Auto-Post)",
        status: instagramToken && instagramToken.length > 50 ? '✅' : '⚠️',
        detail: instagramToken ? `Token présent (${instagramToken.length} chars)` : "INSTAGRAM_ACCESS_TOKEN manquant"
    });

    printResults(results);
    return results;
}

function printResults(results: { check: string; status: string; detail: string }[]) {
    console.log("=".repeat(65));
    results.forEach(r => {
        console.log(`${r.status}  ${r.check}`);
        console.log(`     → ${r.detail}\n`);
    });
    console.log("=".repeat(65));
    const ok = results.filter(r => r.status === '✅').length;
    const warn = results.filter(r => r.status === '⚠️').length;
    const err = results.filter(r => r.status === '❌').length;
    console.log(`\nRésumé: ${ok} ✅ | ${warn} ⚠️ | ${err} ❌\n`);
    return { ok, warn, err };
}

auditLinkedInBot().catch(console.error);
