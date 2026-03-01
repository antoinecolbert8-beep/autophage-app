import IORedis from 'ioredis';
import { Queue, Worker } from 'bullmq';

/**
 * 🛡️ REDIS PROVIDER (Build-Safe & Lazy-Loaded)
 * Ce module empêche la connexion à Redis pendant la phase de build de Next.js
 * sur Netlify (Next.js pré-rend les pages et importe les modules).
 */

const IS_BUILD_PHASE = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Singletons
let redisInstance: IORedis | null = null;
const queues: Record<string, Queue> = {};

/**
 * Récupère ou initialise l'instance Redis partagée
 */
export function getRedisConnection(): IORedis | null {
    if (IS_BUILD_PHASE) {
        console.warn('⚠️ [Redis] Phase de build détectée : Connexion bloquée.');
        return null;
    }

    if (!redisInstance) {
        console.log(`📡 [Redis] Initialisation de la connexion sur ${REDIS_URL}`);
        redisInstance = new IORedis(REDIS_URL, {
            maxRetriesPerRequest: null, // Requis pour BullMQ
            enableReadyCheck: true,
        });

        redisInstance.on('error', (err) => {
            console.error('❌ [Redis] Erreur de connexion:', err.message);
        });
    }

    return redisInstance;
}

/**
 * Récupère ou initialise une Queue BullMQ de manière sécurisée
 */
export function getQueue(name: string, options: any = {}): Queue | null {
    if (IS_BUILD_PHASE) return null;

    if (!queues[name]) {
        const connection = getRedisConnection();
        if (!connection) return null;

        queues[name] = new Queue(name, {
            connection,
            ...options
        });
    }

    return queues[name];
}

/**
 * Helper pour vérifier si Redis est prêt avant d'agir
 */
export function isRedisReady(): boolean {
    if (!redisInstance) return false;
    return redisInstance.status === 'ready';
}
