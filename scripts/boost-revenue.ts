import { SalesAgent } from "../lib/agents/sales-agent";
import { prisma } from "../core/db";

async function boost() {
    console.log("🚀 [BoostRevenue] Lancement du Commando de Ventes Live...");

    const agent = new SalesAgent();
    
    // 1. Force a high-intensity session
    const org = await prisma.organization.findFirst({ where: { name: { contains: 'ELA' } } });
    if (!org) {
        console.error("Aucune organisation ELA trouvée pour porter la croissance.");
        return;
    }

    console.log(`🎯 Targeting Growth for: ${org.name} (ID: ${org.id})`);

    // EXÉCUTION DU CYCLE COMPLET
    // Note: We pass orgId to searchLeads in the new version
    const result = await agent.execute();
    console.log("📊 Cycle de Prospection terminé:", result);

    // 2. FORCE CLOSING (Sur les leads Warm existants)
    console.log("💰 Tentative de Closing High-Priority...");
    const closedCount = await agent.closeWarmLeads();
    console.log(`✅ Deals Closés aujourd'hui: ${closedCount}`);

    console.log("🏁 Boost terminé. L'argent devrait 'rentrer' dans le Ledger.");
}

boost().catch(console.error);
