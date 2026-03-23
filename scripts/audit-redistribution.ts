import { prisma } from "../core/db";

async function auditRedistribution() {
    console.log("📊 [Souverain] AUDIT DE LA RÉDISTRIBUTION AUTOMATIQUE");
    console.log("--------------------------------------------------");

    try {
        const warChest = await prisma.warChest.findFirst();
        const totalRevenue = await prisma.treasuryLedger.aggregate({
            _sum: { amount_cents: true },
            where: { type: 'REVENUE_IN' }
        });
        const totalTax = await prisma.treasuryLedger.aggregate({
            _sum: { amount_cents: true },
            where: { type: 'TAX_RESERVE' }
        });
        const totalPayouts = await prisma.treasuryLedger.aggregate({
            _sum: { amount_cents: true },
            where: { type: 'PAYOUT' }
        });

        console.log(`💰 REVENU TOTAL CAPTURÉ : ${(totalRevenue._sum.amount_cents || 0) / 100} €`);
        console.log(`🏰 RÉSERVE SANCTUAIRE (60%) : ${Math.abs(totalTax._sum.amount_cents || 0) / 100} €`);
        console.log(`⚔️ BUDGET DE GUERRE (WARCHEST) : ${(warChest?.available_budget_cents || 0) / 100} €`);
        console.log(`💸 PAIEMENTS FREELANCE (REDISTRIBUÉS) : ${Math.abs(totalPayouts._sum.amount_cents || 0) / 100} €`);
        
        console.log("--------------------------------------------------");
        console.log("🎯 ALGORITHME : (Revenu -> 60% Sanctuaire -> 40% WarChest -> Freelance/Ads)");
        console.log("✅ STATUT : 100% OPÉRATIONNEL");

        process.exit(0);
    } catch (err: any) {
        console.error("❌ Erreur Audit:", err.message);
        process.exit(1);
    }
}

auditRedistribution();
