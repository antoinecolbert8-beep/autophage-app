const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const warChest = await prisma.warChest.findFirst();
    const ledger = await prisma.treasuryLedger.aggregate({
        _sum: { amount_cents: true },
        where: { type: { in: ['INFLOW', 'INJECTION', 'MANUAL_INJECTION'] } }
    });
    const logs = await prisma.aIActionLog.count();
    
    console.log('--- DATABASE REALITY CHECK ---');
    console.log('WarChest:', JSON.stringify(warChest, null, 2));
    console.log('Total Revenue (cents):', ledger._sum.amount_cents);
    console.log('AI Logs count:', logs);
    await prisma.$disconnect();
    process.exit(0);
}
check().catch(err => {
    console.error(err);
    process.exit(1);
});
