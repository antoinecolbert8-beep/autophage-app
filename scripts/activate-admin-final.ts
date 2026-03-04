import { scryptSync, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

/**
 * Hash a password using scrypt
 */
function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@genesis.ai';
const ADMIN_PASSWORD = 'Genesis2025!';
const ADMIN_NAME = 'Admin Genesis';

async function activateAdmin() {
    console.log('🛡️ Activating Admin Account:', ADMIN_EMAIL);

    try {
        // Find or create Organization
        let org = await prisma.organization.findFirst({
            where: { name: { contains: 'Admin' } }
        });

        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: 'Genesis Admin Corp',
                    domain: 'genesis.ai',
                    tier: 'enterprise',
                    creditBalance: 999999,
                    status: 'active'
                }
            });
            console.log('✅ Created Admin Organization:', org.id);
        }

        // Ensure AIProfile exists for God Mode toggles
        const aiProfile = await prisma.aIProfile.upsert({
            where: { organizationId: org.id },
            update: {},
            create: {
                organizationId: org.id,
                godModeConfig: JSON.stringify({
                    selfPromotion: true,
                    linkedinBot: true,
                    emailSequences: true,
                    viralEngine: true,
                    autoEngage: true,
                    shopifyBroadcast: true,
                    crm_sync: true
                })
            }
        });
        console.log('✅ AI Profile (God Mode) Activated');

        const hashedPassword = hashPassword(ADMIN_PASSWORD);

        // Upsert Admin User
        const adminUser = await prisma.user.upsert({
            where: { email: ADMIN_EMAIL },
            update: {
                role: 'admin',
                password: hashedPassword,
                organizationId: org.id,
            },
            create: {
                email: ADMIN_EMAIL,
                name: ADMIN_NAME,
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise',
            }
        });

        console.log('✅ Admin User Activated:', adminUser.email);
        console.log('Password set to:', ADMIN_PASSWORD);

    } catch (error) {
        console.error('❌ Error during activation:', error);
    } finally {
        await prisma.$disconnect();
    }
}

activateAdmin();
