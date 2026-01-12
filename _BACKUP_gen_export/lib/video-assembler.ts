/**
 * 🎬 Video Assembler - Assemblage vidéo avec FFmpeg
 * Implémente l'algo "Dopamine" (cut toutes les 3 sec)
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export type VideoScene = {
  imageUrl: string;
  durationSec: number;
  textOverlay?: string;
  transition?: "fade" | "cut" | "slide";
};

export type VideoProject = {
  scenes: VideoScene[];
  audioUrl: string;
  outputFilename: string;
  subtitles?: Array<{ start: number; end: number; text: string }>;
  seoKeyword?: string;
};

/**
 * Vérifie que FFmpeg est installé
 */
export async function checkFfmpegInstalled(): Promise<boolean> {
  try {
    await execAsync("ffmpeg -version");
    return true;
  } catch {
    return false;
  }
}

/**
 * Assemble une vidéo avec l'algo dopamine (cuts fréquents)
 */
export async function assembleVideo(project: VideoProject): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  try {
    // Vérifie FFmpeg
    const hasFFmpeg = await checkFfmpegInstalled();
    if (!hasFFmpeg) {
      return {
        success: false,
        error: "FFmpeg n'est pas installé. Installe-le avec: winget install FFmpeg (Windows) ou brew install ffmpeg (Mac)",
      };
    }

    const workDir = path.join(process.cwd(), "tmp", "video-assembly");
    const outputDir = path.join(process.cwd(), "public", "videos");

    // Crée les dossiers
    [workDir, outputDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Génère le fichier concat pour les scènes
    const concatFilePath = path.join(workDir, "concat.txt");
    let concatContent = "";

    for (let i = 0; i < project.scenes.length; i++) {
      const scene = project.scenes[i];
      const sceneOutputPath = path.join(workDir, `scene-${i}.mp4`);

      // Crée une vidéo statique pour chaque image (algo dopamine: durée forcée)
      const duration = scene.durationSec ?? 3;
      
      await execAsync(
        `ffmpeg -loop 1 -i "${scene.imageUrl}" -c:v libx264 -t ${duration} -pix_fmt yuv420p -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -y "${sceneOutputPath}"`
      );

      concatContent += `file '${sceneOutputPath}'\n`;
    }

    fs.writeFileSync(concatFilePath, concatContent);

    // Assemble toutes les scènes
    const videoOnlyPath = path.join(workDir, "video-only.mp4");
    await execAsync(`ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy -y "${videoOnlyPath}"`);

    // Ajoute l'audio
    const finalFilename = project.seoKeyword
      ? `${project.seoKeyword.replace(/\s+/g, "-").toLowerCase()}.mp4`
      : project.outputFilename;

    const finalOutputPath = path.join(outputDir, finalFilename);

    await execAsync(
      `ffmpeg -i "${videoOnlyPath}" -i "${project.audioUrl}" -c:v copy -c:a aac -shortest -y "${finalOutputPath}"`
    );

    // Nettoyage
    fs.rmSync(workDir, { recursive: true, force: true });

    return {
      success: true,
      outputPath: `/videos/${finalFilename}`,
    };
  } catch (error) {
    console.error("Erreur assemblage vidéo:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Génère des sous-titres dynamiques (format SRT)
 */
export function generateSubtitles(
  segments: Array<{ start: number; end: number; text: string }>
): string {
  let srt = "";
  
  segments.forEach((segment, index) => {
    const startTime = formatSRTTime(segment.start);
    const endTime = formatSRTTime(segment.end);
    
    srt += `${index + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${segment.text}\n\n`;
  });

  return srt;
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return num.toString().padStart(size, "0");
}





