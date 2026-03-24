import { prisma } from "../core/db";

async function main() {
    console.log("🔍 [OrgRepair] Auditing Organizations (V2)...");
    
    const orgs = await prisma.organization.findMany();
    
    for (const org of orgs) {
        console.log(`🏢 Org: ${org.name} (${org.id}) - Status: ${org.status} - Credits: ${org.creditBalance}`);
        
        // Reactivate and Fund
        console.log(`⚡ Activating and funding ${org.name}...`);
        await prisma.organization.update({
            where: { id: org.id },
            data: {
                status: 'ACTIVE',
                creditBalance: 1000000 
            }
        });
        console.log("✅ Done.");
    }
}

main().catch(console.error);
