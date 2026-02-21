import { NextRequest, NextResponse } from 'next/server';

/**
 * FORTRESS PROTOCOL: SENTINEL & MOVING TARGET DEFENSE
 * Rate limiting, threat detection, and security headers
 */

interface RequestLog {
    count: number;
    lastRequest: number;
    score: number;
}

// In-memory rate limit store (use Redis for multi-instance production)
const trafficMap = new Map<string, RequestLog>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 120;
const THREAT_THRESHOLD = 80;

function calculateThreatScore(req: NextRequest, currentStats: RequestLog): number {
    let score = 0;
    const timeDiff = Date.now() - currentStats.lastRequest;
    if (timeDiff < 100) score += 20;
    if (timeDiff < 50) score += 40;
    const ua = req.headers.get('user-agent') || '';
    if (!ua || ua.length < 10) score += 30;
    if (ua.includes('bot') || ua.includes('crawl')) score += 10;
    return Math.min(score, 100);
}

export async function fortressMiddleware(req: NextRequest) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = req.ip || (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || realIp || 'unknown';
    const now = Date.now();

    const host = req.headers.get('host') || '';

    // Whitelist localhost / dev
    if (
        process.env.NODE_ENV === 'development' ||
        ip === '::1' || ip === '127.0.0.1' ||
        host.includes('localhost') || host.includes('127.0.0.1') ||
        req.nextUrl.hostname === 'localhost'
    ) {
        const response = NextResponse.next();
        applySecurityHeaders(response);
        return response;
    }

    // --- RATE LIMITING (ACTIVE) ---
    let stats = trafficMap.get(ip) || { count: 0, lastRequest: 0, score: 0 };
    if (now - stats.lastRequest > RATE_LIMIT_WINDOW) {
        stats = { count: 0, lastRequest: now, score: 0 };
    }
    stats.count++;
    stats.score += calculateThreatScore(req, stats);
    stats.lastRequest = now;
    trafficMap.set(ip, stats);

    // Block abusive IPs (skip 'unknown' to avoid blocking Railway internals)
    if ((stats.score > THREAT_THRESHOLD || stats.count > MAX_REQUESTS) && ip !== 'unknown') {
        console.warn(`🛡️ FORTRESS: Blocked IP ${ip} (Score: ${stats.score}, Reqs: ${stats.count})`);
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please slow down.' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '60',
                },
            }
        );
    }

    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
}

function applySecurityHeaders(response: NextResponse) {
    response.headers.set('X-Fortress-Shield', 'Active');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net",
            "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://hook.eu1.make.com",
            "frame-src https://js.stripe.com https://hooks.stripe.com",
            "object-src 'none'",
            "base-uri 'self'",
        ].join('; ')
    );
}
