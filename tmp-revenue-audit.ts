import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- REVENUE AUDIT ---');

    try {
        const organicOrgs = await prisma.organization.findMany({
            where: { mrr: { gt: 0 } },
            select: { name: true, mrr: true, createdAt: true }
        });

        const organicUsers = await prisma.user.findMany({
            where: { NOT: { stripeCustomerId: null } },
            select: { email: true, stripeCustomerId: true, createdAt: true }
        });

        const recentLeads = await prisma.lead.count({
            where: { createdAt: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        });

        console.log(`Orgs with MRR: ${JSON.stringify(organicOrgs)}`);
        console.log(`Users with Stripe: ${JSON.stringify(organicUsers)}`);
        console.log(`Leads this week: ${recentLeads}`);

    } catch (error) {
        console.error('Audit Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
