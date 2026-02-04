import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`\n🔍 Checking publications since: ${today.toISOString()}`);

    const posts = await prisma.post.findMany({
        where: {
            createdAt: {
                gte: today
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            platform: true,
            status: true,
            content: true,
            publishedAt: true,
            createdAt: true
        }
    });

    if (posts.length === 0) {
        console.log("❌ No posts found for today yet.");
    } else {
        console.log(`✅ Found ${posts.length} posts for today:\n`);
        posts.forEach((post, i) => {
            console.log(`--- Post #${i + 1} ---`);
            console.log(`ID: ${post.id}`);
            console.log(`Platform: ${post.platform}`);
            console.log(`Status: ${post.status}`);
            console.log(`Created: ${post.createdAt.toISOString()}`);
            console.log(`Published: ${post.publishedAt ? post.publishedAt.toISOString() : 'N/A'}`);
            console.log(`Content Sample: ${post.content.substring(0, 100)}...`);
            console.log('------------------\n');
        });
    }
}

main().finally(() => prisma.$disconnect());
