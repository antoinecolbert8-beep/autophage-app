import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

/**
 * 🧠 AUDIT VERTEX AI / GEMINI (APEX CERTIFICATION)
 */
async function auditVertexAI() {
    console.log("\n///  🧠 AUDIT VERTEX AI & CERVEAU IA  ///\n");

    const results: { check: string; status: '✅' | '⚠️' | '❌'; detail: string }[] = [];

    // 1. Vérification des clés
    const vertexKey = process.env.VERTEX_AI_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const activeKey = vertexKey || googleKey;

    results.push({
        check: "VERTEX_AI_API_KEY",
        status: vertexKey ? '✅' : '⚠️',
        detail: vertexKey ? `Présente (${vertexKey.substring(0, 12)}...)` : "Absente - utilise GOOGLE_API_KEY"
    });
    results.push({
        check: "OPENAI_API_KEY (Tier-2 Fallback)",
        status: openaiKey ? '✅' : '⚠️',
        detail: openaiKey ? `Présente (${openaiKey.substring(0, 12)}...)` : "Absente - pas de fallback GPT-4o"
    });

    // 2. Test Gemini Flash (Primaire)
    if (activeKey) {
        console.log("   🔵 Test Gemini Flash (Tier-1)...");
        try {
            const genAI = new GoogleGenerativeAI(activeKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const start = Date.now();
            const result = await model.generateContent("Réponds uniquement 'OK' en un mot.");
            const resp = result.response.text();
            const latency = Date.now() - start;
            results.push({
                check: "Gemini 1.5-Flash (Tier-1 Primaire)",
                status: '✅',
                detail: `Réponse: "${resp.trim()}" — Latence: ${latency}ms`
            });
        } catch (e: any) {
            results.push({
                check: "Gemini 1.5-Flash (Tier-1 Primaire)",
                status: '❌',
                detail: `Erreur: ${e.message}`
            });
        }

        // 3. Test Gemini 2.0 Flash Exp (Used by ELA agents)
        console.log("   🔵 Test Gemini 2.0-Flash-Exp (Agents)...");
        try {
            const genAI = new GoogleGenerativeAI(activeKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const start = Date.now();
            const result = await model.generateContent("Quel est ton rôle dans ELA ? Réponds en 1 phrase.");
            const resp = result.response.text();
            const latency = Date.now() - start;
            results.push({
                check: "Gemini 2.0-Flash-Exp (Agents ELA)",
                status: '✅',
                detail: `OK — Latence: ${latency}ms | Réponse: "${resp.trim().substring(0, 60)}..."`
            });
        } catch (e: any) {
            results.push({
                check: "Gemini 2.0-Flash-Exp (Agents ELA)",
                status: '⚠️',
                detail: `Indisponible (modèle expérimental): ${e.message.substring(0, 80)}`
            });
        }
    } else {
        results.push({
            check: "Gemini (Tier-1 Primaire)",
            status: '❌',
            detail: "Aucune clé Google/Vertex configurée"
        });
    }

    // 4. Test OpenAI GPT-4o (Fallback Tier-2)
    if (openaiKey) {
        console.log("   🟢 Test OpenAI GPT-4o (Tier-2 Fallback)...");
        try {
            const openai = new OpenAI({ apiKey: openaiKey });
            const start = Date.now();
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: "Génère un mot aléatoire en français." }],
                max_tokens: 10
            });
            const latency = Date.now() - start;
            const resp = completion.choices[0].message.content;
            results.push({
                check: "OpenAI GPT-4o-mini (Tier-2 Fallback)",
                status: '✅',
                detail: `Réponse: "${resp}" — Latence: ${latency}ms`
            });
        } catch (e: any) {
            results.push({
                check: "OpenAI GPT-4o-mini (Tier-2 Fallback)",
                status: '❌',
                detail: `Erreur: ${e.message}`
            });
        }
    }

    // 5. Test de génération de topic (Self-Promotion flow)
    console.log("   🔴 Test génération de topic viral...");
    try {
        const genAI = new GoogleGenerativeAI(activeKey || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Tu es le moteur de l'Empire ELA. Génère UN sujet de post LinkedIn ultra-viral en 1 phrase. Langue: Français.`;
        const result = await model.generateContent(prompt);
        const topic = result.response.text().trim();
        results.push({
            check: "Génération de topic viral (Auto-Promotion)",
            status: topic.length > 10 ? '✅' : '⚠️',
            detail: `"${topic.substring(0, 80)}..."`
        });
    } catch (e: any) {
        results.push({
            check: "Génération de topic viral",
            status: '❌',
            detail: `Erreur: ${e.message}`
        });
    }

    console.log("=".repeat(65));
    results.forEach(r => {
        console.log(`${r.status}  ${r.check}`);
        console.log(`     → ${r.detail}\n`);
    });
    console.log("=".repeat(65));
    const ok = results.filter(r => r.status === '✅').length;
    const warn = results.filter(r => r.status === '⚠️').length;
    const err = results.filter(r => r.status === '❌').length;
    console.log(`\nRésumé: ${ok} ✅ | ${warn} ⚠️ | ${err} ❌\n`);

    return results;
}

auditVertexAI().catch(console.error);
