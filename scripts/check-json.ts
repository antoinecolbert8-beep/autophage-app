import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.post.count({
        where: { createdAt: { gte: today } }
    });

    const latest = await prisma.post.findMany({
        where: { createdAt: { gte: today } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            platform: true,
            status: true,
            createdAt: true
        }
    });

    console.log(JSON.stringify({
        total_today: count,
        latest_posts: latest
    }, null, 2));
}

main().finally(() => prisma.$disconnect());
