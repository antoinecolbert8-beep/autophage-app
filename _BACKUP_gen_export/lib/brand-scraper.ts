"use server";


// import { load } from "cheerio"; // Désactivé temporairement pour le build (conflit undici)

export type BrandSnapshot = {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  keywords: string[];
  rawMeta?: Record<string, unknown>;
};

/**
 * Scrape basique d'une URL publique pour extraire logo, couleurs et keywords.
 * Cette version privilégie la discrétion (simple GET, pas de heavy crawling).
 */
export async function scrapeBrand(url: string): Promise<BrandSnapshot> {
  // Version regex sans cheerio pour éviter conflits de build
  const res = await fetch(url, { method: "GET" });
  const html = await res.text();

  const rawMeta: Record<string, string> = {};

  // Extract meta tags
  const metaRegex = /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']+)["']/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    if (match[1] && match[2]) {
      rawMeta[match[1]] = match[2];
    }
  }

  // Extract logo
  let logoUrl = rawMeta['og:logo'];
  if (!logoUrl) {
    const iconRegex = /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i;
    const iconMatch = iconRegex.exec(html);
    if (iconMatch?.[1]) logoUrl = iconMatch[1];
  }

  // Extract primary color
  const primaryColor = rawMeta['theme-color'] || rawMeta['msapplication-TileColor'];

  // Extract keywords
  const keywords = (rawMeta['keywords'] || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  // Extract font-family from style tags (basic)
  let fontFamily: string | undefined;
  const styleRegex = /font-family:\s*([^;]+);/i;
  const styleMatch = styleRegex.exec(html);
  if (styleMatch?.[1]) {
    fontFamily = styleMatch[1].replace(/['"]/g, "").trim();
  }

  return {
    logoUrl,
    primaryColor,
    secondaryColor: undefined,
    fontFamily,
    keywords,
    rawMeta,
  };
}



