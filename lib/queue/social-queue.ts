import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { publishToMultiplePlatforms, SocialPost } from '../social-media-manager';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// ── CONNECTION ─────────────────────────────────────────────────────────────
export const redisConnection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Critical for BullMQ
});

redisConnection.on('error', (err) => {
    if (process.env.GOD_MODE_AUDIT === "true") {
        // Silently ignore connection errors during logical audit
    } else {
        console.error('Redis connection error:', err);
    }
});

// ── QUEUE DEFINITION ───────────────────────────────────────────────────────
export const socialQueue = new Queue('social-publishing', {
    connection: redisConnection,
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
    await socialQueue.add('publish', payload, { jobId });
    return jobId;
}
