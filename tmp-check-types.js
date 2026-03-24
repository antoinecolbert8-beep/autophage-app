const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const types = await prisma.treasuryLedger.groupBy({
        by: ['type'],
        _count: true
    });
    console.log('TreasuryLedger types:', JSON.stringify(types, null, 2));
    await prisma.$disconnect();
    process.exit(0);
}
check();
