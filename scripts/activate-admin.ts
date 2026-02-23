/**
 * Script d'activation du compte admin
 * Usage: npx ts-node scripts/activate-admin.ts
 */

import { scryptSync, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

/**
 * Hash a password using scrypt (Copied from auth-utils to be standalone)
 */
function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@ela-revolution.com';
const ADMIN_PASSWORD = 'GodMode2024!';
const ADMIN_NAME = 'System Admin';

async function activateAdmin() {
    console.log('🔐 Activation du compte admin ELA...\n');

    try {
        // Detect user property name (sometimes uppercase, sometimes lowercase)
        const userProp = ('user' in prisma) ? 'user' : ('User' in prisma ? 'User' : null);
        const orgProp = ('organization' in prisma) ? 'organization' : ('Organization' in prisma ? 'Organization' : null);

        if (!userProp || !orgProp) {
            console.error('❌ Erreur: Impossible de trouver les modèles User ou Organization dans le client Prisma.');
            console.log('Propriétés disponibles:', Object.keys(prisma).filter(k => !k.startsWith('_')));
            return;
        }

        const userModel = (prisma as any)[userProp];
        const orgModel = (prisma as any)[orgProp];

        // 1. Check/create admin organization
        let org = await orgModel.findFirst({
            where: { name: 'ELA Revolution - Admin' }
        });

        if (!org) {
            org = await orgModel.create({
                data: {
                    name: 'ELA Revolution - Admin',
                    domain: 'ela-revolution.com',
                    plan: 'enterprise',
                    tier: 'grand_horloger',
                    credits: 999999,
                }
            });
            console.log('✅ Organisation admin créée:', org.id);
        } else {
            console.log('ℹ️ Organisation admin existante:', org.id);
        }

        const hashedPassword = hashPassword(ADMIN_PASSWORD);

        // 2. Upsert admin user
        const adminUser = await userModel.upsert({
            where: { email: ADMIN_EMAIL },
            update: {
                role: 'admin',
                password: hashedPassword,
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
                stripeCustomerId: 'cus_admin_force',
            },
            create: {
                email: ADMIN_EMAIL,
                name: ADMIN_NAME,
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
                stripeCustomerId: 'cus_admin_force',
            }
        });
        console.log('✅ Compte admin actif:', ADMIN_EMAIL);

        // 3. Upsert godmode user
        await userModel.upsert({
            where: { email: 'godmode@ela.ai' },
            update: {
                role: 'admin',
                password: hashedPassword,
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
                stripeCustomerId: 'cus_god_force',
            },
            create: {
                email: 'godmode@ela.ai',
                name: 'God Mode System',
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise',
                monthlyQuota: 999999,
                stripeCustomerId: 'cus_god_force',
            }
        });
        console.log('✅ Compte God Mode actif: godmode@ela.ai');

        console.log('\n🎉 Activation terminée avec succès !');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('URL:      /login');
        console.log('Email:    admin@ela-revolution.com');
        console.log('Pass:     GodMode2024!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

activateAdmin();
