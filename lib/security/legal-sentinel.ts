/**
 * ⚖️ LEGAL SENTINEL
 * Ensures all generated content complies with international/local regulations
 */

export interface ComplianceReport {
    isCompliant: boolean;
    threats: string[];
    suggestions: string[];
    score: number; // 0-100
}

export class LegalSentinel {
    /**
     * Checks content against a battery of legal/regulatory rules
     */
    static async checkContent(
        content: string,
        platform: string,
        isEcommerce: boolean = false,
        context: 'enterprise' | 'individual' = 'individual'
    ): Promise<ComplianceReport> {
        const threats: string[] = [];
        const suggestions: string[] = [];
        let score = 100;

        // 0. Contextual check
        if (context === 'enterprise') {
            const hasCompanyMention = /inc|ltd|sa|sarl|group|sas|entreprise/i.test(content);
            if (!hasCompanyMention) {
                suggestions.push("Mentionnez l'entité légale pour renforcer la crédibilité B2B.");
            }
        }

        // 1. GDPR/RGPD Check (No PII)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

        if (emailRegex.test(content)) {
            threats.push("Détéction de PII (Email) - Violation RGPD/GDPR potentielle.");
            score -= 30;
        }

        if (phoneRegex.test(content)) {
            threats.push("Détéction de PII (Téléphone) - Risque de vie privée.");
            score -= 20;
        }

        // 2. E-commerce / FTC/Loi Sapin (Transparency)
        if (isEcommerce) {
            const hasPromoTerms = /promo|réduction|offre|vente|achat/i.test(content);
            const hasDisclaimers = /conditions|mentions|limité/i.test(content);

            if (hasPromoTerms && !hasDisclaimers) {
                threats.push("Manque de clarté sur les conditions de l'offre commerciale.");
                suggestions.push("Ajoutez un lien vers les CGV ou une mention 'Sous réserve de conditions'.");
                score -= 15;
            }
        }

        // 3. Platform Restrictions
        if (platform === 'INSTAGRAM' || platform === 'TIKTOK') {
            if (content.includes('http://') || content.includes('https://')) {
                suggestions.push("Les liens cliquables sont limités dans la bio. Utilisez 'Lien en bio'.");
            }
        }

        // 4. Over-aggressive / High Risk Claims
        const toxicTerms = /esclave|matrix|suicide|destruction|nucléaire|matrix|pill/i;
        if (toxicTerms.test(content)) {
            threats.push("Tonalité trop agressive ou toxique détectée.");
            score -= 40;
        }

        const hyperbolicTerms = /garanti|100% sûr|aucun risque|immédiat|fortune/i;
        if (hyperbolicTerms.test(content)) {
            threats.push("Allégations potentiellement trompeuses ou trop agressives.");
            suggestions.push("Tempérez les promesses de résultats pour éviter les plaintes consommateurs.");
            score -= 20;
        }

        return {
            isCompliant: score >= 75, // Seuil de tolérance réduit pour la prod
            threats,
            suggestions,
            score: Math.max(0, score)
        };
    }

    /**
     * Sanitizes content to meet minimal compliance standards
     */
    static sanitize(content: string): string {
        return content
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_MASQUÉ]")
            .trim();
    }
}
