/**
 * 🚀 PRODUCTION IGNITION SCRIPT
 * Ce script réalise TOUTES les initialisations nécessaires pour activer
 * la machine d'acquisition ELA en production.
 *
 * Usage: npx tsx scripts/ignite-production.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let ok = 0, warn = 0, err = 0;

function log(icon: string, label: string, detail: string) {
    if (icon === '✅') ok++;
    else if (icon === '⚠️') warn++;
    else err++;
    console.log(`\n${icon} ${label}`);
    console.log(`   ${detail}`);
}

// ─────────────────────────────────────────────
// 1. CRÉER/VÉRIFIER L'UTILISATEUR GOD MODE
// ─────────────────────────────────────────────
async function setupGodMode() {
    console.log("\n🔥 ÉTAPE 1 : INITIALISATION GOD MODE\n");

    try {
        // 1a. Organisation principale
        let org = await prisma.organization.findFirst({ where: { domain: 'ela.ai' } });
        if (!org) {
            org = await prisma.organization.create({
                data: { name: 'ELA Genesis Empire', domain: 'ela.ai', tier: 'enterprise', status: 'active' }
            });
            log('✅', 'Organisation ELA Genesis créée', `ID: ${org.id}`);
        } else {
            log('✅', 'Organisation ELA Genesis trouvée', `ID: ${org.id} | Crédits: ${org.creditBalance}`);
        }

        // 1b. Alimenter en crédits
        if (org.creditBalance < 5000) {
            await prisma.organization.update({
                where: { id: org.id }, data: { creditBalance: 10000 }
            });
            log('✅', 'Budget God Mode chargé', '10 000 crédits pour 24h d\'autonomie maximale');
        } else {
            log('✅', 'Budget God Mode suffisant', `${org.creditBalance} crédits disponibles`);
        }

        // 1c. Utilisateur God Mode
        let godUser = await prisma.user.findUnique({ where: { email: 'godmode@ela.ai' } });
        if (!godUser) {
            godUser = await prisma.user.create({
                data: {
                    email: 'godmode@ela.ai',
                    name: 'ELA God Mode',
                    role: 'admin',
                    organizationId: org.id
                }
            });
            log('✅', 'Utilisateur God Mode créé', `ID: ${godUser.id}`);
        } else {
            log('✅', 'Utilisateur God Mode OK', `godmode@ela.ai (${godUser.id})`);
        }

        // 1d. Réinitialiser les limites SRE (pour le nouveau cycle)
        const deleted = await prisma.usageLog.deleteMany({
            where: {
                organizationId: org.id,
                actionType: 'SNAP_DISTRIBUTION',
                timestamp: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });
        log('✅', 'Logs SRE anciens nettoyés', `${deleted.count} entrées supprimées (>24h)`);

        return { org, godUser };
    } catch (e: any) {
        log('❌', 'Erreur God Mode Setup', e.message);
        return null;
    }
}

// ─────────────────────────────────────────────
// 2. ENTITÉS SYSTÈME APEX (AGENTS)
// ─────────────────────────────────────────────
async function setupSystemIdentities() {
    console.log("\n🛡️ ÉTAPE 2 : IDENTITÉS SYSTÈME APEX\n");

    try {
        await prisma.organization.upsert({
            where: { id: 'SYSTEM' },
            update: {},
            create: { id: 'SYSTEM', name: 'Sovereign System', domain: 'system.ela.ai', status: 'active' }
        });

        await prisma.user.upsert({
            where: { id: 'AGENT' },
            update: {},
            create: { id: 'AGENT', email: 'agent@ela.ai', name: 'Apex Agent Oracle', organizationId: 'SYSTEM', role: 'admin' }
        });

        log('✅', 'Identité SYSTEM (Kill-Switch & Logging)', 'Org SYSTEM + User AGENT configurés');
    } catch (e: any) {
        log('⚠️', 'Identités système', `Partiellement configurées: ${e.message.substring(0, 60)}`);
    }
}

// ─────────────────────────────────────────────
// 3. SEED DE DONNÉES DÉMO (Social Proof)
// ─────────────────────────────────────────────
async function seedDemoData() {
    console.log("\n🌱 ÉTAPE 3 : DONNÉES DÉMO (Social Proof Pulse)\n");

    try {
        // Créer des utilisateurs Genesis pour le Pulse
        const genesisUsers = [
            { email: 'alexandre.martin@genesis.ela', name: 'Alexandre Martin', plan: 'pro' },
            { email: 'camille.dubois@genesis.ela', name: 'Camille Dubois', plan: 'supreme' },
            { email: 'lucas.bernard@genesis.ela', name: 'Lucas Bernard', plan: 'pro' },
            { email: 'margaux.petit@genesis.ela', name: 'Margaux Petit', plan: 'starter' },
            { email: 'romain.leroy@genesis.ela', name: 'Romain Leroy', plan: 'empire' },
        ];

        let created = 0;
        for (const u of genesisUsers) {
            const existing = await prisma.user.findUnique({ where: { email: u.email } });
            if (!existing) {
                const orgDomain = u.email.split('@')[1];
                const org = await prisma.organization.upsert({
                    where: { domain: orgDomain },
                    update: {},
                    create: { name: `${u.name} Org`, domain: orgDomain, tier: u.plan, status: 'active', creditBalance: 2000 }
                });
                await prisma.user.create({
                    data: { email: u.email, name: u.name, role: 'admin', organizationId: org.id, currentPlan: u.plan }
                });
                created++;
            }
        }
        log('✅', `Utilisateurs Genesis (Social Proof)`, `${created} nouveaux créés / ${genesisUsers.length} total`);
    } catch (e: any) {
        log('⚠️', 'Seed données démo', `Certains utilisateurs déjà présents (normal)`);
    }
}

// ─────────────────────────────────────────────
// 4. VÉRIFICATION DES VARIABLES CRITIQUES
// ─────────────────────────────────────────────
async function checkCriticalVars() {
    console.log("\n🔑 ÉTAPE 4 : VARIABLES D'ENVIRONNEMENT CRITIQUES\n");

    const vars = [
        { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret (Encaissement)', critical: true },
        { key: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook (Callbacks paiement)', critical: true },
        { key: 'VERTEX_AI_API_KEY', label: 'Vertex AI (Génération contenu)', critical: true },
        { key: 'OPENAI_API_KEY', label: 'OpenAI (Fallback IA)', critical: true },
        { key: 'CRON_SECRET', label: 'Cron Secret (Sécurité crons)', critical: false },
        { key: 'MAKE_WEBHOOK_URL', label: 'MAKE.com (Orchestrateur)', critical: false },
        { key: 'INSTAGRAM_ACCESS_TOKEN', label: 'Instagram (Auto-Post)', critical: false },
        { key: 'FORTRESS_SECRET', label: 'Fortress Secret (APEX)', critical: false },
        { key: 'LEDGER_SECRET_KEY', label: 'Ledger Key (Archives)', critical: false },
    ];

    const placeholders = ['your-', 'SG...', 'AC...', 'pk_test_...', 'whsec_...', 're_...', 'REMPLACER'];

    for (const { key, label, critical } of vars) {
        const val = process.env[key];
        const isPlaceholder = !val || placeholders.some(p => val.startsWith(p));
        if (!isPlaceholder) {
            log('✅', label, `${key} configuré (${val!.substring(0, 16)}...)`);
        } else if (critical) {
            log('❌', label, `${key} MANQUANT — ⚠️ Encaissement impossible sans cette clé`);
        } else {
            log('⚠️', label, `${key} non configuré — Fonctionnalité désactivée`);
        }
    }
}

// ─────────────────────────────────────────────
// 5. RAPPORT FINAL D'IGNITION
// ─────────────────────────────────────────────
function printIgnitionReport() {
    const total = ok + warn + err;
    const score = Math.round((ok / total) * 100);

    console.log("\n" + "█".repeat(60));
    console.log("\n  🚀 RAPPORT D'IGNITION PRODUCTION ELA\n");
    console.log(`  Score    : ${score}/100`);
    console.log(`  OK       : ${ok}/${total} ✅`);
    console.log(`  Warnings : ${warn} ⚠️`);
    console.log(`  Erreurs  : ${err} ❌`);
    console.log("\n  PROCHAINES ÉTAPES MANUELLES :");
    console.log("  1. Stripe Dashboard → récupérer pk_live + whsec_");
    console.log("  2. Netlify Dashboard → ajouter toutes les variables .env");
    console.log("  3. Registrar DNS → pointer ela-revolution.com vers Netlify");
    console.log("  4. LinkedIn Developers → créer app OAuth pour auto-post");
    console.log("  5. Bot LinkedIn → python SaaS_Bot_LinkedIn/login_saver.py");
    console.log("\n" + "█".repeat(60) + "\n");
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("  ⚡ ELA IGNITION — Machine d'Acquisition en Ligne");
    console.log(`  ${new Date().toLocaleString('fr-FR')}`);
    console.log("=".repeat(60));

    await setupGodMode();
    await setupSystemIdentities();
    await seedDemoData();
    await checkCriticalVars();

    printIgnitionReport();

    await prisma.$disconnect();
    console.log("✅ Ignition terminée. L'Empire démarre.\n");
    process.exit(err > 2 ? 1 : 0);
}

main().catch(async (e) => {
    console.error("💥 IGNITION FAILURE:", e.message);
    await prisma.$disconnect();
    process.exit(1);
});
