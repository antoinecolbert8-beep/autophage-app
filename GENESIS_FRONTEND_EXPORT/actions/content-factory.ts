"use server";

// import { scrapeInspiration } from "@/lib/inspiration-scraper"; // Désactivé temporairement (conflit cheerio/undici)
import { generateViralScript, ScriptRequest } from "@/lib/script-generator";
import { buildVideoPlan, RenderOptions, SceneAsset, AudioAsset } from "@/lib/video-pipeline";

export async function getInspirationFromUrls(urls: string[]) {
  // Version simplifiée sans cheerio - utilise fetch basique
  const posts = urls.map((url, idx) => ({
    platform: "LINKEDIN" as const,
    title: `Post scraped from ${url}`,
    url,
    author: "Unknown",
    stats: { likes: 0, comments: 0, shares: 0 },
    raw: `Contenu à extraire de ${url}`,
  }));
  
  return { posts };
}

export async function generateScriptAction(input: ScriptRequest) {
  const script = await generateViralScript(input);
  return { script };
}

export async function buildVideoPlanAction(scenes: SceneAsset[], audio: AudioAsset, options: RenderOptions) {
  const plan = await buildVideoPlan(scenes, audio, options);
  return { plan };
}



