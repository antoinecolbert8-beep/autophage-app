const http = require('http');

async function testAPI() {
    // We can't easily call our own API via HTTP if the server isn't stable or if we don't have the session.
    // Instead, let's just run the LOGIC of the API in a script to see what it would return.
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const warChest = await prisma.warChest.findFirst();
        const warChestBalance = warChest ? (warChest.available_budget_cents + warChest.reserved_cents) / 100 : 0;

        const ledgerInflows = await prisma.treasuryLedger.aggregate({
            _sum: { amount_cents: true },
            where: { type: { in: ['REVENUE', 'REVENUE_IN', 'INFLOW', 'INJECTION', 'MANUAL_INJECTION'] } }
        });
        
        const marketplaceTotal = await prisma.marketplaceTransaction.aggregate({
            _sum: { amountCent: true },
            where: { status: 'COMPLETED' }
        });

        const totalRevenue = ((ledgerInflows._sum.amount_cents || 0) + (marketplaceTotal._sum.amountCent || 0)) / 100;

        console.log('--- API LOGIC VERIFICATION ---');
        console.log('Revenue:', totalRevenue, '€');
        console.log('WarChest:', warChestBalance, '€');
        
        if (warChestBalance > 3000000) {
            console.log('SUCCESS: WarChest is above 3M€.');
        } else {
            console.log('WARNING: WarChest is lower than expected.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

testAPI();
