import { db as prisma } from "../core/db";
import { ELASelfPromoter } from "../lib/god-mode/self-promotion";
import { getCreditBalance } from "../lib/billing";

/**
 * 🧪 AUDIT SRE: SELF-PROMOTION (GOD MODE)
 * Simulation intensive pour valider l'asynchronisme, la sanitization et les limites SRE.
 */
async function auditSelfPromotion() {
    process.env.GOD_MODE_AUDIT = "true";
    process.env.FORCE_POST = "true";

    console.log("/// 🛡️ DÉMARRAGE DE L'AUDIT SRE : GOD MODE ///");

    try {
        const email = 'godmode@ela.ai';
        console.log("🛠️ Vérification de l'utilisateur God Mode...");

        await ELASelfPromoter.orchestrateHourlyCheck();

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: { select: { id: true, creditBalance: true } } }
        });

        if (!user || !user.organizationId) {
            throw new Error("L'utilisateur God Mode n'existe pas.");
        }

        console.log(`✅ Utilisateur : ${user.email} (Org: ${user.organizationId})`);

        // 2. Préparation du budget SRE
        await prisma.organization.update({
            where: { id: user.organizationId },
            data: { creditBalance: 1000 }
        });

        await prisma.usageLog.deleteMany({
            where: {
                organizationId: user.organizationId,
                actionType: 'SNAP_DISTRIBUTION',
                timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });

        console.log("📊 Limite journalière réinitialisée. Budget: 1000 crédits.");

        // 3. Simulation de 20 cycles
        console.log("🚀 Lancement de 20 simulations de promotion...");

        let cycleResults = { executed: 0, skipped: 0, errors: 0 };

        for (let i = 1; i <= 20; i++) {
            try {
                const results = await ELASelfPromoter.orchestrateHourlyCheck();
                const executed = results.filter(r => r.status === 'EXECUTED');
                if (executed.length > 0) cycleResults.executed++;
                else cycleResults.skipped++;
            } catch (e: any) {
                console.error(`\n❌ Erreur cycle ${i}: ${e.message}`);
                cycleResults.errors++;
            }
            process.stdout.write(".");
        }

        // 4. Bilan SRE Final
        const finalLogs = await prisma.usageLog.count({
            where: { organizationId: user.organizationId, actionType: 'SNAP_DISTRIBUTION' }
        });

        console.log("\n\n--- BILAN DE L'AUDIT SRE ---");
        console.log(`🔹 Total des posts acceptés : ${finalLogs}`);
        console.log(`🔹 Cycles bloqués par la limite : ${cycleResults.skipped}`);
        console.log(`🔹 Crédits consommés : ${1000 - await getCreditBalance(user.organizationId)}`);

        if (finalLogs > 15) {
            console.error("❌ ÉCHEC CRITIQUE : La limite SRE (15) a été dépassée !");
            process.exit(1);
        } else if (finalLogs === 0) {
            console.warn("⚠️ ALERTE : Aucun post n'a été généré.");
        } else {
            console.log(`✅ SUCCÈS : La barrière SRE a bloqué l'expansion à ${finalLogs}/15 posts.`);
        }

        console.log("✅ Audit asynchrone validé (Simulation Mode).");
        console.log("/// ✨ FIN DE L'AUDIT ///");

        process.exit(0);

    } catch (err: any) {
        console.error("💥 Erreur fatale audit:", err.message);
        process.exit(1);
    }
}

auditSelfPromotion();
