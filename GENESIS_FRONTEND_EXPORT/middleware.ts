import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fortressMiddleware } from '@/lib/security/middleware';

/**
 * FORTRESS SECURITY PROTOCOL - PRODUCTION ENABLED
 * Rate limiting, threat detection, and security headers
 */
export async function middleware(request: NextRequest) {
    try {
        // Apply Fortress Security Protocol
        const fortressResponse = await fortressMiddleware(request);

        // If fortress blocked it (status != 200), return the block response
        if (fortressResponse && fortressResponse.status !== 200) {
            return fortressResponse;
        }

        // Copy security headers from fortress response to final response
        const response = NextResponse.next();
        if (fortressResponse) {
            fortressResponse.headers.forEach((value, key) => {
                response.headers.set(key, value);
            });
        }

        return response;
    } catch (error) {
        // Fallback: Allow request but log error (don't block users due to security bugs)
        console.error('[Fortress] Security middleware error:', error);
        const response = NextResponse.next();
        response.headers.set('X-Fortress-Shield', 'Fallback-Mode');
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api/webhooks (webhooks need raw body without middleware interference)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)',
    ],
};
