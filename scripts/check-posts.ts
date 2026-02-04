import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPosts() {
    const posts = await prisma.post.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    posts.forEach(p => {
        console.log(`[${p.status}] ${p.platform} at ${p.createdAt.toISOString()} - ID: ${p.id}`);
    });
}

checkPosts();
