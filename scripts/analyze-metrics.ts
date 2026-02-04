import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const posts = await prisma.post.findMany({ where: { createdAt: { gte: today } } });
    const avgScore = posts.reduce((acc, p) => acc + p.performance_score, 0) / posts.length;
    console.log(`TOTAL_POSTS: ${posts.length}`);
    console.log(`AVG_SCORE: ${avgScore.toFixed(2)}`);
}

main().finally(() => prisma.$disconnect());
