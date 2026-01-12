"use server";

import path from "path";
import { randomUUID } from "crypto";

export type SceneAsset = {
  imageUrl?: string;
  videoUrl?: string;
  durationSec?: number;
  textOverlay?: string;
  subtitles?: string[];
};

export type AudioAsset = {
  url: string;
  speaker?: string;
};

export type VideoPlan = {
  id: string;
  scenes: SceneAsset[];
  audio: AudioAsset;
  subtitles?: string[];
  seoFilename?: string;
};

export type RenderOptions = {
  targetFps?: number;
  resolution?: "1080p" | "720p";
  cutIntervalSec?: number; // Algo dopamine: force un cut toutes les X secondes
  seoKeyword?: string;
};

/**
 * Génère un plan d'assemblage (cut toutes les X secondes).
 * Ici on retourne un plan JSON; branchement FFmpeg/Creatomate à faire côté worker.
 */
export async function buildVideoPlan(scenes: SceneAsset[], audio: AudioAsset, options: RenderOptions): Promise<VideoPlan> {
  const cutInterval = options.cutIntervalSec ?? 3;
  const enforcedScenes = scenes.map((scene) => ({
    ...scene,
    durationSec: scene.durationSec ?? cutInterval,
  }));

  const seoFilename = options.seoKeyword
    ? `${options.seoKeyword.replace(/\s+/g, "-").toLowerCase()}.mp4`
    : `video-${randomUUID()}.mp4`;

  return {
    id: randomUUID(),
    scenes: enforcedScenes,
    audio,
    subtitles: enforcedScenes.flatMap((s) => s.subtitles ?? []),
    seoFilename,
  };
}

/**
 * Stub d'assemblage : renvoie la commande FFmpeg qui serait utilisée.
 * À exécuter côté worker/queue (pas dans le process Next).
 */
export async function buildFfmpegCommand(plan: VideoPlan, outputDir = "renders") {
  const outputPath = path.join(outputDir, plan.seoFilename ?? `${plan.id}.mp4`);
  const filterGraph = "[0:a]anull[aud]; [1:v]fps=30,scale=1080:-1[vid]";

  return {
    outputPath,
    command: `ffmpeg -i ${plan.audio.url} -i <SCENES_CONCAT> -filter_complex "${filterGraph}" -map "[vid]" -map "[aud]" -shortest ${outputPath}`,
    note: "Remplace <SCENES_CONCAT> par un concat vidéo/images généré en amont.",
  };
}



