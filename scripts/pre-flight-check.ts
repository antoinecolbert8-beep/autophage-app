import { redisConnection } from '../lib/queue/social-queue';
import { db as prisma } from '@/core/db';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🛫 PRE-FLIGHT CHECK (SRE Scellement final)
 * Vérifie l'intégrité de l'infrastructure avant le démarrage.
 */
async function runPreFlight() {
    console.log("🚀 Lancement du Pre-flight Check ELA...");
    let errors = 0;

    // 1. Check Redis (BullMQ dependency)
    try {
        const redisStatus = await redisConnection.ping();
        if (redisStatus === 'PONG') {
            console.log("✅ Redis: Connecté (BullMQ Opérationnel)");
        } else {
            throw new Error("PONG not received");
        }
    } catch (e) {
        console.error("❌ Redis: Échec de connexion. BullMQ ne fonctionnera pas !");
        errors++;
    }

    // 2. Check Database
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Database: Connectée (Prisma)");
    } catch (e) {
        console.error("❌ Database: Échec de connexion Prisma/SQLite.");
        errors++;
    }

    // 3. Check Fortress
    const fortressSecret = process.env.FORTRESS_SECRET;
    if (!fortressSecret || fortressSecret.length < 32) {
        console.error("❌ Fortress: FORTRESS_SECRET manquant ou trop faible (< 32 chars).");
        errors++;
    } else {
        console.log("✅ Fortress: Secret détecté et robuste.");
    }

    // 4. Check API Keys (Presense only)
    const criticalKeys = [
        'STRIPE_SECRET_KEY',
        'TWITTER_API_KEY',
        'TWITTER_API_SECRET',
        'TWITTER_ACCESS_TOKEN',
        'TWITTER_ACCESS_SECRET'
    ];

    criticalKeys.forEach(key => {
        if (!process.env[key]) {
            console.warn(`⚠️ API Key: ${key} manquante. Certaines fonctions seront désactivées.`);
        }
    });

    console.log("-----------------------------------------");
    if (errors > 0) {
        console.error(`🛑 PRE-FLIGHT FAILED: ${errors} erreur(s) bloquante(s).`);
        process.exit(1);
    } else {
        console.log("🛰️ SYSTEM READY: Architecture Scellée opérationnelle.");
        process.exit(0);
    }
}

runPreFlight();
