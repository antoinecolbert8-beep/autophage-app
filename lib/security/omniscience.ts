/**
 * OMNISCIENCE ("The Eye")
 * 
 * Centralized Observability Service.
 * Tracks every packet, every user action, every anomaly.
 * This is the source of truth for the "God Mode" dashboard.
 */

export type LogLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
export type EventType = 'INFILTRATION_ATTEMPT' | 'USER_LOGIN' | 'API_REQUEST' | 'SYSTEM_BOOT' | 'GOD_MODE_ACTION';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    type: EventType;
    message: string;
    metadata?: any;
    ip?: string;
    path?: string;
}

export class Omniscience {
    /**
     * The Eye sees everything.
     * Logs an event to the secure audit trail.
     */
    static log(
        level: LogLevel,
        type: EventType,
        message: string,
        metadata?: any
    ) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            type,
            message,
            metadata,
        };

        // 1. Console Output (Captured by Vercel/AWS CloudWatch)
        const icon = this.getIcon(level);
        console.log(`${icon} [${entry.timestamp}] [${type}] ${message}`, metadata ? JSON.stringify(metadata) : '');

        // 2. Persistence Layer (SQLite AuditLog)
        // Fire and forget, or handle errors gracefully to avoid blocking the request
        this.saveToDb(entry).catch(err => console.error('[Omniscience] DB Persistence Error:', err));
    }

    private static async saveToDb(entry: LogEntry) {
        try {
            // HYPER-FLUX: Efficient DB import
            const { prisma } = await import('@/lib/prisma');
            await prisma.auditLog.create({
                data: {
                    action: entry.type,
                    details: entry.message,
                    entityType: entry.metadata?.entityType || 'SYSTEM',
                    entityId: entry.metadata?.entityId,
                    ipAddress: entry.ip,
                    userAgent: entry.metadata?.ua,
                    createdAt: new Date(entry.timestamp)
                }
            });
        } catch (error) {
            // Avoid recursion and just use console
            console.error('[Omniscience] Failed to persist log:', error);
        }
    }

    /**
     * Scans a request for threat patterns (Middleware Integration)
     */
    static observeRequest(req: Request) {
        const url = new URL(req.url);
        const ip = req.headers.get('x-forwarded-for') || 'Unknown IP';
        const ua = req.headers.get('user-agent') || 'Anonymous';

        // Log every API hit as INFO
        if (url.pathname.startsWith('/api')) {
            this.log('INFO', 'API_REQUEST', `Incoming Request: ${url.pathname}`, {
                ip,
                ua,
                method: req.method
            });
        }
    }

    private static getIcon(level: LogLevel): string {
        switch (level) {
            case 'CRITICAL': return '🛑';
            case 'WARNING': return '⚠️';
            case 'SUCCESS': return '✅';
            case 'INFO': return '👁️';
            default: return '📝';
        }
    }
}
