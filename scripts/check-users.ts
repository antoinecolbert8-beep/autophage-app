import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth-utils';

const prisma = new PrismaClient();

async function main() {
    const clients = await prisma.user.findMany({
        where: { role: { not: 'admin' } }
    });

    console.log(`Found ${clients.length} non-admin (client) users.`);

    if (clients.length === 0) {
        console.log('Creating a test client user...');

        // Ensure there is an organization first (assuming one exists or we create a dummy one)
        let org = await prisma.organization.findFirst();
        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: "Test Client Org",
                    domain: "client.test",
                    tier: "starter"
                }
            });
        }

        const testClientEmail = 'client@genesis.ai';
        const clientHashed = await hashPassword('Client2025!');

        await prisma.user.upsert({
            where: { email: testClientEmail },
            update: { password: clientHashed, role: 'member' },
            create: {
                email: testClientEmail,
                name: "Test Client",
                role: "member",
                password: clientHashed,
                organizationId: org.id
            }
        });

        console.log(`Test client created: ${testClientEmail} / Client2025!`);
    } else {
        console.log('Existing client users:');
        clients.forEach(c => console.log(`- ${c.email} (${c.role})`));
        // Reset password for the first one for testing if not known
        const firstClient = clients[0];
        const newPass = await hashPassword('Client2025!');
        await prisma.user.update({
            where: { id: firstClient.id },
            data: { password: newPass }
        });
        console.log(`Password for ${firstClient.email} reset to 'Client2025!' for testing.`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
