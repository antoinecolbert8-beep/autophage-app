import { generateText } from '@/lib/ai/vertex';

/**
 * VIRAL ENGINE - Content Optimization for Maximum Engagement
 */

export class ViralEngine {

    /**
     * Viral Hook Patterns Library
     */
    private static VIRAL_HOOKS = {
        pattern_interrupt: [
            "Tout le monde pense que {topic}, mais voici la vérité brutal:",
            "Hot take: {opinion}",
            "Unpopular opinion sur {subject}:",
            "97% des entrepreneurs se trompent sur {topic}. Voici pourquoi:"
        ],
        fomo: [
            "Si vous n'utilisez pas {solution} maintenant, vous perdez {benefit}",
            "2026 = l'année où {prediction}. Êtes-vous prêt?",
            "Pendant que vos concurrents dorment, voici ce que je fais:",
            "J'ai mis 6 mois à comprendre ce secret. Vous l'aurez en 60 secondes:"
        ],
        social_proof: [
            "Après avoir aidé 500+ {audience} à {outcome}, j'ai découvert que:",
            "J'ai testé {number} {tools/strategies}. Un seul a vraiment marché:",
            "Résultat après {timeframe} d'utilisation de {solution}:"
        ],
        curiosity_gap: [
            "Ce que personne ne vous dit sur {topic}:",
            "J'ai découvert quelque chose de FOU sur {subject}...",
            "Le secret de {outcome} que les experts cachent:",
            "Pourquoi {controversial_statement} (et comment l'exploiter)"
        ],
        story: [
            "Il y a {timeframe}, j'étais {bad_situation}. Aujourd'hui {good_situation}. Voici comment:",
            "De {starting_point} à {end_point} en {timeframe}. Le playbook complet:",
            "J'ai perdu {amount} avant de comprendre cette règle simple:"
        ],
        subscription: [
            "L'époque du travail manuel est TERMINÉE. Voici comment ELA vous rend souverain:",
            "Pourquoi payer 5 employés quand un agent ELA fait mieux pour {price}?",
            "Le secret des 1% : Ils n'utilisent plus d'outils, ils possèdent une infrastructure."
        ],
        sovereign: [
            "La classe moyenne est une prison numérique. Voici comment les agents ELA vous en sortent:",
            "Aujourd'hui, soit vous possédez l'algorithme, soit vous êtes l'algorithme.",
            "L'automatisation n'est plus une option, c'est votre seule porte de sortie vers la liberté.",
            "Vous travaillez pour l'argent? Erreur fatale. Faites travailler l'IA pour votre souveraineté."
        ],
        matrix: [
            "Le système veut que vous restiez occupé. ELA veut que vous soyez libre.",
            "Breaking the script: Pourquoi l'éducation classique est votre pire ennemi en 2026:",
            "Alerte rouge: Votre job sera obsolète dans 18 mois. Préparez votre armée d'IA.",
            "Le confort est une drogue. Le code est l'antidote."
        ],
        nuclear: [
            "AVERTISSEMENT: Ce post va offenser 99% des gens. Si vous cherchez de la bienveillance, passez votre chemin.",
            "La vérité que les gourous du SaaS vous cachent par peur de perdre leur monopole:",
            "Votre loyauté envers votre entreprise est une maladie mentale. Voici le remède:",
            "9h-18h = Esclavage moderne déguisé en sécurité. Voici comment briser les chaines."
        ],
        forbidden_secret: [
            "J'ai découvert un bug dans l'économie réelle qui permet de {outcome} en 1h/jour.",
            "Ce que l'élite ne veut pas que vous sachiez sur l'automatisation agentique:",
            "Comment j'ai hacké ma liberté financière en utilisant {topic} comme une arme.",
            "Le playbook interdit pour dominer votre marché sans jamais lever le petit doigt."
        ]
    };

    /**
     * Generate Viral Hook
     */
    static async generateViralHook(topic: string, platform: string): Promise<string> {
        const hookTypes = Object.keys(this.VIRAL_HOOKS);
        const randomType = hookTypes[Math.floor(Math.random() * hookTypes.length)] as keyof typeof this.VIRAL_HOOKS;
        const templates = this.VIRAL_HOOKS[randomType];
        const template = templates[Math.floor(Math.random() * templates.length)];

        const prompt = `
        Complete this viral hook template for ${platform}:
        Template: "${template}"
        Topic: ${topic}
        
        Rules:
        - Ultra-provocant et polarisant
        - Créer du FOMO ou de la curiosité
        - Langage direct et cash
        - French language
        
        Return ONLY the completed hook (max 280 characters).
        `;

        const hook = await generateText(prompt, { temperature: 0.9 });
        return hook.trim();
    }

