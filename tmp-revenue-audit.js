const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalBeforeToday = await prisma.treasuryLedger.aggregate({
        _sum: { amount_cents: true },
        where: { 
            type: { in: ['REVENUE', 'REVENUE_IN', 'INFLOW', 'INJECTION', 'MANUAL_INJECTION'] },
            createdAt: { lt: today }
        }
    });

    const totalToday = await prisma.treasuryLedger.aggregate({
        _sum: { amount_cents: true },
        where: { 
            type: { in: ['REVENUE', 'REVENUE_IN', 'INFLOW', 'INJECTION', 'MANUAL_INJECTION'] },
            createdAt: { gte: today }
        }
    });

    console.log('--- REVENUE BY DATE ---');
    console.log('Total Before Today:', (totalBeforeToday._sum.amount_cents || 0) / 100, '€');
    console.log('Total Today (Offensive):', (totalToday._sum.amount_cents || 0) / 100, '€');
    
    await prisma.$disconnect();
    process.exit(0);
}
check();
