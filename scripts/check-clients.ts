import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClients() {
    try {
        const userCount = await prisma.user.count();
        const orgCount = await prisma.organization.count();
        const activeSubscriptions = await prisma.subscription.count({
            where: { status: 'active' }
        });

        console.log(`📊 DB STATUS:`);
        console.log(`- Users: ${userCount}`);
        console.log(`- Organizations: ${orgCount}`);
        console.log(`- Active Subscriptions: ${activeSubscriptions}`);

        if (userCount > 1) {
            console.log('\n--- Recent Users ---');
            const recentUsers = await prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { email: true, createdAt: true, role: true }
            });
            recentUsers.forEach(u => console.log(`[${u.createdAt.toISOString()}] ${u.email} (${u.role})`));
        }

    } catch (error) {
        console.error('❌ Error checking clients:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkClients();
