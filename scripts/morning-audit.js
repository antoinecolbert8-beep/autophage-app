const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    const startTime = new Date('2026-03-22T20:00:00Z');
    console.log(`🔍 Auditing activity since ${startTime.toISOString()}...`);

    try {
        const aiLogs = await prisma.aIActionLog.count({ where: { createdAt: { gte: startTime } } });
        const history = await prisma.actionHistory.count({ where: { createdAt: { gte: startTime } } });
        const leads = await prisma.lead.count({ where: { createdAt: { gte: startTime } } });
        const sales = await prisma.creditPurchase.count({ where: { timestamp: { gte: startTime } } });

        console.log(`✅ AIActionLog: ${aiLogs}`);
        console.log(`✅ ActionHistory: ${history}`);
        console.log(`✅ New Leads: ${leads}`);
        console.log(`✅ Sales: ${sales}`);
        
        // Let's see the last 5 AI logs
        const lastLogs = await prisma.aIActionLog.findMany({ 
            take: 5, 
            orderBy: { createdAt: 'desc' },
            select: { actionType: true, status: true, executedAt: true }
        });
        console.log("\nLast 5 AI Actions:");
        console.log(JSON.stringify(lastLogs, null, 2));

    } catch (e) {
        console.error("❌ Audit Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
