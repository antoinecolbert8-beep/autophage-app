import { Worker, Job } from 'bullmq';
import { getQueue, getRedisConnection } from '../redis-provider';
import { generateContentWithGemini } from '../gemini-content';
import { enqueueSocialPost, getSocialRedisConnection } from '../queue/social-queue';

/**
 * 📡 EVIDENCE BROADCASTER (The FOMO Loop)
 * Cette file d'attente gère la génération de "Proof of Work" après chaque vente Stripe.
 */

export const getEvidenceQueue = () => getQueue('evidence-broadcaster', {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 10000,
        },
        removeOnComplete: true,
    },
});

// Worker pour traiter les preuves sociales
let evidenceWorker: Worker | null = null;

export function startEvidenceWorker() {
    const connection = getSocialRedisConnection();
    if (!connection) return null;
    if (evidenceWorker) return evidenceWorker;

    evidenceWorker = new Worker(
        'evidence-broadcaster',
        async (job: Job) => {
            const { plan, amount, customerEmail } = job.data;

            console.log(`📡 [Evidence] Génération Proof of Work pour : ${plan} (${amount}€)`);

            // 1. Génération du contenu via l'IA (Ton Dominant & Inévitable)
            const topic = `
      CONTEXTE : Un nouveau client vient de s'abonner au plan ${plan} de la Manufacture ELA.
      MISSION : Générer un post "Proof of Work" ultra-dominant. 
      TON : Souverain, froid, inévitable, expert. 
      MESSAGE CLÉ : La machine s'étend. Tandis que la concurrence dort, nos clients automatisent leur domination. 
      CTA : Rejoindre l'ère Zero-Friction sur https://ela.ai/genesis
    `;

            try {
                const aiResponse = await generateContentWithGemini({
                    topic,
                    platform: 'LINKEDIN',
                    contentType: 'TEXT',
                    tone: 'viral',
                });

                const finalContent = aiResponse.text;

                // 2. Publication sur les canaux "Free Traffic"
                // X (Twitter), LinkedIn, Facebook (en attendant Reddit)
                const targetPlatforms: any[] = ['LINKEDIN', 'TWITTER', 'FACEBOOK'];

                for (const platform of targetPlatforms) {
                    await enqueueSocialPost({
                        post: {
                            content: finalContent,
                            platform: platform,
                        },
                        platforms: [platform],
                    });
                }

                console.log(`✅ [Evidence] Preuve sociale envoyée pour publication multi-canal.`);
                return { success: true, platforms: targetPlatforms };
            } catch (error: any) {
                console.error(`❌ [Evidence] Échec de la génération IA :`, error.message);
                throw error;
            }
        },
        {
            connection,
            concurrency: 2
        }
    );

    return evidenceWorker;
}

// Auto-start si pas en phase de build
if (process.env.NEXT_PHASE !== 'phase-production-build' && process.env.NODE_ENV !== 'test') {
    startEvidenceWorker();
}

/**
 * Fonction helper pour ajouter une preuve à la file
 */
export async function triggerEvidenceBroadcast(data: { plan: string; amount: number; customerEmail?: string }) {
    const queue = getEvidenceQueue();
    if (!queue) return;

    const jobId = `evidence_${Date.now()}`;
    await queue.add('broadcast', data, { jobId });
    console.log(`📩 [Evidence] Job ajouté : ${jobId}`);
}
