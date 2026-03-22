import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📊 AUDIT FINANCIER ELA 2026\n');

    try {
        const orgs = await prisma.organization.count();
        const mrr = await prisma.organization.aggregate({ _sum: { mrr: true } });
        
        const users = await prisma.user.count();
        const customers = await prisma.user.count({ where: { NOT: { stripeCustomerId: null } } });
        
        const leads = await prisma.lead.count();
        const convertedLeads = await prisma.lead.count({ where: { stage: 'converted' } });
        
        const conversions = await prisma.conversion.aggregate({ 
            _count: true,
            _sum: { value: true } 
        });
        
        const credits = await prisma.creditPurchase.aggregate({
            _count: true,
            _sum: { amountPaid: true }
        });

        const warChest = await prisma.warChest.aggregate({
            _sum: { available_budget_cents: true }
        });

        console.log(`🏢 Organisations : ${orgs}`);
        console.log(`💰 MRR Total : ${mrr._sum.mrr || 0}€`);
        console.log(`👤 Utilisateurs : ${users} (${customers} clients Stripe)`);
        console.log(`🎯 Leads : ${leads} (${convertedLeads} convertis)`);
        console.log(`📈 Valeur Conversions : ${conversions._sum.value || 0}€ (${conversions._count} events)`);
        console.log(`💳 Crédits Achetés : ${credits._sum.amountPaid || 0}€ (${credits._count} achats)`);
        console.log(`🛡️ WarChest Budget : ${(warChest._sum.available_budget_cents || 0) / 100}€`);

    } catch (error) {
        console.error('❌ Erreur Audit:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
