import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

function cuid() {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function main() {
    console.log('Connecting to production DB...');

    // Check/create org
    let org = await prisma.organization.findFirst({ where: { domain: 'ela-revolution.com' } });
    if (!org) {
        org = await prisma.organization.create({
            data: {
                id: cuid(),
                name: 'ELA Revolution',
                domain: 'ela-revolution.com',
                tier: 'enterprise',
                status: 'active',
            }
        });
        console.log('Org created:', org.id);
    } else {
        console.log('Org found:', org.id);
    }

    // Check/create admin
    const existing = await prisma.user.findUnique({ where: { email: 'admin@genesis.ai' } });
    if (existing) {
        await prisma.user.update({
            where: { email: 'admin@genesis.ai' },
            data: { password: hashPassword('Genesis2025!'), role: 'admin' }
        });
        console.log('Admin password updated!');
    } else {
        await prisma.user.create({
            data: {
                id: cuid(),
                email: 'admin@genesis.ai',
                name: 'Grand Horloger',
                role: 'admin',
                password: hashPassword('Genesis2025!'),
                organizationId: org.id,
                currentPlan: 'enterprise',
            }
        });
        console.log('Admin created!');
    }

    console.log('\nLogin OK: admin@genesis.ai / Genesis2025!');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
