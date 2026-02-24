import axios from 'axios';
import { db as prisma } from "@/core/db";

/**
 * 📢 FREE TRAFFIC CHANNELS
 * All organic, zero-cost distribution
 */

export async function distributeTo100PercentFreeChannels(content: {
    title: string;
    excerpt: string;
    url: string;
}) {
    console.log("📢 [FREE TRAFFIC] Distributing to all free channels...");

    const results = {
        rss: false,
        reddit: false,
        hackernews: false,
        medium: false,
        devto: false,
        linkedin: false,
        twitter: false,
    };

    try {
        // 1. RSS Feed (déjà automatique via /blog)
        results.rss = true;

        // 2-7. Connecteurs non-natifs : Routage vers n8n
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
            await axios.post(n8nUrl, {
                action: 'FREE_TRAFFIC_DISTRIBUTION',
                data: content,
                platforms: ['reddit', 'hackernews', 'medium', 'devto']
            });
            results.reddit = true;
            results.hackernews = true;
            results.medium = true;
            results.devto = true;
            console.log("🚀 [FREE TRAFFIC] Batch distribution via n8n SUCCESS");
        } else {
            console.warn("⚠️ [FREE TRAFFIC] n8n URL missing, skipping batch distribution");
        }

    } catch (error: any) {
        console.warn("⚠️ [FREE TRAFFIC] Skipping non-native distribution:", error.message);
        return results;
    }
}

/**
 * Generate distribution templates for all free channels
 */
export function generateFreeChannelContent(article: {
    title: string;
    excerpt: string;
    url: string;
}) {
    return {
        reddit: {
            title: `${article.title}`,
            body: `${article.excerpt}\n\nFull article: ${article.url}`,
            subreddits: ['SaaS', 'Entrepreneur', 'startups', 'marketing']
        },
        hackernews: {
            title: `Show HN: ${article.title}`,
            url: article.url
        },
        medium: {
            title: article.title,
            tags: ['technology', 'saas', 'ai', 'marketing', 'business'],
            canonicalUrl: article.url
        },
        devto: {
            title: article.title,
            tags: ['ai', 'saas', 'marketing', 'automation'],
            canonical_url: article.url
        },
        linkedin: {
            text: `${article.title}\n\n${article.excerpt}\n\nRead more: ${article.url}`
        },
        twitter: {
            thread: [
                `${article.title} 🧵👇`,
                article.excerpt,
                `Full breakdown: ${article.url}`
            ]
        }
    };
}
