const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    console.log(`🔍 Touchpoint & Conversion Audit...`);

    try {
        const touchpoints = await prisma.touchpoint.count();
        const conversions = await prisma.conversion.count();
        const leadUpdates = await prisma.lead.findMany({ 
            take: 5, 
            orderBy: { updatedAt: 'desc' },
            select: { name: true, stage: true, updatedAt: true }
        });

        console.log(`✅ Total Touchpoints: ${touchpoints}`);
        console.log(`✅ Total Conversions: ${conversions}`);
        console.log("\nLast 5 Lead Updates:");
        console.log(JSON.stringify(leadUpdates, null, 2));

    } catch (e) {
        console.error("❌ Audit Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
