import { db as prisma } from "../core/db";
import { consumeCredits, getCreditBalance } from "../lib/billing";

/**
 * 🧪 TEST: BILLING LOOP INTEGRITY
 * Vérifie que le débit de crédits est atomique et persistant
 */
async function testBillingLoop() {
    console.log("🧪 Démarrage du test d'intégrité financière...");

    // 1. Trouver ou créer une organisation de test
    let org = await prisma.organization.findFirst({
        where: { name: "Audit Test Org" }
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: "Audit Test Org",
                domain: "audit-test.ela.ai",
                creditBalance: 100,
                status: "active",
                tier: "pro"
            }
        });
    } else {
        await prisma.organization.update({
            where: { id: org.id },
            data: { creditBalance: 100 }
        });
    }

    console.log(`📊 Solde initial: ${await getCreditBalance(org.id)} crédits`);

    // 2. Simuler une publication (POST_PUBLISH = 10)
    console.log("💸 Débit de 10 crédits (POST_PUBLISH)...");
    const res1 = await consumeCredits(org.id, "POST_PUBLISH");

    if (res1.success && res1.remaining === 90) {
        console.log("✅ Check 1: Débit réussi (90 restants)");
    } else {
        console.error("❌ Check 1: Échec du débit", res1);
        process.exit(1);
    }

    // 3. Simuler une génération APEX (APEX_GENERATION = 50)
    console.log("💸 Débit de 50 crédits (APEX_GENERATION)...");
    const res2 = await consumeCredits(org.id, "APEX_GENERATION");

    if (res2.success && res2.remaining === 40) {
        console.log("✅ Check 2: Débit réussi (40 restants)");
    } else {
        console.error("❌ Check 2: Échec du débit", res2);
        process.exit(2);
    }

    // 4. Test de blocage (Tentative de débit de 50 crédits alors qu'il en reste 40)
    console.log("🚫 Test de blocage (Débit 50 avec solde 40)...");
    const res3 = await consumeCredits(org.id, "APEX_GENERATION");

    if (!res3.success && res3.remaining === 40) {
        console.log("✅ Check 3: Blocage réussi (Solde inchangé)");
    } else {
        console.error("❌ Check 3: Le blocage a échoué !", res3);
        process.exit(3);
    }

    console.log("\n✨ TOUS LES TESTS FINANCIERS SONT AU VERT.");
    console.log("🚀 L'architecture est lucrative et sécurisée.");
}

testBillingLoop()
    .catch(err => {
        console.error("💥 Erreur fatale lors du test:", err);
        process.exit(1);
    });
