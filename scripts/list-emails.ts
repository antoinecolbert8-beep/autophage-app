import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('--- Emails ---');
    users.forEach(u => console.log(u.email));
}

main().finally(() => prisma.$disconnect());
