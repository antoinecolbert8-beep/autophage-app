
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSales() {
    console.log("🔍 VÉRIFICATION DES VENTES\n");

    // 1. Check Subscriptions
    const subscriptions = await prisma.subscription.findMany({
        where: {
            status: { in: ['active', 'past_due'] }
        },
        include: {
            user: {
                select: { email: true, name: true, currentPlan: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 ABONNEMENTS ACTIFS: ${subscriptions.length}\n`);

    if (subscriptions.length > 0) {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        subscriptions.forEach(sub => {
            console.log(`✅ ${sub.user.name || sub.user.email}`);
            console.log(`   Plan: ${sub.plan.toUpperCase()}`);
            console.log(`   Statut: ${sub.status}`);
            console.log(`   Début: ${sub.createdAt.toLocaleDateString('fr-FR')}`);
            if (sub.periodEnd) {
                console.log(`   Fin période: ${new Date(sub.periodEnd).toLocaleDateString('fr-FR')}`);
            }
            console.log("");
        });
    }

    // 2. Check Credit Purchases
    const creditPurchases = await prisma.creditPurchase.findMany({
        include: {
            organization: {
                select: { name: true }
            }
        },
        orderBy: { timestamp: 'desc' },
        take: 20
    });

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n💰 ACHATS DE CRÉDITS: ${creditPurchases.length}\n`);

    if (creditPurchases.length > 0) {
        let totalRevenue = 0;
        creditPurchases.forEach(purchase => {
            const amount = purchase.amountPaid || 0;
            totalRevenue += amount;
            console.log(`💳 ${purchase.organization.name}`);
            console.log(`   Crédits: ${purchase.credits}`);
            console.log(`   Montant: ${amount.toFixed(2)}€`);
            console.log(`   Date: ${purchase.timestamp.toLocaleDateString('fr-FR')}`);
            console.log("");
        });

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`\n📈 REVENU TOTAL: ${totalRevenue.toFixed(2)}€`);
    }

    // 3. Check Conversions (in Lead table)
    const conversions = await prisma.conversion.findMany({
        include: {
            lead: {
                select: { email: true, company: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    console.log(`\n🎯 CONVERSIONS: ${conversions.length}\n`);

    if (conversions.length > 0) {
        conversions.forEach(conv => {
            console.log(`${conv.type === 'purchase' ? '💰' : '🎯'} ${conv.type.toUpperCase()}`);
            console.log(`   Lead: ${conv.lead.email}`);
            console.log(`   Valeur: ${conv.value.toFixed(2)}€`);
            console.log(`   Source: ${conv.source}`);
            console.log(`   Date: ${conv.createdAt.toLocaleDateString('fr-FR')}`);
            console.log("");
        });
    }

    // Summary
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📊 RÉSUMÉ");
    console.log(`   Abonnements actifs: ${subscriptions.length}`);
    console.log(`   Achats de crédits: ${creditPurchases.length}`);
    console.log(`   Conversions totales: ${conversions.length}`);
    console.log("");
}

checkSales()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
