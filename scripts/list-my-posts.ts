import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log(`\n🚀 RÉCUPÉRATION DES DERNIÈRES PUBLICATIONS...\n`);

    // 1. Articles de Blog (ContentAsset)
    const articles = await prisma.contentAsset.findMany({
        where: {
            publishedAt: { not: null }
        },
        orderBy: {
            publishedAt: 'desc'
        },
        take: 5,
        select: {
            title: true,
            slug: true,
            publishedAt: true
        }
    });

    if (articles.length > 0) {
        console.log(`📝 DERNIERS ARTICLES DE BLOG :`);
        articles.forEach(art => {
            console.log(`- [${art.publishedAt?.toISOString()}] ${art.title}`);
            console.log(`  🔗 http://localhost:3000/blog/${art.slug}`);
        });
        console.log('');
    }

    // 2. Posts Sociaux (Post)
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
        select: {
            platform: true,
            status: true,
            content: true,
            createdAt: true
        }
    });

    if (posts.length > 0) {
        console.log(`🔗 DERNIÈRES PUBLICATIONS SOCIALES :`);
        posts.forEach(post => {
            console.log(`- [${post.createdAt.toISOString()}] [${post.platform}] Status: ${post.status}`);
            console.log(`  Content: ${post.content.substring(0, 100)}...`);
        });
    }
}

main().finally(() => prisma.$disconnect());
