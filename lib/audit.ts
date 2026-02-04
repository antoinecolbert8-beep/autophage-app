import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum AuditAction {
    LOGIN = 'USER_LOGIN',
    LOGOUT = 'USER_LOGOUT',
    CREATE_POST = 'POST_CREATED',
    UPDATE_POST = 'POST_UPDATED',
    DELETE_POST = 'POST_DELETED',
    UPDATE_BILLING = 'BILLING_UPDATED',
    CHANGE_ROLE = 'USER_ROLE_CHANGED',
    EXPORT_DATA = 'DATA_EXPORTED',
    LEAD_GEN = 'LEAD_GENERATED'
}

/**
 * AUDIT SERVICE
 * Centralized logging for enterprise compliance and security.
 */
export class AuditService {

    /**
     * Log a security or business event
     */
    static async log(params: {
        userId: string;
        orgId: string;
        action: AuditAction | string;
        entityType: string;
        entityId?: string;
        details?: any;
        req?: Request | any;
    }) {
        try {
            const { userId, orgId, action, entityType, entityId, details, req } = params;

            await prisma.auditLog.create({
                data: {
                    userId,
                    organizationId: orgId,
                    action,
                    entityType,
                    entityId,
                    details: details ? JSON.stringify(details) : null,
                    ipAddress: req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress || null,
                    userAgent: req?.headers?.['user-agent'] || null,
                }
            });

            console.log(`[Audit] ${action} logged for user ${userId}`);
        } catch (error) {
            console.error('[Audit] Logging failed:', error);
        }
    }
}
