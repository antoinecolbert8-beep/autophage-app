import { NextResponse } from 'next/server';
import { scryptSync, randomBytes } from 'crypto';
import { db as prisma } from '@/core/db';

export const dynamic = 'force-dynamic';

const SEED_SECRET = process.env.CRON_SECRET || 'ela-apex-cron-sovereign-2026';

function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function GET(request: Request) {
    // Simple auth check
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    if (secret !== SEED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results: string[] = [];

        // 1. Create or find organization
        let org = await (prisma.organization as any).findFirst({
            where: { name: 'ELA Admin Corp' }
        });

        if (!org) {
            org = await (prisma.organization as any).create({
                data: {
                    name: 'ELA Admin Corp',
                    domain: 'ela-admin.io',
                    plan: 'enterprise',
                    tier: 'grand_horloger',
                    credits: 999999,
                }
            });
            results.push(`✅ Org created: ${org.id}`);
        } else {
            results.push(`ℹ️ Org exists: ${org.id}`);
        }

        // 2. Upsert admin user
        const hashedPassword = hashPassword('Genesis2025!');
        const admin = await (prisma.user as any).upsert({
            where: { email: 'admin@genesis.ai' },
            update: {
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
            },
            create: {
                email: 'admin@genesis.ai',
                name: 'Admin Genesis',
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
            }
        });
        results.push(`✅ Admin created/updated: ${admin.email}`);

        return NextResponse.json({
            success: true,
            message: 'Admin seeded successfully',
            results,
            credentials: {
                email: 'admin@genesis.ai',
                password: 'Genesis2025!'
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
