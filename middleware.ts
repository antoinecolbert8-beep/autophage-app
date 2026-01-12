import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fortressMiddleware } from '@/lib/security/middleware';
import { Omniscience } from '@/lib/security/omniscience';

/**
 * FORTRESS SECURITY PROTOCOL - PRODUCTION ENABLED
 * Rate limiting, threat detection, and security headers
 */
export async function middleware(request: NextRequest) {
    try {
        // 1. OMNISCIENCE: THE EYE SEES EVERYTHING
        // Log the request immediately before any filtering
        Omniscience.observeRequest(request);

        // 2. FORTRESS: THE SHIELD PROTECTS
        const fortressResponse = await fortressMiddleware(request);

        // If fortress blocked it (status != 200), return the block response
        if (fortressResponse && fortressResponse.status !== 200) {
            return fortressResponse;
        }

        // 3. RBAC: ACCESS CONTROL
        // Protect /admin-master and /dashboard-war-room
        const protectedPaths = ['/admin-master', '/dashboard-war-room'];
        const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

        if (isProtected) {
            // Check for admin session/cookie (Simplified for demo)
            // In real prod, verify JWT signature or DB session
            const adminCookie = request.cookies.get('admin-session');

            // If strictly checking for 'admin' role
            if (!adminCookie || adminCookie.value !== 'true') {
                console.warn(`[Fortress] Blocked unauthorized access to ${request.nextUrl.pathname}`);
                return NextResponse.redirect(new URL('/login', request.url));
            }
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
