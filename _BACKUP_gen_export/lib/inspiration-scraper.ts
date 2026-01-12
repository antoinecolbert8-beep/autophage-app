"use server";

import { load } from "cheerio";

export type InspirationPost = {
  platform: "LINKEDIN" | "TIKTOK" | "UNKNOWN";
  title: string;
  url?: string;
  author?: string;
  stats?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  raw?: string;
};

function parseIntSafe(value?: string | null) {
  if (!value) return undefined;
  const cleaned = value.replace(/[^\d]/g, "");
  const n = parseInt(cleaned, 10);
  return Number.isNaN(n) ? undefined : n;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, { method: "GET" });
  return await res.text();
}

/**
 * Scraper léger (HTML statique). Pour LinkedIn public/TikTok explore pages.
 * Pour les pages nécessitant login, fournir html pré-fetché côté Playwright.
 */
export async function scrapeInspiration(options: { urls?: string[]; html?: string; platformHint?: "LINKEDIN" | "TIKTOK" }) {
  const html = options.html ?? (options.urls?.length ? await fetchHtml(options.urls[0]) : "");
  const $ = load(html);

  // Heuristique LinkedIn (post récents)
  const linkedin = $(".feed-shared-update-v2, .feed-shared-update").map((_, el) => {
    const title = $(el).find("span.break-words").first().text().trim();
    const author = $(el).find("span.feed-shared-actor__name").first().text().trim();
    const likes = parseIntSafe($(el).find("button[aria-label*='J’aime']").text());
    const comments = parseIntSafe($(el).find("button[aria-label*='commentaire']").text());
    const shares = parseIntSafe($(el).find("button[aria-label*='republication']").text());
    const url = $(el).find("a.app-aware-link").first().attr("href");
    return <InspirationPost>{
      platform: "LINKEDIN",
      title,
      url,
      author,
      stats: { likes, comments, shares },
      raw: $(el).text(),
    };
  }).get();

  // Heuristique TikTok (page explore)
  const tiktok = $("div[data-e2e='challenge-item'] , div[data-e2e='scroll-list-item']").map((_, el) => {
    const title = $(el).find("h3, span[data-e2e='video-desc']").first().text().trim();
    const author = $(el).find("a[data-e2e='video-author-uniqueid']").first().text().trim();
    const views = parseIntSafe($(el).find("[data-e2e='video-views']").text());
    const url = $(el).find("a").first().attr("href");
    return <InspirationPost>{
      platform: "TIKTOK",
      title,
      url,
      author,
      stats: { views },
      raw: $(el).text(),
    };
  }).get();

  const posts = [...linkedin, ...tiktok].filter((p) => p.title);
  return posts.length ? posts : [];
}






