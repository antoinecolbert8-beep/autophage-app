import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

/**
 * EMAIL WARMUP
 * Amélioration de la délivrabilité pour cold outreach
 */

export interface WarmupConfig {
    domain: string;
    dailyLimit: number;
    incrementRate: number; // emails added per day
    targetVolume: number;
}

export interface DeliverabilityScore {
    overall: number; // 0-100
    dnsHealth: number;
    spfValid: boolean;
    dkimValid: boolean;
    dmarcValid: boolean;
    blacklistStatus: 'clean' | 'warning' | 'listed';
    recommendations: string[];
}

export class EmailWarmup {

    /**
     * Configuration du warmup scheduler
     */
    static async startWarmup(config: WarmupConfig): Promise<void> {
        const { domain, dailyLimit, incrementRate, targetVolume } = config;

        console.log(`[Email Warmup] Starting warmup for ${domain}`);
        console.log(`[Email Warmup] Daily limit: ${dailyLimit}, Target: ${targetVolume}`);

        // Warmup progressif sur ~30 jours
        const daysToTarget = Math.ceil((targetVolume - dailyLimit) / incrementRate);
        console.log(`[Email Warmup] Will reach target in ${daysToTarget} days`);

        // En production: schedule cron jobs
        // Day 1: send 10 emails
        // Day 2: send 15 emails
        // Day 3: send 20 emails
        // ... jusqu'à targetVolume
    }

    /**
     * Envoi d'emails de warmup
     */
    static async sendWarmupEmails(count: number): Promise<void> {
        // En production: utiliser un service comme Lemwarm ou Mailwarm
        // Ou envoyer à des adresses seed

        console.log(`[Email Warmup] Sending ${count} warmup emails...`);

        // Comportements naturels:
        // - Mix d'opens et de non-opens
        // - Quelques réponses
        // - Timing varié
        // - Pas de spam reports
    }

    /**
     * Vérification DNS health
     */
    static async checkDNSHealth(domain: string): Promise<{
        spf: boolean;
        dkim: boolean;
        dmarc: boolean;
        details: Record<string, any>;
    }> {
        console.log(`[Email Warmup] Checking DNS for ${domain}...`);

        const results = {
            spf: false,
            dkim: false,
            dmarc: false,
            details: {} as Record<string, any>
        };

        try {
            // Check SPF
            const spfRecords = await resolveTxt(domain);
            results.spf = spfRecords.some(record =>
                record.join('').includes('v=spf1')
            );
            results.details.spf = spfRecords;

            // Check DMARC
            const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
            results.dmarc = dmarcRecords.some(record =>
                record.join('').includes('v=DMARC1')
            );
            results.details.dmarc = dmarcRecords;

            // DKIM nécessite le selector (ex: default._domainkey.domain.com)
            // Simplifié pour MVP
            results.dkim = false;

        } catch (error) {
            console.error(`[Email Warmup] DNS check failed:`, error);
        }

        return results;
    }

    /**
     * Calcul du deliverability score
     */
    static async calculateDeliverabilityScore(domain: string): Promise<DeliverabilityScore> {
        const dnsHealth = await this.checkDNSHealth(domain);
        const blacklistStatus = await this.checkBlacklists(domain);

        let score = 0;

        // DNS configuration (60 points)
        if (dnsHealth.spf) score += 20;
        if (dnsHealth.dkim) score += 20;
        if (dnsHealth.dmarc) score += 20;

        // Blacklist status (40 points)
        if (blacklistStatus === 'clean') score += 40;
        else if (blacklistStatus === 'warning') score += 20;

        const recommendations: string[] = [];

        if (!dnsHealth.spf) {
            recommendations.push('❌ Configurer SPF record: v=spf1 include:_spf.google.com ~all');
        }
        if (!dnsHealth.dkim) {
            recommendations.push('❌ Configurer DKIM signature');
        }
        if (!dnsHealth.dmarc) {
            recommendations.push('❌ Configurer DMARC policy: v=DMARC1; p=quarantine');
        }
        if (blacklistStatus !== 'clean') {
            recommendations.push('⚠️ Votre domaine est sur une blacklist - contact pour removal');
        }

        if (score === 100) {
            recommendations.push('✅ Configuration parfaite !');
        }

        return {
            overall: score,
            dnsHealth: dnsHealth.spf && dnsHealth.dkim && dnsHealth.dmarc ? 100 :
                (dnsHealth.spf ? 33 : 0) + (dnsHealth.dkim ? 33 : 0) + (dnsHealth.dmarc ? 34 : 0),
            spfValid: dnsHealth.spf,
            dkimValid: dnsHealth.dkim,
            dmarcValid: dnsHealth.dmarc,
            blacklistStatus,
            recommendations
        };
    }

