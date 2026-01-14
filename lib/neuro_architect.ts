import { OpenAI } from "openai";

/**
 * 🔱 GRAND MAÎTRE HORLOGER - ARCHITECTURE NEURO-LINGUISTIQUE
 * Module de calibrage fin pour la communication autonome.
 */

export interface NeuroProfile {
    pace: 'HIGH_PACE' | 'LOW_PACE';
    trust_vocabulary: string[];
    cognitive_bias: string;
}

export class NeuroLinguisticArchitect {

    /**
     * 1. ANALYSE SPECTRALE
     * Détermine le Tempo Cognitif et le Vocabulaire de Confiance.
     */
    public static async analyzeSpectrum(lastPosts: string[]): Promise<NeuroProfile> {
        // Simulation d'analyse (à connecter avec IA réelle)
        const combinedText = lastPosts.join(" ");

        // Heuristiques simples (pour l'instant)
        const highPaceMarkers = ["vite", "asap", "maintenant", "croissance", "scalabilité", "roi", "go"];
        const lowPaceMarkers = ["réflexion", "analyse", "fond", "structure", "durable", "éthique", "pourquoi"];

        let hpScore = 0;
        let lpScore = 0;

        highPaceMarkers.forEach(w => { if (combinedText.toLowerCase().includes(w)) hpScore++; });
        lowPaceMarkers.forEach(w => { if (combinedText.toLowerCase().includes(w)) lpScore++; });

        return {
            pace: hpScore >= lpScore ? 'HIGH_PACE' : 'LOW_PACE',
            trust_vocabulary: hpScore >= lpScore ? highPaceMarkers : lowPaceMarkers,
            cognitive_bias: hpScore >= lpScore ? "Action-Oriented" : "Analysis-Paralysis"
        };
    }

    /**
     * 2. LA RÈGLE DU FONDU ENCHAÎNÉ (Golden Ratio Generator)
     * Génère un System Prompt calibré pour l'IA de rédaction.
     */
    public static generateSystemPrompt(profile: NeuroProfile): string {
        const isHighPace = profile.pace === 'HIGH_PACE';

        return `
    RÔLE: Grand Maître Horloger de la Communication.
    CIBLE: ${profile.pace} (${profile.cognitive_bias}).
    MOTS-CLÉS DE CONFIANCE: ${profile.trust_vocabulary.join(", ")}.

    INSTRUCTIONS STRICTES DE RÉDACTION:
    1. **Ratio d'Or (1.618)**: Apporte 1.6x plus de valeur (insight, data) que de demande.
    2. **Fondu Enchaîné**: INTERDICTION de commencer par "Bonjour" ou "Je suis". Attaque par le contexte ("Ton post sur X...").
    3. **Structure Asymétrique**:
       - Paragraphes courts (max 2 lignes).
       - Variation de longueur des phrases pour fluidité visuelle.
    4. **Tonalité**: Chirurgicale. ${isHighPace ? "Droit au but. Bullet points. Data." : "Nuancée. Explicative. Visionnaire."}
    
    OBJECTIF: Convertir sans vendre. Créer une résonance cognitive.
    `;
    }

    /**
     * 4. CALCUL DE SOUVERAINETÉ (Self-Correction)
     * Simule la friction de lecture.
     */
    public static computeFrictionScore(message: string): number {
        const wordCount = message.split(" ").length;
        const sentenceCount = message.split(/[.!?]+/).length;

        // Indice de lisibilité simplifié
        const avgWordsPerSentence = wordCount / (sentenceCount || 1);

        // Pénalités
        const forbiddenWords = ["juste", "petit", "peut-être", "très", "vraiment"];
        let friction = 0;

        forbiddenWords.forEach(w => {
            if (message.toLowerCase().includes(w)) friction += 10; // +10 points de friction par mot poubelle
        });

        if (avgWordsPerSentence > 15) friction += 5; // Phrase trop longue

        // Estimation temps de lecture (4 mots/sec pour scan rapide)
        const readTime = wordCount / 4;
        if (readTime > 4) friction += (readTime - 4) * 10; // Pénalité si > 4 sec d'intention

        return Math.max(0, 100 - friction); // Score sur 100
    }
}
