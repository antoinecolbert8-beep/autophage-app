const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    console.log("🌞 [MORNING AUDIT] Results from the Night Shift...");
    
    const startTime = new Date('2026-03-22T21:00:00Z');

    // 1. LinkedIn Actions
    const liActions = await prisma.actionHistory.count({
        where: { type: 'LINKEDIN', createdAt: { gte: startTime } }
    });

    // 2. Warm Leads
    const warmCount = await prisma.lead.count({ where: { stage: 'warm' } });
    const newLeads = await prisma.lead.count({
        where: { createdAt: { gte: startTime } }
    });

    // 3. Transactions/Sales
    const sales = await prisma.creditPurchase.findMany({
        where: { timestamp: { gte: startTime } }
    });

    console.log(`📊 STATS SINCE LAST NIGHT:`);
    console.log(`- LinkedIn Interactions: ${liActions}`);
    console.log(`- New Leads Prospectés: ${newLeads}`);
    console.log(`- Total Warm Pipeline: ${warmCount}`);
    console.log(`- Conversions Detectées: ${sales.length}`);
    
    for (const s of sales) {
        console.log(`💰 [SALE] Org: ${s.organizationId} | Credits: ${s.credits} | Date: ${s.timestamp}`);
    }
}

check().catch(console.error).finally(() => prisma.$disconnect());
