import { Queue, Worker } from 'bullmq';
import { getRedisConnection, getQueue } from '../redis-provider';
import { DAILY_RECAP_PROMPT } from '../prompts/daily-recap';
import { generateContentWithGemini } from '../gemini-content';
// ── GETTERS ────────────────────────────────────────────────────────────────
export const getRecapConnection = () => getRedisConnection();
export const getRecapQueue = () => getQueue('daily-recap');

export interface RecapEvent {
  orgId: string;
  type: 'sale' | 'referral' | 'contract';
  description: string;
  value?: number;
  currency?: string;
  timestamp: string;
}

export const addEventToBuffer = async (event: RecapEvent) => {
  const connection = getRecapConnection();
  if (!connection) return;

  const redisKey = `org:events:${event.orgId}`;
  await connection.rpush(redisKey, JSON.stringify(event));
};

export const getEventsForOrg = async (orgId: string): Promise<RecapEvent[]> => {
  const connection = getRecapConnection();
  if (!connection) return [];

  const redisKey = `org:events:${orgId}`;
  const events = await connection.lrange(redisKey, 0, -1);
  return events.map((e: string) => JSON.parse(e));
};

export const clearEventsForOrg = async (orgId: string) => {
  const connection = getRecapConnection();
  if (!connection) return;

  const redisKey = `org:events:${orgId}`;
  await connection.del(redisKey);
};

// BullMQ Worker to process recaps
let recapWorker: Worker | null = null;

export function startRecapWorker() {
  const connection = getRecapConnection();
  if (!connection) return null;
  if (recapWorker) return recapWorker;

  recapWorker = new Worker('daily-recap', async job => {
    const { orgId } = job.data;

    const events = await getEventsForOrg(orgId);
    if (events.length === 0) return; // Nothing to recap

    const eventsListStr = events.map(e =>
      `- [${e.timestamp}] ${e.type.toUpperCase()}: ${e.description} ${e.value ? `(${e.value}${e.currency || '€'})` : ''}`
    ).join('\n');

    const prompt = DAILY_RECAP_PROMPT.replace('{{events_list}}', eventsListStr);

    try {
      const aiResponse = await generateContentWithGemini({
        topic: "Daily Recap",
        platform: "LINKEDIN", // Defaulting to LinkedIn for Sovereign announcements
        contentType: "TEXT",
        boldness: 'sovereign'
      } as any); // Type cast due to boldness parameter

      // TODO: Publish aiResponse.text using the actual publishing utility
      // await publishToNetworks(orgId, aiResponse.text);

      // Clear the buffer after successful generation/publishing
      await clearEventsForOrg(orgId);

      return { success: true, postsGenerated: 1 };
    } catch (error) {
      console.error(`Failed to generate recap for org ${orgId}`, error);
      throw error;
    }
  }, { connection });

  return recapWorker;
}

// Auto-start si pas en phase de build
if (process.env.NEXT_PHASE !== 'phase-production-build' && process.env.NODE_ENV !== 'test') {
  startRecapWorker();
}
