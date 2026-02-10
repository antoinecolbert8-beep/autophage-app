import { createClient } from 'redis';

/**
 * PERFORMANCE CACHING LAYER
 * Redis-based caching for massive performance gains
 */

// Redis client singleton
let redisClient: ReturnType<typeof createClient> | null = null;
const memoryCache = new Map<string, { value: any; expires: number }>();

export async function getRedisClient() {
    if (!process.env.REDIS_URL) {
        console.warn('[Redis] REDIS_URL not set, bypassing Redis...');
        return null;
    }

    if (!redisClient) {
        try {
            redisClient = createClient({
                url: process.env.REDIS_URL,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            console.error('[Redis] Max reconnection attempts reached');
                            return new Error('Max reconnection attempts');
                        }
                        return Math.min(retries * 100, 3000);
                    }
                }
            });

            redisClient.on('error', (err) => console.error('[Redis] Error:', err));
            redisClient.on('connect', () => console.log('[Redis] Connected'));

            await redisClient.connect();
        } catch (error) {
            console.error('[Redis] Connection failed:', error);
            redisClient = null;
            return null;
        }
    }

    return redisClient;
}

/**
 * Cache utility with automatic serialization
 */
export class Cache {

    /**
     * Get from cache
     */
    static async get<T>(key: string): Promise<T | null> {
        try {
            const client = await getRedisClient();
            if (client) {
                const value = await client.get(key);
                if (value) {
                    console.log(`[Cache:Redis] HIT: ${key}`);
                    return JSON.parse(value) as T;
                }
            } else {
                // Memory Fallback
                const cached = memoryCache.get(key);
                if (cached && cached.expires > Date.now()) {
                    console.log(`[Cache:Memory] HIT: ${key}`);
                    return cached.value as T;
                }
                if (cached) memoryCache.delete(key); // Cleanup expired
            }
            return null;
        } catch (error) {
            console.error(`[Cache] GET error for ${key}:`, error);
            return null;
        }
    }

    /**
     * Set in cache with TTL
     */
    static async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
        try {
            const client = await getRedisClient();
            if (client) {
                const serialized = JSON.stringify(value);
                await client.setEx(key, ttlSeconds, serialized);
                console.log(`[Cache:Redis] SET: ${key} (TTL: ${ttlSeconds}s)`);
            } else {
                // Memory Fallback
                memoryCache.set(key, {
                    value,
                    expires: Date.now() + (ttlSeconds * 1000)
                });
                console.log(`[Cache:Memory] SET: ${key} (TTL: ${ttlSeconds}s)`);
            }
        } catch (error) {
            console.error(`[Cache] SET error for ${key}:`, error);
        }
    }

    /**
     * Delete from cache
     */
    static async delete(key: string): Promise<void> {
        try {
            const client = await getRedisClient();
            if (client) {
                await client.del(key);
            }
            memoryCache.delete(key);
            console.log(`[Cache] DELETE: ${key}`);
        } catch (error) {
            console.error(`[Cache] DELETE error for ${key}:`, error);
        }
    }

    /**
     * Delete multiple keys by pattern
     */
    static async deletePattern(pattern: string): Promise<void> {
        try {
            const client = await getRedisClient();
            const keys = await client.keys(pattern);

            if (keys.length > 0) {
                await client.del(keys);
                console.log(`[Cache] DELETE PATTERN: ${pattern} (${keys.length} keys)`);
            }
        } catch (error) {
            console.error(`[Cache] DELETE PATTERN error for ${pattern}:`, error);
        }
    }

    /**
     * Get or set (fetch if not cached)
     */
    static async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttlSeconds: number = 300
    ): Promise<T> {
        // Try to get from cache
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        // Fetch fresh data
        console.log(`[Cache] MISS: ${key} - Fetching...`);
        const fresh = await fetchFn();

        // Store in cache
        await this.set(key, fresh, ttlSeconds);

        return fresh;
    }

    /**
     * Increment counter
     */
    static async increment(key: string, by: number = 1): Promise<number> {
        try {
            const client = await getRedisClient();
            return await client.incrBy(key, by);
        } catch (error) {
            console.error(`[Cache] INCREMENT error for ${key}:`, error);
            return 0;
        }
    }

    /**
     * Check if key exists
     */
    static async exists(key: string): Promise<boolean> {
        try {
            const client = await getRedisClient();
            const result = await client.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`[Cache] EXISTS error for ${key}:`, error);
            return false;
        }
    }

    /**
     * Get remaining TTL
     */
    static async ttl(key: string): Promise<number> {
        try {
            const client = await getRedisClient();
            return await client.ttl(key);
        } catch (error) {
            console.error(`[Cache] TTL error for ${key}:`, error);
            return -1;
        }
    }

    /**
     * Flush all cache (use with caution!)
     */
    static async flushAll(): Promise<void> {
        try {
            const client = await getRedisClient();
            await client.flushAll();
            console.log('[Cache] FLUSHED ALL');
        } catch (error) {
            console.error('[Cache] FLUSH ALL error:', error);
        }
    }
}

/**
 * Cache key builders for consistency
 */
export const CacheKeys = {
    // Analytics
    analytics: (userId: string, timeframe: string) => `analytics:${userId}:${timeframe}`,
    postMetrics: (postId: string) => `metrics:post:${postId}`,
    platformMetrics: (platform: string) => `metrics:platform:${platform}`,

    // User data
    user: (userId: string) => `user:${userId}`,
    userPosts: (userId: string) => `user:${userId}:posts`,
    userLeads: (userId: string) => `user:${userId}:leads`,

    // Lead scoring
    leadScore: (leadId: string) => `lead:${leadId}:score`,
    hotLeads: (userId: string) => `leads:hot:${userId}`,

    // Revenue
    revenue: (userId: string, period: string) => `revenue:${userId}:${period}`,

    // System
    systemStats: () => `system:stats`,
    activeUsers: () => `system:active_users`
};

/**
 * TTL configurations (in seconds)
 */
export const CacheTTL = {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 1800,          // 30 minutes
    VERY_LONG: 3600,     // 1 hour
    DAY: 86400           // 24 hours
};
