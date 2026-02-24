import { Worker, Job } from 'bullmq';
import { redisConnection, SocialJobPayload } from './social-queue';
import { publishToMultiplePlatforms } from '../social-media-manager';

/**
 * 🛠️ SOCIAL PUBLISHING WORKER (Sealed Architecture)
 * Consomme les jobs de la queue 'social-publishing'.
 */
export const socialWorker = new Worker(
    'social-publishing',
    async (job: Job<SocialJobPayload>) => {
        console.log(`👷 Processing social job ${job.id} for org ${job.data.organizationId || 'global'}`);

        const { post, platforms, organizationId } = job.data;

        try {
            const results = await publishToMultiplePlatforms(post, platforms, organizationId);

            // Analyse des résultats pour validation du worker
            const failures = Object.entries(results).filter(([_, res]) => !res.success);
            if (failures.length > 0) {
                console.warn(`🛑 Job ${job.id} partially failed:`, failures);
                // We don't necessarily throw here if some platforms succeeded,
                // but individual platform logic in SocialMediaManager already handles retries.
            } else {
                console.log(`✅ Job ${job.id} completed successfully for all platforms.`);
            }

            return results;
        } catch (error: any) {
            console.error(`❌ Critical worker error for job ${job.id}:`, error.message);
            throw error; // Trigger BullMQ built-in retry
        }
    },
    {
        connection: redisConnection,
        concurrency: 5 // Process up to 5 posts simultaneously per worker instance
    }
);

socialWorker.on('completed', (job) => {
    console.log(`🏁 Job ${job.id} finished.`);
});

socialWorker.on('failed', (job, err) => {
    console.error(`💥 Job ${job?.id} failed after ${job?.attemptsMade} attempts:`, err.message);
});
