import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * RBAC PERMISSIONS
 * Defines what each role can do in the system
 */
export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
    VIEWER = 'viewer'
}

const PERMISSIONS: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: ['*'],
    [UserRole.MEMBER]: ['view:dashboard', 'create:post', 'update:post', 'view:analytics', 'use:billing'],
    [UserRole.VIEWER]: ['view:dashboard', 'view:analytics']
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.ADMIN]: 3,
    [UserRole.MEMBER]: 2,
    [UserRole.VIEWER]: 1,
};

export class RBAC {

    /**
     * Check if a role has a specific permission
     */
    static hasPermission(role: string, permission: string): boolean {
        const userRole = role as UserRole;
        const allowed = PERMISSIONS[userRole] || [];
        if (allowed.includes('*')) return true;
        return allowed.includes(permission);
    }

    /**
     * Server-side authorization check for API routes
     */
    static async authorize(req: Request, requiredPermission: string): Promise<boolean> {
        const { authOptions } = await import('@/lib/auth-config');
        const session = await getServerSession(authOptions);
        if (!session?.user) return false;
        const role = (session.user as any).role || UserRole.MEMBER;
        return this.hasPermission(role, requiredPermission);
    }

    /**
     * Get current user role from session
     */
    static async getCurrentRole(): Promise<UserRole | null> {
        const { authOptions } = await import('@/lib/auth-config');
        const session = await getServerSession(authOptions);
        if (!session?.user) return null;
        return ((session.user as any).role as UserRole) || UserRole.MEMBER;
    }
}

/**
 * Higher-Order Function for API route role protection
 * Enforces role-based access — previously was a stub that let everything through
 */
export function withRole(requiredRole: UserRole, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        const { authOptions } = await import('@/lib/auth-config');
        const session = await getServerSession(authOptions) as any;

        if (!session?.user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const userRole = (session.user.role as UserRole) || UserRole.MEMBER;
        const userLevel = ROLE_HIERARCHY[userRole] || 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

        if (userLevel < requiredLevel) {
            return NextResponse.json(
                { error: `Insufficient permissions. Required role: ${requiredRole}` },
                { status: 403 }
            );
        }

        return handler(req, ...args);
    };
}
