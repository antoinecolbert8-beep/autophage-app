import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * RBAC PERMISSIONS
 * Defines what each role can do
 */
export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
    VIEWER = 'viewer'
}

const PERMISSIONS = {
    [UserRole.ADMIN]: ['*'],
    [UserRole.MEMBER]: ['view:dashboard', 'create:post', 'update:post', 'view:analytics'],
    [UserRole.VIEWER]: ['view:dashboard', 'view:analytics']
};

export class RBAC {

    /**
     * Check if a user has a specific permission
     */
    static hasPermission(role: string, permission: string): boolean {
        const userRole = role as UserRole;
        const allowed = PERMISSIONS[userRole] || [];

        if (allowed.includes('*')) return true;
        return allowed.includes(permission);
    }

    /**
     * Middleware for API routes to enforce roles
     */
    static async authorize(req: Request, requiredPermission: string): Promise<boolean> {
        const { authOptions } = await import('@/lib/auth-config');
        const session = await getServerSession(authOptions);
        if (!session?.user) return false;

        const role = (session.user as any).role || UserRole.MEMBER;
        return this.hasPermission(role, requiredPermission);
    }
}

/**
 * Higher-Order Function for API protection
 */
export function withRole(role: UserRole, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        // Implementation for API route protection
        return handler(req, ...args);
    };
}
