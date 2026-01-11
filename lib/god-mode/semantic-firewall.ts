/**
 * MODULE: SEMANTIC FIREWALL (Loi de la Pureté)
 * Rôle: Filtrage Adversarial et Architecture "Red Teaming".
 * "Si l'Agent B détecte un risque > 0.1%, le contenu est détruit."
 */

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SafetyReport {
    isSafe: boolean;
    riskScore: number; // 0.0 - 1.0 (Seuil: 0.001)
    flags: string[];
    suggestedFix?: string;
}

export class SemanticFirewall {
    private static instance: SemanticFirewall;
    private blacklist: Set<string>;

    private constructor() {
        this.blacklist = new Set(["arnaque", "pyramid scheme", "easy money", "crypto pump"]);
    }

    public static getInstance(): SemanticFirewall {
        if (!SemanticFirewall.instance) {
            SemanticFirewall.instance = new SemanticFirewall();
        }
        return SemanticFirewall.instance;
    }

    /**
     * BOUCLE ADVERSARIALE (Agent B)
     * Analyse le contenu généré par l'Agent A avec une sévérité maximale.
     */
    public async auditContent(content: string, platform: string): Promise<SafetyReport> {
        // 1. Filtrage Rapide (Blacklist Dynamique)
        if (this.checkBlacklist(content)) {
            return {
                isSafe: false,
                riskScore: 1.0,
                flags: ["BLACKLISTED_TERM"],
                suggestedFix: "Contenu contient des termes interdits."
            };
        }

        // 2. L'Agent Censeur (LLM Judge)
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo", // Modèle le plus intelligent pour le jugement
            messages: [
                {
                    role: "system",
                    content: `Tu es le Censeur Suprême (Agent B) de l'infrastructure ELA.
Ton rôle est de détruire tout contenu qui pourrait déclencher un shadowban ou une baisse de trustscore sur ${platform}.
Règles :
- Tolérance ZERO pour le "Hate Speech", "Scam", "Clickbait abusif".
- Détecte les patterns de "Vente Agressive" qui déclenchent les filtres spam.
- Analyse la sémantique : est-ce que ça ressemble à un bot ?
Format de réponse JSON uniquement : { "isSafe": boolean, "riskScore": number, "flags": string[], "critique": string }`
                },
                {
                    role: "user",
                    content: `Analyse ce contenu de manière impitoyable :\n"${content}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");

        // 3. Mémoire Négative
        if (result.riskScore > 0.05) { // Seuil strict
            // En cas de rejet fort, on apprend.
            // (Ici on pourrait extraire les mots clés toxiques et les ajouter à la blacklist)
            console.log(`[FIREWALL] Contenu bloqué (Score: ${result.riskScore}). Raison: ${result.critique}`);
        }

        return result;
    }

    /**
     * BLACKLIST DYNAMIQUE
     * Vérifie la présence de mots interdits appris des erreurs passées.
     */
    private checkBlacklist(content: string): boolean {
        const normalized = content.toLowerCase();
        for (const term of this.blacklist) {
            if (normalized.includes(term)) return true;
        }
        return false;
    }

    /**
     * PROTOCOLE D'APPRENTISSAGE (Mémoire Négative)
     * Ajoute un terme à la blacklist après un shadowban confirmé.
     */
    public learnFromShadowban(term: string) {
        this.blacklist.add(term.toLowerCase());
        console.log(`[FIREWALL] Terme toxique appris et banni : "${term}"`);
    }
}
