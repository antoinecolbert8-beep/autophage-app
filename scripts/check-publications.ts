
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkPublishedPosts() {
    console.log("🔍 VÉRIFICATION DES PUBLICATIONS AUTONOMES\n");

    // 1. Check System User
    const systemUser = await prisma.user.findUnique({
        where: { email: 'godmode@ela.ai' }
    });

    if (!systemUser) {
        console.log("❌ Aucun utilisateur système trouvé.");
        console.log("💡 Le système créera l'utilisateur au premier run du cron.\n");
    } else {
        console.log(`✅ Utilisateur Système: ${systemUser.name} (${systemUser.id})\n`);
    }

    // 2. Check Recent Posts (Last 7 days)
    const recentPosts = await prisma.post.findMany({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 20
    });

    if (recentPosts.length === 0) {
        console.log("📭 AUCUNE PUBLICATION TROUVÉE (7 derniers jours)");
        console.log("\n💡 Le cron tourne chaque heure à :00");
        console.log("   Il publiera automatiquement si:");
        console.log("   - L'heure actuelle est dans la fenêtre optimale");
        console.log("   - Aucun post n'a été fait dans les 18 dernières heures\n");
        return;
    }

    console.log(`📊 ${recentPosts.length} PUBLICATIONS TROUVÉES\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const post of recentPosts) {
        const status = post.status === 'published' ? '✅' : '❌';
        const score = post.performance_score > 0 ? `${post.performance_score.toFixed(1)}/100` : 'Pending';

        console.log(`${status} ${post.platform.padEnd(12)} | Score: ${score.padEnd(10)} | ${post.publishedAt?.toLocaleString('fr-FR') || 'Non publié'}`);
        console.log(`   Preview: ${(post.content || '').substring(0, 80)}...`);
        console.log(`   Media: ${post.mediaUrl || 'Aucun'}`);
        console.log("");
    }

    // 3. Stats Summary
    const stats = {
        total: recentPosts.length,
        published: recentPosts.filter(p => p.status === 'published').length,
        failed: recentPosts.filter(p => p.status === 'failed').length,
        avgScore: recentPosts.filter(p => p.performance_score > 0).length > 0
            ? recentPosts.reduce((sum, p) => sum + p.performance_score, 0) / recentPosts.filter(p => p.performance_score > 0).length
            : 0
    };

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\n📈 STATISTIQUES`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   Publiés: ${stats.published} ✅`);
    console.log(`   Échoués: ${stats.failed} ❌`);
    console.log(`   Score Moyen: ${stats.avgScore.toFixed(1)}/100`);

    // 4. Check ContentStats
    const contentStats = await prisma.contentStat.findMany({
        take: 10,
        orderBy: { collectedAt: 'desc' }
    });

    if (contentStats.length > 0) {
        console.log(`\n📊 Métriques Engagement (${contentStats.length} dernières):`);
        for (const stat of contentStats.slice(0, 5)) {
            console.log(`   Post ${stat.postId.substring(0, 8)}... | 👁️ ${stat.views} | ❤️ ${stat.likes} | 💬 ${stat.comments} | 🔁 ${stat.shares}`);
        }
    }

    console.log("\n");
}

checkPublishedPosts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
