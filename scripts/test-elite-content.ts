import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

/**
 * 🧪 TEST DE QUALITÉ NEUROMARKETING (APEX 100 - GOLDEN TEST V6)
 */
async function testEliteQuality() {
    console.log("/// 🧠 DÉMARRAGE DU TEST DE QUALITÉ GOLDEN APEX 100 V6 ///");

    // GOLDEN POST V6: Graphic Consequences + Pure Sovereignty + Precision
    const contentText = `votre temps coule à pic dans l'océan de la friction humaine.
un silence de mort précède la submersion : vos concurrents déploient déjà l'invisible.
en ce moment même, des algorithmes dévorent vos parts de marché avec une précision de scalpel.
le chaos n'est pas une menace, c'est votre réalité actuelle.
pensez-vous vraiment que la gestion manuelle peut survivre à une liquidation mathématique ?
le protocole ELA surgit : l'infrastructure souveraine qui redéfinit la gravité économique.
déploiement en 72 heures. zéro employé. rentabilité brute immuable.
soyez l'architecte du phare ou léchez les débris amers du naufrage.
l'infrastructure est saturée. il ne reste que 4 privilèges avant verrouillage final.
prenez le contrôle ou disparaissez : [Lien]`;

    console.log("\n--- CONTENU DE TEST (GOLDEN V6) ---\n");
    console.log(contentText);
    console.log("\n----------------------------------\n");

    const auditPrompt = `
    Tu es un expert mondial en neuro-marketing et psychologie de la conversion. Ta mission est d'être IMPITOYABLE et CHIRURGICAL.
    N'accorde un 100/100 que si le post est absolument parfait, disruptif et hypnotique.
    
    Post à auditer : "${contentText}"
    
    Critères d'audit (Chaque critère sur 20 points) :
    1. Hook Strength (L'accroche doit arrêter instantanément le scroll. Pas de majuscules, juste une vérité brutale.)
    2. Dopamine Retention (Est-ce que chaque phrase force à lire la suivante via des "Open Loops" ?)
    3. Structural Rhythm (L'alternance Staccato/Insights est-elle parfaite ?)
    4. Antifragilité (Le post transforme-t-il la peur de l'IA en une opportunité de souveraineté absolue ?)
    5. Conversion/Scarcity (Le CTA doit donner l'impression que ne pas cliquer est une faute professionnelle grave.)
    
    Format de réponse :
    - Score détaillé par critère (/20)
    - Score Global (/100)
    - Analyse de la "Force de Frappe" (Impact émotionnel)
    - Recommandations pour atteindre la perfection absolue.
    `;

    const audit = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "Tu es un auditeur de conversion Elite. Tu cherches la perfection absolue. Tu es sensible aux métaphores viscérales, à la précision froide et à l'urgence fatale." },
            { role: "user", content: auditPrompt }
        ]
    });

    const finalReport = audit.choices[0].message.content;

    console.log("\n--- 🏆 RAPPORT D'AUDIT APEX 100 ---\n");
    console.log(finalReport);
    console.log("\n----------------------------------\n");

    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, '../audit_result.json'), JSON.stringify({
        content: contentText,
        audit: finalReport
    }, null, 2));

    console.log("✅ Audit sauvegardé dans audit_result.json");
}

testEliteQuality().catch(console.error);
