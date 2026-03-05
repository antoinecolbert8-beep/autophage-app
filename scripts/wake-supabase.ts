/**
 * 🗄️ Supabase Wake-Up Script
 * 
 * Ce script tente de réveiller Supabase de deux manières :
 * 1. Via l'API Management Supabase (nécessite SUPABASE_MANAGEMENT_TOKEN)
 * 2. Via une requête REST directe sur la DB (parfois suffit à réveiller le projet)
 * 
 * Usage: npx tsx scripts/wake-supabase.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

const PROJECT_REF = 'yoqgvuwtseoctwwjlapy';
const MANAGEMENT_TOKEN = process.env.SUPABASE_MANAGEMENT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yoqgvuwtseoctwwjlapy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

async function wakeViaRestPing() {
    console.log('🏓 Tentative de réveil via REST ping...');
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });
        console.log(`REST ping: HTTP ${res.status}`);
        if (res.ok || res.status === 404) {
            console.log('✅ Supabase répond — le projet semble actif !');
            return true;
        }
    } catch (e: any) {
        console.log(`❌ REST ping échoué: ${e.message}`);
    }
    return false;
}

async function wakeViaManagementAPI() {
    if (!MANAGEMENT_TOKEN || MANAGEMENT_TOKEN.includes('REMPLACER')) {
        console.log('\n⚠️  SUPABASE_MANAGEMENT_TOKEN non configuré.');
        console.log('👉 Pour obtenir ton token :');
        console.log('   1. Va sur https://supabase.com/dashboard/account/tokens');
        console.log('   2. Clique "Generate new token"');
        console.log('   3. Copie le token');
        console.log('   4. Ajoute dans .env : SUPABASE_MANAGEMENT_TOKEN=sbp_xxxx');
        console.log('   5. Relance ce script');
        return false;
    }

    console.log('\n🔑 Management token trouvé — vérification du statut...');
    try {
        const statusRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}`, {
            headers: { Authorization: `Bearer ${MANAGEMENT_TOKEN}` },
        });
        const project = await statusRes.json();
        console.log(`Statut projet : ${project.status}`);

        if (project.status === 'ACTIVE_HEALTHY') {
            console.log('✅ Projet déjà actif et en bonne santé !');
            return true;
        }

        console.log('⏳ Projet en pause — envoi de la commande de réveil...');
        const resumeRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/restore`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${MANAGEMENT_TOKEN}`, 'Content-Type': 'application/json' },
        });

        if (resumeRes.ok) {
            console.log('✅ Commande de réveil envoyée ! Attends 30-60 secondes puis relance `prisma db push`.');
        } else {
            console.log(`❌ Erreur API: ${resumeRes.status} - ${await resumeRes.text()}`);
        }
    } catch (e: any) {
        console.log(`❌ Erreur Management API: ${e.message}`);
    }
    return false;
}

async function main() {
    console.log('🚀 ELA — Supabase Wake-Up Script');
    console.log('================================');

    const restOk = await wakeViaRestPing();
    if (!restOk) {
        await wakeViaManagementAPI();
    }

    console.log('\n📋 Si le projet est actif, lance maintenant :');
    console.log('   npx prisma db push --accept-data-loss');
    console.log('   npx tsx scripts/activate-admin-final.ts');
}

main();
