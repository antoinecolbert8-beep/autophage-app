/**
 * LIVE METRICS BROADCASTER
 * Utility to broadcast real-time events to connected clients
 */

export class LiveMetrics {

    /**
     * Broadcast an event to a specific organization room
     */
    static async broadcast(orgId: string, event: string, data: any) {
        try {
            // Trigger a local broadcast (in-process if io is available)
            // In Next.js, we often need to trigger this via an internal API call or Redis Pub/Sub
            // For MVP, we'll try to reach the global io instance
            const globalAny: any = global;
            const io = globalAny.io;

            if (io) {
                io.to(`org:${orgId}`).emit(event, data);
                console.log(`[LiveMetrics] Broadcasted ${event} to org:${orgId}`);
            } else {
                // Fallback: Use a webhook or internal API to trigger the socket
                // This is needed because Next.js API routes are often isolated
                const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                await fetch(`${APP_URL}/api/socket/trigger`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orgId, event, data, secret: process.env.INTERNAL_SECRET })
                }).catch(e => console.error('[LiveMetrics] Trigger fallback failed:', e));
            }
        } catch (error) {
            console.error('[LiveMetrics] Broadcast error:', error);
        }
    }

    /**
     * Notify about a new lead
     */
    static async notifyNewLead(orgId: string, lead: any) {
        await this.broadcast(orgId, 'new_lead', lead);
    }

    /**
     * Notify about post performance update
     */
    static async notifyPostUpdate(orgId: string, postStats: any) {
        await this.broadcast(orgId, 'post_update', postStats);
    }

    /**
     * Notify about new revenue
     */
    static async notifyRevenue(orgId: string, revenueData: any) {
        await this.broadcast(orgId, 'revenue_update', revenueData);
    }
}
