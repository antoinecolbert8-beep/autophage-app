const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLeads() {
    try {
        const leads = await prisma.lead.findMany({
            take: 5,
            where: {
                status: 'NEW',
                linkedinUrl: { not: null }
            }
        });
        console.log(JSON.stringify(leads, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}
getLeads();
