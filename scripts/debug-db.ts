import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const orgs = await prisma.organization.findMany();
    console.log('--- Organizations ---');
    console.log(JSON.stringify(orgs, null, 2));

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            organizationId: true,
            password: true, // Just check if it's there
        }
    });
    console.log('--- Users ---');
    users.forEach(u => {
        console.log(`- ${u.email} (${u.role}) Org: ${u.organizationId} Pass: ${u.password ? 'Set' : 'MISSING'}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
