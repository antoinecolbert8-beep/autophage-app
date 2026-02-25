/**
 * AI Profile Worker — Pilier 3 (RGPD compliant)
 * Tourne après chaque publication pour affiner le profil IA de l'organisation.
 * Respecte le consentement utilisateur (UserPreference.ai_data_usage).
 * Données R&D : anonymisées, jamais liées à une identité réelle.
 */

import { db as prisma } from '@/core/db';

// ── Constantes ────────────────────────────────────────────────────────────────

const STYLE_THRESHOLDS = {
    storytelling: 0.3,   // >30% des posts avec "histoire", "témoignage", "j'ai"
    controversy: 0.2,    // >20% avec score performance_score > 0.7 et engagement > avg*2
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface PostAnalysis {
    platform: string;
    publishedAt: Date;
    performance: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    content: string;
}

// ── Core Worker ───────────────────────────────────────────────────────────────

/**
 * Met à jour le AIProfile d'une organisation après analyse des derniers posts.
 * Appelé par le social-worker BullMQ après chaque publication.
 */
export async function updateAIProfileForOrg(organizationId: string): Promise<void> {
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Vérifier le consentement RGPD de l'organisation
    const orgUsers = await prisma.user.findMany({
        where: { organizationId },
        select: { userPreference: { select: { ai_data_usage: true } } },
    });
    const hasConsent = orgUsers.some((u) => u.userPreference?.ai_data_usage === true);

    // Charger les posts des 30 derniers jours pour cette org
    const posts = await prisma.post.findMany({
        where: {
            user: { organizationId },
            status: 'published',
            publishedAt: { gte: since30d },
        },
        select: {
            platform: true,
            content: true,
            publishedAt: true,
            performance_score: true,
            stats: {
                orderBy: { collectedAt: 'desc' },
                take: 1,
                select: { views: true, likes: true, comments: true, shares: true },
            },
        },
    });

    if (posts.length === 0) return;

    // ── Analyse des performances ───────────────────────────────────────────────

    const analyses: PostAnalysis[] = posts.map((p) => ({
        platform: p.platform.toUpperCase(),
        publishedAt: p.publishedAt || new Date(),
        performance: p.performance_score,
        views: p.stats[0]?.views ?? 0,
        likes: p.stats[0]?.likes ?? 0,
        comments: p.stats[0]?.comments ?? 0,
        shares: p.stats[0]?.shares ?? 0,
        content: p.content,
    }));

    // Engagement moyen global
    const avgEngagement = analyses.reduce((sum, a) =>
        sum + a.views + a.likes * 10 + a.comments * 20 + a.shares * 50, 0
    ) / analyses.length;

    // Meilleurs horaires par plateforme
    const platformHours: Record<string, number[]> = {};
    analyses.forEach((a) => {
        const score = a.views + a.likes * 10 + a.comments * 20 + a.shares * 50;
        if (score > avgEngagement) {
            const hour = a.publishedAt.getUTCHours();
            if (!platformHours[a.platform]) platformHours[a.platform] = [];
            platformHours[a.platform].push(hour);
        }
    });

    // Dédoublonner et trier les heures gagnantes
    const bestPostTimes: Record<string, string[]> = {};
    Object.entries(platformHours).forEach(([platform, hours]) => {
        const uniqueHours = [...new Set(hours)].sort((a, b) => a - b).slice(0, 3);
        bestPostTimes[platform] = uniqueHours.map((h) => `${String(h).padStart(2, '0')}:00`);
    });

    // Hashtags les plus fréquents dans les posts performants
    const hashtagCounts: Record<string, number> = {};
    analyses
        .filter((a) => a.performance > 0.5)
        .forEach((a) => {
            const tags = a.content.match(/#[\wÀ-ÿ]+/g) || [];
            tags.forEach((tag) => {
                hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
            });
        });
    const topHashtags = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);

    // Style inféré
    const storyKeywords = /\bhistoire\b|\btémoignage\b|\bj'ai\b|\bquand j\b/i;
    const storyRatio = analyses.filter((a) => storyKeywords.test(a.content)).length / analyses.length;
    const highPerformers = analyses.filter((a) => a.performance > 0.7);
    const controversyRatio = highPerformers.length / analyses.length;

    let contentStyle = 'educational';
    if (storyRatio > STYLE_THRESHOLDS.storytelling) contentStyle = 'storytelling';
    if (controversyRatio > STYLE_THRESHOLDS.controversy && highPerformers.length > 3) contentStyle = 'controversy';

    const successRate = analyses.filter((a) => a.performance > 0.3).length / analyses.length;

    // ── Upsert du profil ──────────────────────────────────────────────────────

    await prisma.aIProfile.upsert({
        where: { organizationId },
        create: {
            organizationId,
            bestPostTimes: JSON.stringify(bestPostTimes),
            topHashtags: JSON.stringify(topHashtags),
            contentStyle,
            avgEngagement: Math.round(avgEngagement),
            publishCount: analyses.length,
            successRate: Math.round(successRate * 100) / 100,
            consentGiven: hasConsent,
        },
        update: {
            bestPostTimes: JSON.stringify(bestPostTimes),
            topHashtags: JSON.stringify(topHashtags),
            contentStyle,
            avgEngagement: Math.round(avgEngagement),
            publishCount: { increment: 1 },
            successRate: Math.round(successRate * 100) / 100,
            consentGiven: hasConsent,
        },
    });

    // ── R&D Interne : Snapshot anonymisé (uniquement si consentement) ──────────

    if (hasConsent) {
        await prisma.aIActionLog.create({
            data: {
                organizationId,
                actionType: 'AI_PROFILE_UPDATE',
                entityType: 'organization',
                entityId: organizationId,
                status: 'completed',
                // Données anonymisées : style détecté + métriques agrégées, sans PII
                decisionReasoning: JSON.stringify({
                    contentStyle,
                    avgEngagement: Math.round(avgEngagement),
                    successRate: Math.round(successRate * 100),
                    topPlatforms: Object.keys(bestPostTimes),
                    analysedPeriodDays: 30,
                    postsAnalysed: analyses.length,
                    // Aucune PII, aucun contenu brut
                }),
                executedAt: new Date(),
            },
        });
    }
}

/**
 * Récupère le profil IA d'une organisation pour personnaliser la génération de contenu.
 */
export async function getAIProfileForOrg(organizationId: string) {
    const profile = await prisma.aIProfile.findUnique({
        where: { organizationId },
    });

    if (!profile) {
        return {
            bestPostTimes: {},
            topHashtags: [],
            contentStyle: 'educational',
            avgEngagement: 0,
            successRate: 0,
            consentGiven: false,
        };
    }

    return {
        bestPostTimes: JSON.parse(profile.bestPostTimes),
        topHashtags: JSON.parse(profile.topHashtags),
        contentStyle: profile.contentStyle,
        avgEngagement: profile.avgEngagement,
        successRate: profile.successRate,
        consentGiven: profile.consentGiven,
    };
}