    /**
     * Trending Hashtags (Simulated - replace with real API)
     */
    static getTrendingHashtags(platform: string, niche: string = 'tech'): string[] {
        const hashtags: Record<string, string[]> = {
            LINKEDIN: [
                '#AI', '#Automation', '#SaaS', '#B2B', '#GrowthHacking',
                '#Productivity', '#Innovation', '#FutureOfWork', '#Leadership',
                '#EntrepreneurLife', '#StartupLife', '#TechTrends', '#DigitalTransformation'
            ],
            X_PLATFORM: [
                '#AI', '#Tech', '#SaaS', '#BuildInPublic', '#NoCode',
                '#Automation', '#GrowthHacking', '#Startup', '#IndieHacker'
            ],
            INSTAGRAM: [
                '#entrepreneur', '#hustlehard', '#successmindset', '#businessgrowth',
                '#digitalmarketing', '#automation', '#ai', '#tech'
            ]
        };

        return hashtags[platform] || hashtags.LINKEDIN;
    }

    /**
     * Generate Engagement Bait (Ethical)
     */
    static async generateEngagementBait(topic: string): Promise<string> {
        const prompt = `
        Generate an engagement question for a post about: ${topic}
        
        The question should:
        - Be open-ended
        - Spark debate or personal stories
        - Encourage commenting
        - Be relevant to B2B/SaaS audience
        
        Examples:
        - "Et vous, quelle erreur vous a le plus coûté en {topic}?"
        - "Team X ou Team Y? Pourquoi?"
        - "Quel est votre meilleur hack pour {topic}?"
        
        Return ONLY the question in French.
        `;

        const question = await generateText(prompt, { temperature: 0.7 });
        return question.trim();
    }

    /**
     * Viral Content Structure Generator
     */
    static async generateViralPost(params: {
        topic: string;
        platform: string;
        style: 'story' | 'educational' | 'controversial' | 'meme';
    }): Promise<string> {
        const { topic, platform, style } = params;

        const hook = await this.generateViralHook(topic, platform);
        const hashtags = this.getTrendingHashtags(platform);
        const engagementBait = await this.generateEngagementBait(topic);

        const stylePrompts = {
            story: `Write a viral storytelling post about ${topic}. Structure: Hook -> Struggle -> Transformation -> Lesson -> CTA. Emotional and vulnerable.`,
            educational: `Write a viral educational post about ${topic}. Format: Hook -> 5 bullet points (value bombs) -> Engagement question. Dense with insights.`,
            controversial: `Write a viral controversial take on ${topic}. Structure: Hook (hot take) -> Justification (logic) -> Call out industry BS -> Rally cry. Aggressive tone.`,
            meme: `Write a humorous but insightful post about ${topic}. Use meme format or relatable scenario. Light but valuable.`
        };

        const prompt = `
        ${stylePrompts[style]}
        
        Mandatory elements:
        - START with: "${hook}"
        - END with engagement question: "${engagementBait}"
        - Include a subtle but powerful mention of ELA (Genesis) and the need for a subscription to reach financial sovereignty.
        - Link to pricing: "Prenez le contrôle: ${process.env.NEXT_PUBLIC_APP_URL || 'https://ela-revolution.com'}/pricing"
        - Include 5-8 of these hashtags naturally: ${hashtags.slice(0, 8).join(' ')}
        - Language: French
        - Tone: Direct, brutal, provocant, high-agency. Pas de langue de bois.
        - Persuasion techniques: Cognitive dissonance, FOMO, authority bias.
        - Length: ${platform === 'X_PLATFORM' ? '280 chars MAX' : '400-800 chars'}
        
        Write the complete post now. Be the 1% voice:
        `;

        const content = await generateText(prompt, { temperature: 0.85 });
        return content.trim();
    }

    /**
     * Auto-Reply Templates for First Comments
     */
    static getAutoReplyTemplates(): string[] {
        return [
            "Merci {name}! Quel aspect résonne le plus avec toi?",
            "100% {name}! Tu l'appliques déjà?",
            "Exactement! Et le meilleur dans tout ça: {insight}",
            "Glad it resonates! Question: {follow_up_question}?",
            "{name} 🔥 Tu veux que je creuse ce point spécifiquement?"
        ];
    }

    /**
     * Viral Score Predictor
     */
    static async predictViralScore(content: string): Promise<{
        score: number;
        factors: { hook: number; energy: number; cta: number; value: number };
        recommendations: string[];
    }> {
        const prompt = `
        Analyze this social media post for viral potential (0-100 score).
        
        Post: "${content.substring(0, 500)}"
        
        Rate based on:
        1. Hook (Is it a pattern interrupt?)
        2. Energy (Is it high-agency, provocative, or boring?)
        3. CTA (Does it spark debate?)
        4. Value (Does it offer a real insight or just fluff?)
        
        Return JSON format ONLY:
        {
          "score": number,
          "factors": { "hook": number, "energy": number, "cta": number, "value": number },
          "recommendations": ["string"]
        }
        `;

        try {
            const response = await generateText(prompt, { temperature: 0.2 });
            const result = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || response);
            return result;
        } catch (e) {
            console.error('[VIRAL] Prediction failed:', e);
            return {
                score: 50,
                factors: { hook: 15, energy: 15, cta: 10, value: 10 },
                recommendations: ["Erreur de prédiction IA"]
            };
        }
    }
}
