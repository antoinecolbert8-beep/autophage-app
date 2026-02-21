import { NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

/**
 * Sitemap for SEO
 */
export async function GET() {
    try {
        const articles = await prisma.contentAsset.findMany({
            where: {
                publishedAt: { not: null }
            },
            select: {
                slug: true,
                lastUpdated: true
            }
        });

        const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://autophage.vercel.app';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
    </url>
    ${articles.map(article => `
    <url>
        <loc>${baseUrl}/blog/${article.slug}</loc>
        <lastmod>${article.lastUpdated?.toISOString() || new Date().toISOString()}</lastmod>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
