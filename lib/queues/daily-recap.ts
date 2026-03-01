import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { DAILY_RECAP_PROMPT } from '../prompts/daily-recap';
// Placeholder import for generateContentWithGemini, adjust path based on real architecture
import { generateContentWithGemini } from '../gemini-content';
// import { publishToNetworks } from '../publisher';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const recapQueue = new Queue('daily-recap', { connection });

export interface RecapEvent {
  orgId: string;
  type: 'sale' | 'referral' | 'contract';
  description: string;
  value?: number;
  currency?: string;
  timestamp: string;
}

export const addEventToBuffer = async (event: RecapEvent) => {
  // We use the orgId as the Job ID grouping, but actually we want a list of events per org.
  // We will store events in a Redis List specific to the organization.
  const redisKey = `org:events:${event.orgId}`;
  await connection.rpush(redisKey, JSON.stringify(event));
};

export const getEventsForOrg = async (orgId: string): Promise<RecapEvent[]> => {
  const redisKey = `org:events:${orgId}`;
  const events = await connection.lrange(redisKey, 0, -1);
  return events.map(e => JSON.parse(e));
};

export const clearEventsForOrg = async (orgId: string) => {
  const redisKey = `org:events:${orgId}`;
  await connection.del(redisKey);
};

// BullMQ Worker to process recaps if triggered via queue instead of purely API Cron
// This could be scheduled to run daily per organization.
export const recapWorker = new Worker('daily-recap', async job => {
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
