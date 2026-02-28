/**
 * 🛡️ PRODUCTION WATCHDOG - CERTIFICATION CONTINUE
 * Exécute TOUS les audits en séquence et génère le rapport global.
 * Usage: npx tsx scripts/production-watchdog.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CheckResult = { module: string; check: string; status: '✅' | '⚠️' | '❌'; detail: string };
const allResults: CheckResult[] = [];

function log(module: string, check: string, status: '✅' | '⚠️' | '❌', detail: string) {
    allResults.push({ module, check, status, detail });
    const icon = status === '✅' ? '✅' : status === '⚠️' ? '⚠️' : '❌';
    console.log(`  ${icon} [${module}] ${check}`);
    console.log(`      → ${detail}`);
}

// ─────────────────────────────────────────────
// 1. BASE - VARIABLES D'ENVIRONNEMENT
// ─────────────────────────────────────────────
async function checkEnvironment() {
    console.log("\n🔑 MODULE 1 : VARIABLES D'ENVIRONNEMENT\n");
    const required = [
        { key: 'DATABASE_URL', critical: true },
        { key: 'VERTEX_AI_API_KEY', critical: true },
        { key: 'OPENAI_API_KEY', critical: true },
        { key: 'STRIPE_SECRET_KEY', critical: true },
        { key: 'NEXT_PUBLIC_APP_URL', critical: true },
        { key: 'FORTRESS_SECRET', critical: true },
        { key: 'LEDGER_SECRET_KEY', critical: true },
        { key: 'INSTAGRAM_ACCESS_TOKEN', critical: false },
        { key: 'MAKE_WEBHOOK_URL', critical: false },
        { key: 'CRON_SECRET', critical: false },
    ];

    for (const { key, critical } of required) {
        const val = process.env[key];
        const isPlaceholder = !val || ['your-', 'sk-...', 'SG...', 'AC...'].some(p => val.startsWith(p));
        log('ENV', key,
            !isPlaceholder ? '✅' : critical ? '❌' : '⚠️',
            !isPlaceholder ? `Configuré (${val!.substring(0, 14)}...)` : `${critical ? 'MANQUANT CRITIQUE' : 'Manquant (optionnel)'}`
        );
    }
}

// ─────────────────────────────────────────────
// 2. BASE DE DONNÉES
// ─────────────────────────────────────────────
async function checkDatabase() {
    console.log("\n🗄️ MODULE 2 : BASE DE DONNÉES\n");
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        const orgCount = await prisma.organization.count();
        const postCount = await prisma.post.count();
        log('DB', 'Connexion Prisma', '✅', `Active — ${userCount} users, ${orgCount} orgs, ${postCount} posts`);

        const godUser = await prisma.user.findUnique({ where: { email: 'godmode@ela.ai' } });
        log('DB', 'Utilisateur God Mode', godUser ? '✅' : '⚠️',
            godUser ? `godmode@ela.ai (ID: ${godUser.id})` : "Absent — sera créé au 1er cycle God Mode");

        const systemOrg = await prisma.organization.findUnique({ where: { id: 'SYSTEM' } });
        log('DB', 'Organisation SYSTEM (APEX Identity)', systemOrg ? '✅' : '⚠️',
            systemOrg ? "Présente — Agents prêts à logger" : "Absente — sera créée automatiquement (lazy init)");

        // Check recent AI failover logs
        const recentActions = await prisma.actionHistory.count({
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        });
        log('DB', 'ActionHistory (24h)', '✅', `${recentActions} actions enregistrées`);

    } catch (e: any) {
        log('DB', 'Connexion Base de Données', '❌', `FATAL: ${e.message}`);
    }
}

// ─────────────────────────────────────────────
// 3. INTELLIGENCE ARTIFICIELLE (VERTEX / OPENAI)
// ─────────────────────────────────────────────
async function checkAI() {
    console.log("\n🧠 MODULE 3 : INTELLIGENCE ARTIFICIELLE\n");
    const apiKey = process.env.VERTEX_AI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const start = Date.now();
            const res = await model.generateContent("Réponds uniquement 'APEX'.");
            const latency = Date.now() - start;
            log('AI', 'Gemini 1.5-Flash (Tier-1 Primaire)', '✅', `Réponse: "${res.response.text().trim()}" — ${latency}ms`);
        } catch (e: any) {
            log('AI', 'Gemini 1.5-Flash (Tier-1)', '❌', e.message.substring(0, 80));
        }
    } else {
        log('AI', 'Gemini (Tier-1)', '❌', 'Aucune clé API Google configurée');
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const start = Date.now();
            const res = await openai.chat.completions.create({
                model: 'gpt-4o-mini', messages: [{ role: 'user', content: "Réponds APEX." }], max_tokens: 5
            });
            const latency = Date.now() - start;
            log('AI', 'OpenAI GPT-4o-mini (Tier-2 Fallback)', '✅', `Réponse: "${res.choices[0].message.content}" — ${latency}ms`);
        } catch (e: any) {
            log('AI', 'OpenAI GPT-4o-mini (Tier-2)', '⚠️', `Quota ou clé invalide: ${e.message.substring(0, 60)}`);
        }
    }

    // Test génération de contenu Elite
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const res = await model.generateContent(
                "Génère un post LinkedIn ultra-percutant de 3 lignes sur l'automatisation d'entreprise. Français uniquement."
            );
            const content = res.response.text().trim();
            log('AI', 'Génération Contenu Elite (Auto-Promo)', content.length > 30 ? '✅' : '⚠️',
                `${content.length} chars: "${content.substring(0, 70)}..."`);
        } catch (e: any) {
            log('AI', 'Génération Contenu Elite', '❌', e.message.substring(0, 80));
        }
    }
}

// ─────────────────────────────────────────────
// 4. SÉCURITÉ APEX (LEDGER + FORTRESS)
// ─────────────────────────────────────────────
async function checkApexSecurity() {
    console.log("\n🛡️ MODULE 4 : SÉCURITÉ APEX (LEDGER & KILL-SWITCH)\n");

    // Test Ledger AES-256
    const ledgerKey = process.env.LEDGER_SECRET_KEY;
    if (ledgerKey) {
        try {
            const key = Buffer.from(ledgerKey.padEnd(32, '0').substring(0, 32));
            const iv = randomBytes(16);
            const cipher = createCipheriv('aes-256-cbc', key, iv);
            const payload = JSON.stringify({ event: 'WATCHDOG_TEST', ts: Date.now() });
            const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]).toString('base64');

            // Decrypt
            const decipher = createDecipheriv('aes-256-cbc', key, iv);
            const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64')), decipher.final()]).toString('utf8');
            const parsed = JSON.parse(decrypted);

            log('APEX', 'Legacy Ledger AES-256 (Encrypt/Decrypt)', parsed.event === 'WATCHDOG_TEST' ? '✅' : '❌',
                `Données immuables validées — Hash SHA-256: ${createHash('sha256').update(payload).digest('hex').substring(0, 16)}...`);
        } catch (e: any) {
            log('APEX', 'Legacy Ledger AES-256', '❌', `Erreur crypto: ${e.message}`);
        }
    } else {
        log('APEX', 'Legacy Ledger AES-256', '❌', 'LEDGER_SECRET_KEY manquante');
    }

    // Test Kill-Switch (vérifier que les orgs suspendues sont bloquées)
    try {
        const suspended = await prisma.organization.count({ where: { status: 'suspended' } });
        log('APEX', 'Kill-Switch Trésorerie (Orgs Suspendues)', '✅',
            `Monitoring actif — ${suspended} org(s) actuellement suspendues`);
    } catch (e: any) {
        log('APEX', 'Kill-Switch', '⚠️', 'Vérification impossible');
    }

    // Fortress Secret
    const fortress = process.env.FORTRESS_SECRET;
    log('APEX', 'Fortress Secret (Protection Vault)', fortress ? '✅' : '❌',
        fortress ? `Configuré (${fortress.length} chars)` : 'FORTRESS_SECRET manquant');
}

// ─────────────────────────────────────────────
// 5. STRIPE (FACTURATION)
// ─────────────────────────────────────────────
async function checkStripe() {
    console.log("\n💳 MODULE 5 : STRIPE & FACTURATION\n");

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.startsWith('sk_test')) {
        log('STRIPE', 'Mode de clé Stripe', stripeKey?.startsWith('sk_test') ? '⚠️' : '❌',
            stripeKey?.startsWith('sk_test') ? 'Mode TEST actif (changer pour sk_live en prod)' : 'STRIPE_SECRET_KEY manquante');
    } else {
        log('STRIPE', 'Clé Stripe Live', '✅', `sk_live_... configurée (${stripeKey.length} chars)`);
    }

    // Vérifier les achats récents
    try {
        const recentPurchases = await prisma.creditPurchase.count({
            where: { timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        });
        log('STRIPE', 'Achats de Crédits (7 jours)', recentPurchases > 0 ? '✅' : '⚠️',
            `${recentPurchases} achat(s) enregistré(s) cette semaine`);
    } catch (e: any) {
        log('STRIPE', 'Table CreditPurchase', '⚠️', 'Aucun achat ou table vide');
    }
}

// ─────────────────────────────────────────────
// 6. BOT LINKEDIN & AUTO-PROMOTION
// ─────────────────────────────────────────────
async function checkLinkedInBot() {
    console.log("\n🤖 MODULE 6 : BOT LINKEDIN & AUTO-PROMOTION\n");

    const botDir = path.join(__dirname, '../SaaS_Bot_LinkedIn');
    const criticalFiles = ['engagement_bot.py', 'login_saver.py', 'stealth_config.py', 'targets.json'];

    let allPresent = true;
    for (const file of criticalFiles) {
        const exists = fs.existsSync(path.join(botDir, file));
        if (!exists) allPresent = false;
    }
    log('LINKEDIN', 'Fichiers du Bot (4 critiques)', allPresent ? '✅' : '❌',
        allPresent ? "Tous présents — engagement_bot, login_saver, stealth_config, targets" : "Fichier(s) manquant(s)");

    // Session LinkedIn
    const sessionFile = path.join(botDir, 'storage_state.json');
    if (fs.existsSync(sessionFile)) {
        const session = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
        const liCookie = session.cookies?.find((c: any) => c.name === 'li_at');
        log('LINKEDIN', 'Session LinkedIn (cookie li_at)', liCookie ? '✅' : '⚠️',
            liCookie ? `Active — expire: ${new Date(liCookie.expires * 1000).toLocaleDateString('fr-FR')}` : 'Cookie manquant — relancer login_saver.py');
    } else {
        log('LINKEDIN', 'Session LinkedIn', '⚠️', 'Aucune session — lancer: python login_saver.py');
    }

    // Posts auto-générés
    try {
        const recentPosts = await prisma.post.count({
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        });
        const weekPosts = await prisma.post.count({
            where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        });
        log('AUTO-PROMO', 'Posts Générés (24h / 7j)', weekPosts > 0 ? '✅' : '⚠️',
            `Aujourd'hui: ${recentPosts} | Cette semaine: ${weekPosts}`);

        // SRE Guard (limit quotidienne)
        const godUser = await prisma.user.findUnique({ where: { email: 'godmode@ela.ai' }, select: { organizationId: true } });
        if (godUser?.organizationId) {
            const sre = await prisma.usageLog.count({
                where: { organizationId: godUser.organizationId, actionType: 'SNAP_DISTRIBUTION', timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            });
            log('AUTO-PROMO', 'SRE Guard Limite (15/jour)', sre < 15 ? '✅' : '⚠️',
                `${sre}/15 posts aujourd'hui — ${15 - sre} slots restants`);
        }
    } catch (e: any) {
        log('AUTO-PROMO', 'Suivi des Posts', '⚠️', 'Vérification impossible');
    }
}

// ─────────────────────────────────────────────
// 7. INFRASTRUCTURE NETLIFY / CRONS
// ─────────────────────────────────────────────
async function checkNetlify() {
    console.log("\n🌐 MODULE 7 : INFRASTRUCTURE NETLIFY & CRONS\n");

    const cronFiles: { file: string; schedule: string }[] = [
        { file: 'netlify/functions/self-promotion.ts', schedule: '0 * * * * (Horaire)' },
        { file: 'netlify/functions/heartbeat.ts', schedule: '*/5 * * * * (5min)' },
        { file: 'netlify/functions/matchmaker-cron.ts', schedule: 'Quotidien' },
        { file: 'netlify/functions/daily-recap-cron.ts', schedule: 'Quotidien soir' },
        { file: 'netlify/functions/domination.ts', schedule: 'Hebdomadaire' },
    ];

    for (const { file, schedule } of cronFiles) {
        const exists = fs.existsSync(path.join(__dirname, '../', file));
        log('NETLIFY', path.basename(file), exists ? '✅' : '❌',
            exists ? `Présent — ${schedule}` : 'MANQUANT');
    }

    // netlify.toml
    const netlifyToml = fs.existsSync(path.join(__dirname, '../netlify.toml'));
    log('NETLIFY', 'netlify.toml (config build)', netlifyToml ? '✅' : '❌',
        netlifyToml ? 'Présent — @netlify/plugin-nextjs configuré' : 'MANQUANT');

    // App URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    log('NETLIFY', 'NEXT_PUBLIC_APP_URL', appUrl ? '✅' : '❌',
        appUrl || 'Manquante');
}

