/**
 * PRODUCTION LOGGER
 * Structured logging for production monitoring
 * In production, integrate with a service like Datadog, LogRocket, or Sentry
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Production threshold - only log warn and above in production
const PROD_THRESHOLD: LogLevel = 'info';
const isProd = process.env.NODE_ENV === 'production';

function shouldLog(level: LogLevel): boolean {
    if (!isProd) return true;
    return LOG_LEVELS[level] >= LOG_LEVELS[PROD_THRESHOLD];
}

function formatLog(entry: LogEntry): string {
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`;
}

function createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
    };
}

export const logger = {
    debug(message: string, context?: Record<string, unknown>) {
        const entry = createLogEntry('debug', message, context);
        if (shouldLog('debug')) {
            console.debug(formatLog(entry));
        }
    },

    info(message: string, context?: Record<string, unknown>) {
        const entry = createLogEntry('info', message, context);
        if (shouldLog('info')) {
            console.info(formatLog(entry));
        }
    },

    warn(message: string, context?: Record<string, unknown>) {
        const entry = createLogEntry('warn', message, context);
        if (shouldLog('warn')) {
            console.warn(formatLog(entry));
        }
    },

    error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
        const errorContext = error instanceof Error
            ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
            : { error };

        const entry = createLogEntry('error', message, { ...errorContext, ...context });
        if (shouldLog('error')) {
            console.error(formatLog(entry));
        }

        // In production, send to error tracking service
        if (isProd && typeof window === 'undefined') {
            // Server-side: could integrate with Sentry, Datadog, etc.
            // Example: Sentry.captureException(error);
        }
    },

    // Alias for common operations
    billing(action: string, data?: Record<string, unknown>) {
        this.info(`[BILLING] ${action}`, data);
    },

    security(action: string, data?: Record<string, unknown>) {
        this.warn(`[SECURITY] ${action}`, data);
    },

    ai(action: string, data?: Record<string, unknown>) {
        this.info(`[AI] ${action}`, data);
    },
};

export default logger;
