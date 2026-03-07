import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fortressMiddleware } from '@/lib/security/middleware';
import { Omniscience } from '@/lib/security/omniscience';
import { getToken } from 'next-auth/jwt';

/**
 * FORTRESS SECURITY PROTOCOL — PRODUCTION
 * Rate limiting, JWT-based RBAC, and security headers
 */
export async function middleware(request: NextRequest) {
    try {
        // 1. OMNISCIENCE
        Omniscience.observeRequest(request);

        // 2. FORTRESS RATE LIMITING & SECURITY HEADERS
        const fortressResponse = await fortressMiddleware(request);
        if (fortressResponse && fortressResponse.status !== 200) {
            return fortressResponse;
        }

        // 3. JWT TOKEN VERIFICATION
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        const pathname = request.nextUrl.pathname;

        // 4. ADMIN ROUTES — requires admin role in JWT (no forgeable cookies)
        const adminPaths = ['/admin-master', '/dashboard-war-room'];
        const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

        if (isAdminPath) {
            if (!token) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            if (token.role !== 'admin') {
                console.warn(`[Fortress] Blocked ${pathname} — role: ${token.role}`);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        // 5. DASHBOARD — must be authenticated
        // DEV MODE BYPASS: Allow dashboard access without auth in development for local testing
        const isDev = process.env.NODE_ENV === 'development';
        if (pathname.startsWith('/dashboard') && !token && !isDev) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Copy security headers from fortress to final response
        const response = NextResponse.next();
        if (fortressResponse) {
            fortressResponse.headers.forEach((value, key) => {
                response.headers.set(key, value);
            });
        }

        return response;
    } catch (error) {
        console.error('[Fortress] Middleware error:', error);
        const response = NextResponse.next();
        response.headers.set('X-Fortress-Shield', 'Fallback-Mode');
        return response;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/auth).*)',
    ],
};
