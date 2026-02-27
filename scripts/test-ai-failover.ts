import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { generateCriticalContent } from '../lib/ai-orchestrator';

/**
 * 🧪 TEST DE DÉFAILLANCE AI (APEX FAILOVER)
 */
async function testAIFailover() {
    console.log("/// 🤖 DÉMARRAGE DU TEST DE RÉSILIENCE APEX AI ///\n");

    const testRequest = {
        topic: "L'ascension de l'Empire ELA",
        platform: "LINKEDIN" as const,
        contentType: "TEXT" as const,
        tone: "viral" as const
    };

    // SCÉNARIO 1: NOMINAL (Tout fonctionne)
    console.log("--- SCÉNARIO 1: OPÉRATIONS NOMINALES ---");
    try {
        const out1 = await generateCriticalContent(testRequest);
        console.log(`Résultat: ${out1.text.substring(0, 50)}...`);
        console.log(`Tier détecté: ${out1.metadata?.tier || '1/2'}\n`);
    } catch (e) {
        console.error("Échec Scénario 1:", (e as Error).message);
    }

    // SCÉNARIO 2: ÉCHEC GEMINI (Tier-2 Fallback)
    console.log("--- SCÉNARIO 2: DÉFAILLANCE GEMINI (FALLBACK OPENAI) ---");
    const originalGeminiKey = process.env.VERTEX_AI_API_KEY || process.env.GOOGLE_API_KEY;
    process.env.VERTEX_AI_API_KEY = "invalid_key";
    process.env.GOOGLE_API_KEY = "invalid_key";

    try {
        const out2 = await generateCriticalContent(testRequest);
        console.log(`Résultat: ${out2.text.substring(0, 50)}...`);
        console.log(`Modèle utilisé: ${out2.metadata?.model}`);
        console.log(`Tier détecté: ${out2.metadata?.tier || '2'}\n`);
    } catch (e) {
        console.error("Échec Scénario 2:", (e as Error).message);
    }

    // SCÉNARIO 3: ÉCHEC TOTAL (Tier-3/4 Emergency)
    console.log("--- SCÉNARIO 3: BLACK SWAN (GEMINI + OPENAI DOWN) ---");
    const originalOpenAIKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "invalid_key";

    try {
        const out3 = await generateCriticalContent(testRequest);
        console.log(`Résultat: ${out3.text.substring(0, 50)}...`);
        console.log(`Mode Urgence: ${out3.metadata?.emergencyMode ? 'ACTIF' : 'NON'}`);
        console.log(`Tier détecté: ${out3.metadata?.tier}\n`);
    } catch (e) {
        console.error("Échec Scénario 3:", (e as Error).message);
    }

    // RESTAURATION DES CLÉS (Sécurité)
    process.env.VERTEX_AI_API_KEY = originalGeminiKey;
    process.env.GOOGLE_API_KEY = originalGeminiKey;
    process.env.OPENAI_API_KEY = originalOpenAIKey;

    console.log("/// ✅ FIN DU TEST DE RÉSILIENCE APEX AI ///");
}

testAIFailover().catch(console.error);