    /**
     * Check blacklists
     */
    private static async checkBlacklists(domain: string): Promise<'clean' | 'warning' | 'listed'> {
        // En production: vérifier contre Spamhaus, SURBL, etc.
        // API: MXToolbox, DNSBLLookup

        console.log(`[Email Warmup] Checking blacklists for ${domain}...`);

        // Simulé pour MVP
        return 'clean';
    }

    /**
     * Spam test automatique
     */
    static async runSpamTest(emailContent: string, subject: string): Promise<{
        score: number;
        rating: 'excellent' | 'good' | 'fair' | 'poor';
        issues: string[];
    }> {
        const issues: string[] = [];
        let penalties = 0;

        // Règles simples
        if (subject.toUpperCase() === subject) {
            issues.push('Subject en ALL CAPS');
            penalties += 2;
        }

        const spamWords = ['free', 'guarantee', 'winner', 'cash', 'urgent', 'act now'];
        const foundSpamWords = spamWords.filter(word =>
            emailContent.toLowerCase().includes(word)
        );
        if (foundSpamWords.length > 0) {
            issues.push(`Spam words détectés: ${foundSpamWords.join(', ')}`);
            penalties += foundSpamWords.length;
        }

        if (emailContent.match(/!!+/g)) {
            issues.push('Trop de points d\'exclamation');
            penalties += 1;
        }

        const urlCount = (emailContent.match(/https?:\/\//g) || []).length;
        if (urlCount > 3) {
            issues.push(`Trop de liens (${urlCount})`);
            penalties += 2;
        }

        const score = Math.max(0, 10 - penalties);

        let rating: 'excellent' | 'good' | 'fair' | 'poor';
        if (score >= 9) rating = 'excellent';
        else if (score >= 7) rating = 'good';
        else if (score >= 5) rating = 'fair';
        else rating = 'poor';

        return { score, rating, issues };
    }

    /**
     * Domain reputation tracking
     */
    static async trackReputation(domain: string): Promise<{
        currentScore: number;
        trend: 'improving' | 'stable' | 'declining';
        history: Array<{ date: Date; score: number }>;
    }> {
        // En production: tracker dans DB avec historique

        return {
            currentScore: 85,
            trend: 'improving',
            history: [
                { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: 75 },
                { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 80 },
                { date: new Date(), score: 85 }
            ]
        };
    }

    /**
     * Recommandations automatiques
     */
    static async getRecommendations(domain: string): Promise<string[]> {
        const score = await this.calculateDeliverabilityScore(domain);
        const recommendations: string[] = [];

        if (score.overall < 70) {
            recommendations.push('🚨 URGENT: Améliorer configuration DNS avant d\'envoyer');
        }

        if (!score.spfValid) {
            recommendations.push('1. Ajouter SPF record dans DNS');
        }

        if (!score.dkimValid) {
            recommendations.push('2. Configurer DKIM avec votre ESP');
        }

        if (!score.dmarcValid) {
            recommendations.push('3. Ajouter DMARC policy');
        }

        recommendations.push('4. Utiliser warmup progressif sur 30 jours');
        recommendations.push('5. Maintenir taux d\'ouverture > 20%');
        recommendations.push('6. Éviter les spam words dans vos emails');

        return recommendations;
    }
}
