"use server";

import { getOpenAIClient } from "@/lib/ai/openai-client";

export type ScriptRequest = {
  topic: string;
  niche?: string;
  persona?: string;
  targetPlatform?: "LINKEDIN" | "TIKTOK" | "INSTAGRAM";
  voice?: "direct" | "playful" | "analytical";
};

export type ScriptOutput = {
  hook: string;
  body: string;
  cta: string;
  hashtags?: string[];
};

export async function generateViralScript(input: ScriptRequest): Promise<ScriptOutput> {
  const { topic, niche, persona, targetPlatform, voice } = input;

  const messages = [
    {
      role: "system" as const,
      content: `Tu écris des scripts ultra-viraux (Hook + Valeur + CTA) qui évitent le ton "ChatGPT".
Priorités: 1) Hook agressif en 1 phrase. 2) Valeur tactique en 3-4 bullets. 3) CTA clair.
Styles: ${voice || "direct"}. Plateforme: ${targetPlatform || "LINKEDIN"}. Niche: ${niche || "general"}.
Structure JSON attendu: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["...", "..."] }`,
    },
    { role: "user" as const, content: `Topic: ${topic}\nPersona: ${persona ?? "default"}` },
  ];
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.7,
  });

  const raw = completion.choices[0].message.content ?? "{}";
  try {
    const parsed = JSON.parse(raw);
    return parsed as ScriptOutput;
  } catch (err) {
    return {
      hook: raw.slice(0, 180),
      body: raw,
      cta: "En savoir plus ?",
      hashtags: [],
    };
  }
}






