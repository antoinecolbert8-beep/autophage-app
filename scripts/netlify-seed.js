#!/usr/bin/env node
/**
 * Netlify build plugin that seeds the admin account after db push.
 * This runs during the build phase when Netlify CAN reach Supabase.
 */

const { scryptSync, randomBytes } = require('crypto');
const { PrismaClient } = require('@prisma/client');

function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
    const prisma = new PrismaClient();

    const email = process.env.ADMIN_EMAIL || 'admin@genesis.ai';
    const password = process.env.ADMIN_PASSWORD || 'Genesis2025!';

    console.log(`[SEED] Seeding admin account: ${email}`);

    try {
        // Create or find org
        let org = await prisma.organization.findFirst({
            where: { name: { contains: 'Admin' } }
        });

        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: 'ELA Admin Corp',
                    domain: 'ela-admin.io',
                    tier: 'enterprise',
                    creditBalance: 999999,
                }
            });
            console.log('[SEED] Created org:', org.id);
        }

        const hashedPass = hashPassword(password);

        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPass, role: 'admin', organizationId: org.id },
            create: {
                email,
                name: 'Admin ELA',
                password: hashedPass,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
            }
        });

        console.log('[SEED] ✅ Admin account ready:', user.email);
    } catch (err) {
        console.error('[SEED] ❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
