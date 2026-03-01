import { getRedisConnection, getQueue, isRedisReady } from '../redis-provider';
import { publishToMultiplePlatforms, SocialPost } from '../social-media-manager';

// ── CONNECTION ─────────────────────────────────────────────────────────────
// Utilise le provider centralisé au lieu de créer l'instance ici au top-level
export const getSocialRedisConnection = () => getRedisConnection();

// ── QUEUE DEFINITION ───────────────────────────────────────────────────────
// Utilise le provider pour obtenir la queue de manière paresseuse (lazy)
export const getSocialQueue = () => getQueue('social-publishing', {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: 1000,
    }
});

// ── JOB PAYLOAD TYPE ──────────────────────────────────────────────────────
export interface SocialJobPayload {
    post: SocialPost;
    platforms: SocialPost["platform"][];
    organizationId?: string;
}

/**
 * Enqueue a new social post job
 */
export async function enqueueSocialPost(payload: SocialJobPayload) {
    const jobId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // ── FALLBACK SANS REDIS (Audit / Local Dev) ──
    const connection = getSocialRedisConnection();
    if (!connection || !isRedisReady()) {
        console.warn(`⚠️ Redis non connecté ou en phase de build. Exécution synchrone pour ${jobId}`);
        try {
            await publishToMultiplePlatforms(payload.post, payload.platforms, payload.organizationId);
            return `${jobId}_sync`;
        } catch (error: any) {
            console.error(`❌ Échec de l'exécution synchrone fallback:`, error.message);
            throw error;
        }
    }

    const queue = getSocialQueue();
    if (queue) {
        await queue.add('publish', payload, { jobId });
    }
    return jobId;
}
