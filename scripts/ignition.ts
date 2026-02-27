import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Démarrage de la Séquence d\'Ignition ELA...');

    // 1. Nettoyage optionnel
    // const existingUser = await prisma.user.findUnique({ where: { email: 'antoine.colbert@ela.ai' } });

    // 2. Création de l'Organisation Souveraine
    const org = await prisma.organization.upsert({
        where: { domain: 'ela.ai' },
        update: {
            creditBalance: 10000,
            tier: 'pro',
            status: 'active',
            name: 'La Manufacture ELA',
        },
        create: {
            name: 'La Manufacture ELA',
            domain: 'ela.ai',
            tier: 'pro',
            creditBalance: 10000,
            status: 'active',
        },
    });

    // 3. Création de l'AI Profile Parfait (Champs conformes au schema.prisma)
    await prisma.aIProfile.upsert({
        where: { organizationId: org.id },
        update: {
            bestPostTimes: JSON.stringify({ "LINKEDIN": ["09:00", "18:00"] }),
            topHashtags: JSON.stringify(["#SaaS", "#AI", "#Growth"]),
            contentStyle: "storytelling",
            avgEngagement: 4.2,
            publishCount: 142,
        },
        create: {
            organizationId: org.id,
            bestPostTimes: JSON.stringify({ "LINKEDIN": ["09:00", "18:00"] }),
            topHashtags: JSON.stringify(["#SaaS", "#AI", "#Growth"]),
            contentStyle: "storytelling",
            avgEngagement: 4.2,
            publishCount: 142,
        },
    });

    // 4. Création du Patient Zéro : Antoine Colbert
    const user = await prisma.user.upsert({
        where: { email: 'antoine.colbert@ela.ai' },
        update: {
            name: 'Antoine Colbert',
            role: 'admin',
            referralCode: 'GENESIS',
            currentPlan: 'pro',
        },
        create: {
            email: 'antoine.colbert@ela.ai',
            name: 'Antoine Colbert',
            role: 'admin',
            organizationId: org.id,
            referralCode: 'GENESIS',
            currentPlan: 'pro',
        },
    });

    // 5. Injection dans le Leaderboard (Snapshot)
    const currentPeriod = format(new Date(), "yyyy-'W'II"); // ex: 2026-W09

    const topPublishers = [
        {
            userId: user.id,
            name: user.name,
            avatar: null,
            postCount: 142,
            totalEngagement: 42000,
        }
    ];

    const topReferrers = [
        {
            userId: user.id,
            name: user.name,
            avatar: null,
            activeReferrals: 25,
            tier: 5, // Master Level
        }
    ];

    await prisma.leaderboardSnapshot.upsert({
        where: { period: currentPeriod },
        update: {
            topPublishers: JSON.stringify(topPublishers),
            topReferrers: JSON.stringify(topReferrers),
            generatedAt: new Date(),
        },
        create: {
            period: currentPeriod,
            topPublishers: JSON.stringify(topPublishers),
            topReferrers: JSON.stringify(topReferrers),
        },
    });

    console.log('✅ Ignition terminée avec succès.');
    console.log('👤 Patient Zéro : Antoine Colbert (L\'Horloger)');
    console.log('💎 Crédits Souverains : 10,000');
    console.log('🧬 Code Parrainage : GENESIS');
    console.log('🏆 Leaderboard : Antoine Colbert est en tête (Snapshot ' + currentPeriod + ')');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors de l\'ignition:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
