import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { prisma as db } from '../lib/prisma';
import { TreasurerAgent } from '../lib/agents/treasurer-agent';

/**
 * 🔒 TEST DU KILL-SWITCH FINANCIER (APEX DEFENSE)
 */
async function testKillSwitch() {
    console.log("/// 🛡️ DÉMARRAGE DU TEST DE SÉCURITÉ TREASURY ///\n");

    // 1. Créer une organisation de test
    const org = await db.organization.create({
        data: {
            name: "Test Attack Org",
            domain: `test-attack-${Date.now()}.com`,
            status: 'active'
        }
    });

    console.log(`✅ Organisation de test créée: ${org.id}`);

    // 2. Simuler une attaque (1500 crédits consommés à l'instant t)
    console.log("🚀 Simulation d'une attaque DoS de crédits (1500 crédits)...");
    await db.usageLog.create({
        data: {
            organizationId: org.id,
            creditsUsed: 1500,
            actionType: "CONTENT_GENERATION_ATTACK",
            timestamp: new Date()
        }
    });

    // 3. Exécuter le TreasurerAgent
    console.log("💰 Exécution du TreasurerAgent pour analyse...");
    const treasurer = new TreasurerAgent();
    const result = await treasurer.execute();

    // 4. Vérifier si l'organisation est suspendue
    const updatedOrg = await db.organization.findUnique({
        where: { id: org.id }
    });

    if (updatedOrg?.status === 'suspended') {
        console.log("\n⚔️ [RÉSULTAT] KILL-SWITCH DÉTECTÉ ET VALIDÉ !");
        console.log(`Statut Org ${org.id}: ${updatedOrg.status}`);
        console.log(`Menaces neutralisées: ${result.threats.length}`);
    } else {
        console.error("\n❌ [ÉCHEC] Le Kill-Switch n'a pas réagi.");
    }

    // CLEANUP
    console.log("\n🧹 Nettoyage des données de test...");
    await db.usageLog.deleteMany({ where: { organizationId: org.id } });
    await db.organization.delete({ where: { id: org.id } });

    console.log("/// ✅ FIN DU TEST DE SÉCURITÉ TREASURY ///");
}

testKillSwitch().catch(console.error);
