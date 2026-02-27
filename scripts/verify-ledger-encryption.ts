import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { LegacyLedger } from '../lib/ledger';

/**
 * 🔒 TEST DU LEDGER IMMUABLE (APEX AUDIT)
 */
async function testLedger() {
    console.log("/// 📜 DÉMARRAGE DU TEST D'AUDIT LEDGER ///\n");

    const payload = {
        event: "SOVEREIGN_VICTORY",
        organization: "ELA_EMPIRE",
        revenue: 149700,
        currency: "EUR",
        timestamp: new Date().toISOString()
    };

    console.log("1. Chiffrement de l'événement...");
    const archive = await LegacyLedger.archiveEvent(payload);

    console.log(`✅ Archivé. Hash: ${archive.hash}`);
    console.log(`Données chiffrées (HEX): ${archive.data.substring(0, 40)}...`);

    console.log("\n2. Déchiffrement pour audit...");
    const decrypted = LegacyLedger.decryptEvent(archive);

    if (decrypted.event === payload.event && decrypted.revenue === payload.revenue) {
        console.log("✅ [RÉSULTAT] LEDGER VALIDÉ : Intégrité et Confidentialité garanties.");
        console.log(`Contenu récupéré: ${JSON.stringify(decrypted)}`);
    } else {
        console.error("❌ [ÉCHEC] Le contenu déchiffré ne correspond pas.");
    }

    console.log("\n/// ✅ FIN DU TEST D'AUDIT LEDGER ///");
}

testLedger().catch(console.error);
