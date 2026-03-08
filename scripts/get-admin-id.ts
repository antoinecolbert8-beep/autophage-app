import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("=== USER IDs ===");

    const admin = await prisma.user.findUnique({ where: { email: 'admin@ela-revolution.com' } });
    if (admin) console.log('admin@ela-revolution.com ->', admin.id);

    const godmode = await prisma.user.findUnique({ where: { email: 'godmode@ela.ai' } });
    if (godmode) console.log('godmode@ela.ai ->', godmode.id);

    const genesisAdmin = await prisma.user.findUnique({ where: { email: 'admin@genesis.ai' } });
    if (genesisAdmin) console.log('admin@genesis.ai ->', genesisAdmin.id);
}

main().finally(() => prisma.$disconnect());
