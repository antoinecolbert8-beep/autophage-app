// scripts/seed-genesis.ts
// 🧬 GENÈSE : Injection des premiers "Souverains" et du Classement Initial
// Usage: npx tsx scripts/seed-genesis.ts

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('⚙️  Initialisation du Mouvement Perpétuel (Genèse)...\n');

    // ── Données des 5 Pionniers ────────────────────────────────────────────────
    const pioneers = [
        { name: 'Marc L.', email: 'marc.l@genesis.ela', mrr: 199, tier: 'pro', posts: 14, engagement: 3450, referrals: 3 },
        { name: 'Sophie V.', email: 'sophie.v@genesis.ela', mrr: 199, tier: 'pro', posts: 11, engagement: 2120, referrals: 1 },
        { name: 'Alexandre D.', email: 'alex.d@genesis.ela', mrr: 499, tier: 'enterprise', posts: 25, engagement: 8900, referrals: 7 },
        { name: 'Julie M.', email: 'julie.m@genesis.ela', mrr: 49, tier: 'pro', posts: 5, engagement: 450, referrals: 0 },
        { name: 'Thomas B.', email: 'thomas.b@genesis.ela', mrr: 0, tier: 'free', posts: 2, engagement: 120, referrals: 0 },
    ];

    const topPublishersData: any[] = [];
    const topReferrersData: any[] = [];

    for (const pioneer of pioneers) {
        // Guard: Skip if already seeded
        const existing = await prisma.user.findUnique({ where: { email: pioneer.email } });
        if (existing) {
            console.log(`⏭️  Déjà initialisé : ${pioneer.name} (${pioneer.email})`);
            topPublishersData.push({
                userId: existing.id,
                name: pioneer.name,
                avatar: null,
                postCount: pioneer.posts,
                totalEngagement: pioneer.engagement,
            });
            if (pioneer.referrals > 0) {
                topReferrersData.push({
                    userId: existing.id,
                    name: pioneer.name,
                    avatar: null,
                    activeReferrals: pioneer.referrals,
                    tier: pioneer.referrals >= 5 ? 'palier_5' : 'palier_1',
                });
            }
            continue;
        }

        // 1. Create the Organisation
        const org = await prisma.organization.create({
            data: {
                name: `Org ${pioneer.name}`,
                domain: `${pioneer.email.split('@')[0]}.ela.internal`,
                mrr: pioneer.mrr,
                creditBalance: 500,
                tier: pioneer.tier,
                status: 'active',
            },
        });

        // 2. Create the User, linked to the Organisation
        const user = await prisma.user.create({
            data: {
                name: pioneer.name,
                email: pioneer.email,
                referralCode: `GENESIS-${pioneer.name.replace(/[^A-Za-z]/g, '').toUpperCase()}`,
                currentPlan: pioneer.tier,
                organizationId: org.id,
            },
        });

        console.log(`✅ Créé : ${pioneer.name} (${user.id}) — Org: ${org.id}`);

        // 3. Create learnt AI Profile for this organisation
        await prisma.aIProfile.create({
            data: {
                organizationId: org.id,
                bestPostTimes: JSON.stringify({ LINKEDIN: ['08:30', '12:15', '18:00'] }),
                topHashtags: JSON.stringify(['#Growth', '#SaaS', '#Automation', '#Souveraineté']),
                avgEngagement: Math.round(pioneer.engagement / Math.max(pioneer.posts, 1)),
                publishCount: pioneer.posts,
                successRate: parseFloat((Math.random() * 20 + 75).toFixed(2)),
                consentGiven: true,
            },
        });

        console.log(`   🤖 AIProfile(${pioneer.name}) initialisé.`);

        // 4. Simulate published posts to seed ContentStat data
        for (let i = 0; i < pioneer.posts; i++) {
            const post = await prisma.post.create({
                data: {
                    userId: user.id,
                    platform: i % 2 === 0 ? 'LINKEDIN' : 'X_PLATFORM',
                    content: `[GENESIS] Post ${i + 1} de ${pioneer.name} — La souveraineté algorithmique n'est pas une option, c'est l'infrastructure. #SaaS #ELA`,
                    status: 'published',
                    publishedAt: new Date(Date.now() - (pioneer.posts - i) * 6 * 60 * 60 * 1000), // staggered over last N*6h
                    performance_score: parseFloat((Math.random() * 40 + 55).toFixed(2)),
                },
            });

            // Add simulated engagement stats per post
            await prisma.contentStat.create({
                data: {
                    postId: post.id,
                    platform: post.platform,
                    views: Math.round((pioneer.engagement / pioneer.posts) * (0.8 + Math.random() * 0.4)),
                    likes: Math.round((pioneer.engagement / pioneer.posts) * 0.04 * (0.5 + Math.random())),
                    comments: Math.round((pioneer.engagement / pioneer.posts) * 0.007 * (0.5 + Math.random())),
                    shares: Math.round((pioneer.engagement / pioneer.posts) * 0.005 * (0.5 + Math.random())),
                    saves: Math.round((pioneer.engagement / pioneer.posts) * 0.003),
                    clicks: Math.round((pioneer.engagement / pioneer.posts) * 0.02),
                    collectedAt: new Date(),
                },
            });
        }

        console.log(`   📊 ${pioneer.posts} posts + ContentStats injectés.`);

        // Queue for Leaderboard payload
        topPublishersData.push({
            userId: user.id,
            name: pioneer.name,
            avatar: null,
            postCount: pioneer.posts,
            totalEngagement: pioneer.engagement,
        });

        if (pioneer.referrals > 0) {
            topReferrersData.push({
                userId: user.id,
                name: pioneer.name,
                avatar: null,
                activeReferrals: pioneer.referrals,
                tier: pioneer.referrals >= 5 ? 'palier_5' : 'palier_1',
            });
        }
    }

    // ── Sort leaderboard data ─────────────────────────────────────────────────
    topPublishersData.sort((a, b) => b.totalEngagement - a.totalEngagement);
    topReferrersData.sort((a, b) => b.activeReferrals - a.activeReferrals);

    // ── Create First Leaderboard Snapshot ────────────────────────────────────
    const now = new Date();
    const week = `${now.getFullYear()}-W${String(getISOWeek(now)).padStart(2, '0')}`;

    const existing = await prisma.leaderboardSnapshot.findUnique({ where: { period: week } });
    if (existing) {
        await prisma.leaderboardSnapshot.update({
            where: { period: week },
            data: {
                topPublishers: JSON.stringify(topPublishersData.slice(0, 10)),
                topReferrers: JSON.stringify(topReferrersData.slice(0, 10)),
                generatedAt: new Date(),
            },
        });
        console.log(`\n🔄 Leaderboard "${week}" mis à jour.`);
    } else {
        await prisma.leaderboardSnapshot.create({
            data: {
                period: week,
                topPublishers: JSON.stringify(topPublishersData.slice(0, 10)),
                topReferrers: JSON.stringify(topReferrersData.slice(0, 10)),
                generatedAt: new Date(),
            },
        });
        console.log(`\n🏆 Premier Classement "${week}" généré.`);
    }

    console.log('\n🎯 Top Publishers de la Semaine :');
    topPublishersData.slice(0, 5).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} — ${p.postCount} posts / ${p.totalEngagement} engagements`);
    });

    console.log('\n🌐 Top Référents :');
    if (topReferrersData.length === 0) {
        console.log('  (Aucun référent actif pour cette période)');
    } else {
        topReferrersData.forEach((r, i) => {
            console.log(`  ${i + 1}. ${r.name} — ${r.activeReferrals} filleuls actifs (${r.tier})`);
        });
    }

    console.log('\n✅ Genèse terminée. Le Mouvement Perpétuel est initié.\n');
}

// ── ISO Week helper ──────────────────────────────────────────────────────────
function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

main()
    .catch((e) => {
        console.error('💥 Erreur Genèse :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
