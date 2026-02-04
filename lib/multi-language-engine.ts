import { generateText } from '@/lib/ai/vertex';

/**
 * MULTI-LANGUAGE CONTENT GENERATOR
 * Generates and translates content for multiple languages
 */

export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'it';

export class MultiLanguageEngine {

    /**
     * Generate post in multiple languages
     */
    static async generateMultiLanguagePost(params: {
        topic: string;
        platform: string;
        style: 'story' | 'educational' | 'controversial' | 'meme';
        languages: SupportedLanguage[];
    }): Promise<Map<SupportedLanguage, string>> {
        const { topic, platform, style, languages } = params;

        const results = new Map<SupportedLanguage, string>();

        // Generate in primary language first (French)
        const { ViralEngine } = await import('@/lib/viral-engine');

        const frenchContent = await ViralEngine.generateViralPost({
            topic,
            platform,
            style
        });

        results.set('fr', frenchContent);

        // Translate to other languages
        for (const lang of languages) {
            if (lang === 'fr') continue;

            const translated = await this.translateContent(frenchContent, 'fr', lang, platform);
            results.set(lang, translated);
        }

        console.log(`[MultiLang] Generated content in ${languages.length} languages`);
        return results;
    }

    /**
     * Translate content while preserving style and hashtags
     */
    static async translateContent(
        content: string,
        fromLang: SupportedLanguage,
        toLang: SupportedLanguage,
        platform: string
    ): Promise<string> {
        const languageNames: Record<SupportedLanguage, string> = {
            'fr': 'French',
            'en': 'English',
            'es': 'Spanish',
            'de': 'German',
            'it': 'Italian'
        };

        const prompt = `
        Translate this ${platform} post from ${languageNames[fromLang]} to ${languageNames[toLang]}.
        
        Original:
        "${content}"
        
        CRITICAL RULES:
        - Preserve the viral hook and emotional impact
        - Keep hashtags in original language (don't translate hashtags)
        - Adapt cultural references if needed
        - Maintain the same tone and energy
        - Keep emojis
        - Respect platform character limits
        
        Translated version:
        `;

        const translated = await generateText(prompt, { temperature: 0.5 });
        return translated.trim();
    }

    /**
     * Detect optimal language for geography
     */
    static getOptimalLanguage(geography: string): SupportedLanguage {
        const geoLanguageMap: Record<string, SupportedLanguage> = {
            'FR': 'fr',
            'BE': 'fr',
            'CH': 'fr',
            'CA': 'fr',
            'US': 'en',
            'GB': 'en',
            'AU': 'en',
            'ES': 'es',
            'MX': 'es',
            'AR': 'es',
            'DE': 'de',
            'AT': 'de',
            'IT': 'it'
        };

        return geoLanguageMap[geography.toUpperCase()] || 'en';
    }

    /**
     * A/B test different languages
     */
    static async testLanguagePerformance(
        topic: string,
        platform: string,
        languages: SupportedLanguage[]
    ): Promise<Map<SupportedLanguage, number>> {
        const { ViralEngine } = await import('@/lib/viral-engine');

        const scores = new Map<SupportedLanguage, number>();

        for (const lang of languages) {
            // Generate content in language
            const content = lang === 'fr'
                ? await ViralEngine.generateViralPost({ topic, platform, style: 'educational' })
                : await this.translateContent(
                    await ViralEngine.generateViralPost({ topic, platform, style: 'educational' }),
                    'fr',
                    lang,
                    platform
                );

            // Predict viral score
            const score = await ViralEngine.predictViralScore(content);
            scores.set(lang, score.score);
        }

        console.log(`[MultiLang] Language test results:`, Object.fromEntries(scores));
        return scores;
    }

    /**
     * Localize hashtags per market
     */
    static localizeHashtags(hashtags: string[], targetLang: SupportedLanguage): string[] {
        const localizedSets: Record<SupportedLanguage, Record<string, string>> = {
            'fr': {
                '#AI': '#IA',
                '#SaaS': '#SaaS',
                '#Growth': '#Croissance'
            },
            'en': {
                '#IA': '#AI',
                '#Croissance': '#Growth'
            },
            'es': {
                '#AI': '#IA',
                '#Growth': '#Crecimiento'
            },
            'de': {
                '#AI': '#KI',
                '#Growth': '#Wachstum'
            },
            'it': {
                '#AI': '#IA',
                '#Growth': '#Crescita'
            }
        };

        const localMap = localizedSets[targetLang] || {};

        return hashtags.map(tag => localMap[tag] || tag);
    }

    /**
     * Schedule posts by timezone
     */
    static getOptimalTimezoneSchedule(language: SupportedLanguage): number[] {
        // Return optimal hours in UTC for each market
        const schedules: Record<SupportedLanguage, number[]> = {
            'fr': [8, 12, 17],  // CET/CEST
            'en': [9, 13, 18],  // GMT/BST (could be US EST too)
            'es': [9, 14, 19],  // CET
            'de': [8, 12, 17],  // CET
            'it': [9, 13, 18]   // CET
        };

        return schedules[language] || [9, 14, 19];
    }

    /**
     * Create geo-specific campaigns
     */
    static async createGeoTargetedCampaign(params: {
        topic: string;
        platform: string;
        targetMarkets: Array<{ country: string; language: SupportedLanguage }>;
    }): Promise<void> {
        const { topic, platform, targetMarkets } = params;

        for (const market of targetMarkets) {
            console.log(`[MultiLang] Creating campaign for ${market.country} (${market.language})`);

            const content = await this.generateMultiLanguagePost({
                topic,
                platform,
                style: 'educational',
                languages: [market.language]
            });

            const localizedContent = content.get(market.language);

            if (localizedContent) {
                // Schedule with geo-targeting
                const optimalHours = this.getOptimalTimezoneSchedule(market.language);
                console.log(`[MultiLang] Scheduled for ${market.country} at hours: ${optimalHours.join(', ')}`);
            }
        }
    }
}
