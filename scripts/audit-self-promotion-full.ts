import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { prisma } from '../lib/prisma';
import { generateText } from '../lib/ai/vertex';
import { getSocialPostPrompt } from '../lib/prompts/social-posts';

/**
 * 🚀 AUDIT PROCESSUS D'AUTO-PROMOTION COMPLET (APEX)
 */
async function auditSelfPromotion() {
    console.log("\n///  🚀 AUDIT PROCESSUS AUTO-PROMOTION (GOD MODE)  ///\n");

    const results: { check: string; status: '✅' | '⚠️' | '❌'; detail: string }[] = [];

    // 1. Vérifier l'utilisateur God Mode
    console.log("   🔍 Vérification utilisateur God Mode...");
    const godUser = await prisma.user.findUnique({
        where: { email: 'godmode@ela.ai' },
        include: { organization: true }
    });

    results.push({
        check: "Utilisateur God Mode (godmode@ela.ai)",
        status: godUser ? '✅' : '⚠️',
        detail: godUser
            ? `Trouvé: ID ${godUser.id} | Org: ${godUser.organization?.name || 'N/A'} | Crédits: ${godUser.organization?.creditBalance || 0}`
            : "Absent — sera créé au 1er cycle"
    });

    if (godUser?.organizationId) {
        // 2. Vérifier le budget de crédits
        const credits = godUser.organization?.creditBalance || 0;
        results.push({
            check: "Budget Crédits Auto-Promotion",
            status: credits >= 100 ? '✅' : credits > 0 ? '⚠️' : '❌',
            detail: `${credits} crédits disponibles (minimum recommandé: 1000 pour 24h de God Mode)`
        });

        // 3. Vérifier les posts récents publiés
        const recentPosts = await prisma.post.findMany({
            where: {
                userId: godUser.id,
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        results.push({
            check: "Posts auto-générés (24h)",
            status: recentPosts.length > 0 ? '✅' : '⚠️',
            detail: recentPosts.length > 0
                ? `${recentPosts.length} posts — Plateformes: ${[...new Set(recentPosts.map(p => p.platform))].join(', ')}`
                : "Aucun post auto-généré dans les 24h — Cron inactif ou premier démarrage"
        });

        // 4. Vérifier la limite SRE (15 posts/jour)
        const sre24h = await prisma.usageLog.count({
            where: {
                organizationId: godUser.organizationId,
                actionType: 'SNAP_DISTRIBUTION',
                timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });

        results.push({
            check: "Limite SRE Anti-Spam (15 posts/jour)",
            status: sre24h < 15 ? '✅' : '⚠️',
            detail: `${sre24h}/15 posts utilisés. Capacité restante: ${Math.max(0, 15 - sre24h)} posts.`
        });
    }

    // 5. Test de génération de contenu Elite (core engine)
    console.log("   🔴 Test de génération de contenu ELA (LINKEDIN)...");
    try {
        const prompt = getSocialPostPrompt("La révolution de l'automatisation souveraine", 'elite');
        const content = await generateText(prompt + "\nGénère uniquement le texte du post, sans balises JSON.", { temperature: 0.9 });
        results.push({
            check: "Moteur de génération Elite (getSocialPostPrompt)",
            status: content.length > 50 ? '✅' : '⚠️',
            detail: `Contenu généré (${content.length} chars): "${content.substring(0, 80)}..."`
        });

        // 6. Vérifier la conformité légale du contenu
        const hasForbiddenWords = ['arnaque', 'fraudefraud', 'illégal'].some(w =>
            content.toLowerCase().includes(w)
        );
        results.push({
            check: "Conformité Légale du Contenu Généré",
            status: !hasForbiddenWords ? '✅' : '❌',
            detail: hasForbiddenWords
                ? "⚠️ Mots interdits détectés — LegalSentinel doit filtrer"
                : "Aucun mot interdit détecté — Contenu conforme"
        });
    } catch (e: any) {
        results.push({
            check: "Moteur de génération Elite",
            status: '❌',
            detail: `Erreur: ${e.message}`
        });
    }

    // 7. Vérification du système de planification (Cron)
    const netlifyFunctionsDir = path.join(__dirname, '../netlify/functions');
    const { existsSync } = require('fs');
    const cronFile = path.join(netlifyFunctionsDir, 'god-mode-cron.ts');
    results.push({
        check: "Cron God Mode (Netlify Functions)",
        status: existsSync(cronFile) ? '✅' : '⚠️',
        detail: existsSync(cronFile)
            ? "Fonction cron présente — déclenchement horaire configuré"
            : "Fichier dieu cron absent. Vérifier netlify/functions/"
    });

    // 8. Vérification plateformes configurées
    const platforms = [
        { name: 'LinkedIn (Token)', key: process.env.LINKEDIN_CLIENT_ID, optional: false },
        { name: 'Instagram (Token)', key: process.env.INSTAGRAM_ACCESS_TOKEN, optional: false },
        { name: 'MAKE Webhook (Orchestrateur)', key: process.env.MAKE_WEBHOOK_URL, optional: false },
        { name: 'Twilio WhatsApp (Notifications)', key: process.env.TWILIO_ACCOUNT_SID, optional: true },
    ];

    for (const p of platforms) {
        const hasKey = p.key && !p.key.startsWith('your-') && !p.key.startsWith('AC...');
        results.push({
            check: p.name,
            status: hasKey ? '✅' : (p.optional ? '⚠️' : '⚠️'),
            detail: hasKey ? "Configuré" : `Non configuré — ${p.optional ? 'optionnel' : 'requis pour auto-publication'}`
        });
    }

    // Rapport final
    console.log("=".repeat(65));
    results.forEach(r => {
        console.log(`${r.status}  ${r.check}`);
        console.log(`     → ${r.detail}\n`);
    });
    console.log("=".repeat(65));
    const ok = results.filter(r => r.status === '✅').length;
    const warn = results.filter(r => r.status === '⚠️').length;
    const err = results.filter(r => r.status === '❌').length;
    console.log(`\nRésumé: ${ok} ✅ | ${warn} ⚠️ | ${err} ❌`);

    await prisma.$disconnect();
    return results;
}

auditSelfPromotion().catch(console.error);
