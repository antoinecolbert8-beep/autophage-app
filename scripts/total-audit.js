const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    console.log(`🔍 Total Database Count Audit...`);

    try {
        const aiLogs = await prisma.aIActionLog.count();
        const history = await prisma.actionHistory.count();
        const leads = await prisma.lead.count();
        const orgs = await prisma.organization.count();
        const projects = await prisma.project.count();

        console.log(`✅ Total AIActionLog: ${aiLogs}`);
        console.log(`✅ Total ActionHistory: ${history}`);
        console.log(`✅ Total Leads: ${leads}`);
        console.log(`✅ Total Organizations: ${orgs}`);
        console.log(`✅ Total Projects (Marketplace): ${projects}`);

    } catch (e) {
        console.error("❌ Audit Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