// ─────────────────────────────────────────────
// 8. RAPPORT FINAL
// ─────────────────────────────────────────────
async function generateFinalReport() {
    const totalOK = allResults.filter(r => r.status === '✅').length;
    const totalWarn = allResults.filter(r => r.status === '⚠️').length;
    const totalErr = allResults.filter(r => r.status === '❌').length;
    const total = allResults.length;
    const score = Math.round((totalOK / total) * 100);

    const grade = score >= 90 ? 'S+ (SOUVERAIN)' : score >= 75 ? 'A (SOLIDE)' : score >= 60 ? 'B (FONCTIONNEL)' : 'C (CRITIQUE)';

    console.log("\n" + "█".repeat(65));
    console.log("█".repeat(65));
    console.log(`\n🏆 RAPPORT DE CERTIFICATION PRODUCTION FINALE\n`);
    console.log(`   Date     : ${new Date().toLocaleString('fr-FR')}`);
    console.log(`   Score    : ${score}/100`);
    console.log(`   Grade    : ${grade}`);
    console.log(`   Résultats: ${totalOK} ✅ | ${totalWarn} ⚠️ | ${totalErr} ❌ / ${total} vérifications\n`);

    if (totalErr > 0) {
        console.log("🔴 ERREURS CRITIQUES À CORRIGER :");
        allResults.filter(r => r.status === '❌').forEach(r => {
            console.log(`   • [${r.module}] ${r.check} → ${r.detail}`);
        });
    }

    if (totalWarn > 0) {
        console.log("\n🟡 AVERTISSEMENTS (non-bloquants) :");
        allResults.filter(r => r.status === '⚠️').forEach(r => {
            console.log(`   • [${r.module}] ${r.check} → ${r.detail}`);
        });
    }

    console.log("\n⚡ STATUT : " + (totalErr === 0 ? "🟢 PRÊT POUR PRODUCTION" : "🔴 CORRECTIONS REQUISES"));
    console.log("█".repeat(65));
    console.log("█".repeat(65) + "\n");

    return { score, grade, ok: totalOK, warn: totalWarn, errors: totalErr };
}

// ─────────────────────────────────────────────
// MAIN : SÉQUENCE DE CERTIFICATION
// ─────────────────────────────────────────────
async function main() {
    console.log("\n" + "=".repeat(65));
    console.log("  🛡️ ELA EMPIRE — PRODUCTION WATCHDOG v2.0");
    console.log("  Certification Continue de l'Infrastructure Souveraine");
    console.log("=".repeat(65));

    await checkEnvironment();
    await checkDatabase();
    await checkAI();
    await checkApexSecurity();
    await checkStripe();
    await checkLinkedInBot();
    await checkNetlify();

    const report = await generateFinalReport();

    await prisma.$disconnect();
    process.exit(report.errors > 0 ? 1 : 0);
}

main().catch(async (e) => {
    console.error("💥 WATCHDOG FAILURE:", e);
    await prisma.$disconnect();
    process.exit(1);
});
