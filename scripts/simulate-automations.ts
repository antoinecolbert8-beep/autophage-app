/**
 * 🧪 SCRIPT DE SIMULATION D'AUTOMATISATIONS (Standalone)
 * Usage: npx ts-node scripts/simulate-automations.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Charger .env manuellement
try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && !process.env[key.trim()]) {
                process.env[key.trim()] = value.trim();
            }
        });
        console.log("✅ .env chargé");
    }
} catch (e) {
    console.warn("⚠️ Impossible de lire .env", e);
}

const MAKE_URL = process.env.N8N_WEBHOOK_URL || process.env.MAKE_ORCHESTRATOR_URL || process.env.MAKE_WEBHOOK_URL;

async function trigger(action: string, payload: any) {
    if (!MAKE_URL) {
        console.error("❌ Pas d'URL Make configurée");
        return;
    }

    console.log(`\n📤 Envoi [${action}]...`);

    try {
        const body = JSON.stringify({
            action,
            date: new Date().toISOString(),
            payload,
            userId: "simulation_script"
        });

        const url = new URL(MAKE_URL);

        const req = https.request({
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ Succès [${action}]`);
                } else {
                    console.error(`⚠️ Erreur ${res.statusCode}: ${data}`);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Erreur réseau: ${e.message}`);
        });

        req.write(body);
        req.end();

        // Attendre un peu
        await new Promise(r => setTimeout(r, 500));

    } catch (error) {
        console.error("❌ Erreur:", error);
    }
}

async function run() {
    console.log("🚀 SIMULATION EN COURS vers", MAKE_URL);

    await trigger("PUBLISH_SOCIAL_POST", { platform: "LINKEDIN", content: "Test Post", mediaUrls: [] });
    await trigger("SYNC_CRM", { provider: "HUBSPOT", lead: { email: "jean@dupont.com" } });
    await trigger("MAKE_OUTBOUND_CALL", { to: "+33612345678", message: "Hello World" });
    await trigger("GENERATE_SMART_RESPONSE", { prompt: "Test AI", topK: 3 });
    await trigger("GENERATE_SHORT_SCRIPT", { topic: "Automation" });
    await trigger("UPLOAD_YOUTUBE_VIDEO", { title: "Test Video", videoUrl: "http://test.com/vid.mp4" });
    await trigger("SEND_EMAIL", { email: "test@example.com", subject: "Test Mail", text: "Ceci est un test" });

    console.log("\n👋 Fin de la simulation.");
}

run();
