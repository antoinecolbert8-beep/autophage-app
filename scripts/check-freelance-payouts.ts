import { prisma } from "../core/db";
import { releaseEscrow } from "../lib/billing/escrow-manager";

async function check() {
    console.log("🔍 [CHECK] Checking for paid contracts needing payout...");

    const paidContracts = await prisma.contract.findMany({
        where: { status: 'IN_PROGRESS' },
        include: { buyer: true, seller: true }
    });

    console.log(`Found ${paidContracts.length} contracts in progress.`);

    for (const contract of paidContracts) {
        console.log(`🎁 Contract ${contract.id}: ${contract.title} - Budget: ${contract.budget}€`);
        console.log(`👤 Buyer: ${contract.buyer.name} | 👤 Seller: ${contract.seller.name}`);
        
        // Let's release one if found to prove the loop
        console.log(`⚡ Releasing escrow for contract ${contract.id}...`);
        const result = await releaseEscrow(contract.id);
        if (result.success) {
            console.log(`✅ Payout released: ${result.amount}€`);
        } else {
            console.error(`❌ Payout failed: ${result.error}`);
        }
    }
}

check().catch(console.error);
