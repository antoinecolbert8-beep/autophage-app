import { prisma } from '../lib/prisma';

async function grantInitialCredits() {
    const org = await prisma.organization.findFirst();
    if (!org) {
        console.error("❌ No organization found.");
        return;
    }

    await prisma.organization.update({
        where: { id: org.id },
        data: { creditBalance: 1000, status: 'active', tier: 'pro' }
    });

    console.log(`✅ Granted 1000 credits to ${org.name}. Balance: 1000`);
}

grantInitialCredits()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
