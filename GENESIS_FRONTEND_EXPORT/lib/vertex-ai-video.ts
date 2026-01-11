/**
 * 🎬 VERTEX AI VIDEO GENERATION
 * Génère de vraies vidéos avec Google Vertex AI
 */

import { ShortScript } from "./youtube-short-generator";

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || "empire-youtube-system";
const LOCATION = "us-central1";

function getApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key || key.length < 20) {
    throw new Error("GOOGLE_API_KEY manquante ou invalide dans .env");
  }
  return key;
}

interface VertexVideoConfig {
  prompt: string;
  duration: number; // en secondes
  aspectRatio: "9:16"; // Vertical pour Shorts
  style?: string;
}

/**
 * 🎨 Générer une vidéo avec Vertex AI Imagen Video
 */
export async function generateVideoWithVertexAI(
  script: ShortScript,
  config: Partial<VertexVideoConfig> = {}
): Promise<string> {
  
  const API_KEY = getApiKey();
  console.log("🎬 Génération vidéo avec Vertex AI Imagen...");

  // Construire le prompt visuel basé sur le script
  const visualPrompt = buildVisualPrompt(script);
  
  const videoConfig: VertexVideoConfig = {
    prompt: visualPrompt,
    duration: 45, // 45 secondes pour un short
    aspectRatio: "9:16",
    style: config.style || "modern, dynamic, professional",
  };

  console.log("📝 Prompt vidéo:", visualPrompt);

  try {
    // API Vertex AI Imagen Video
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagegeneration:predict`;
    
    const requestBody = {
      instances: [
        {
          prompt: videoConfig.prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: videoConfig.aspectRatio,
        negativePrompt: "blurry, low quality, distorted, ugly, bad anatomy",
      },
    };

    console.log("📤 Envoi de la requête à Vertex AI...");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur Vertex AI: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    // Extraire l'URL de la vidéo générée
    if (data.predictions && data.predictions[0]) {
      const videoUrl = data.predictions[0].bytesBase64Encoded;
      
      // Sauvegarder la vidéo localement
      const videoPath = await saveVideoLocally(videoUrl, script.title);
      
      console.log("✅ Vidéo générée:", videoPath);
      return videoPath;
    }

    throw new Error("Aucune vidéo générée par Vertex AI");

  } catch (error: any) {
    console.error("❌ Erreur Vertex AI:", error.message);
    throw error;
  }
}

/**
 * 🎨 Construire un prompt visuel à partir du script
 */
function buildVisualPrompt(script: ShortScript): string {
  const { hook, body, keywords } = script;
  
  // Créer un prompt descriptif pour la génération vidéo
  const scenes = [
    `Opening scene: ${hook}`,
    ...body.map((point, i) => `Scene ${i + 1}: ${point}`),
  ];

  const visualDescription = `
Professional YouTube Short video, vertical 9:16 format, modern and dynamic.
Style: High-quality, engaging, fast-paced.
Theme: ${keywords.join(", ")}

Scenes:
${scenes.join("\n")}

Visual elements: 
- Bold text overlays
- Smooth transitions
- Energetic movement
- Professional lighting
- Eye-catching colors
- Modern graphics
`.trim();

  return visualDescription;
}

/**
 * 💾 Sauvegarder la vidéo localement
 */
async function saveVideoLocally(base64Data: string, title: string): Promise<string> {
  const fs = await import("fs/promises");
  const path = await import("path");
  
  // Créer le dossier videos s'il n'existe pas
  const videosDir = path.join(process.cwd(), "public", "videos", "generated");
  await fs.mkdir(videosDir, { recursive: true });
  
  // Nom de fichier sécurisé
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .substring(0, 50);
  
  const filename = `${safeTitle}-${Date.now()}.mp4`;
  const filepath = path.join(videosDir, filename);
  
  // Décoder base64 et sauvegarder
  const buffer = Buffer.from(base64Data, "base64");
  await fs.writeFile(filepath, buffer);
  
  console.log("💾 Vidéo sauvegardée:", filepath);
  
  return `/videos/generated/${filename}`;
}

/**
 * 🎙️ Générer la voix avec Google Text-to-Speech
 */
export async function generateVoiceWithGoogle(text: string): Promise<string> {
  const API_KEY = getApiKey();
  console.log("🎙️ Génération voix avec Google TTS...");

  try {
    const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
    
    const requestBody = {
      input: { text },
      voice: {
        languageCode: "fr-FR",
        name: "fr-FR-Neural2-A", // Voix naturelle française
        ssmlGender: "NEUTRAL",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.1, // Légèrement plus rapide pour shorts
        pitch: 0,
        volumeGainDb: 0,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur TTS: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (data.audioContent) {
      // Sauvegarder l'audio
      const audioPath = await saveAudioLocally(data.audioContent, "voiceover");
      console.log("✅ Audio généré:", audioPath);
      return audioPath;
    }

    throw new Error("Aucun audio généré");

  } catch (error: any) {
    console.error("❌ Erreur TTS:", error.message);
    throw error;
  }
}

/**
 * 💾 Sauvegarder l'audio localement
 */
async function saveAudioLocally(base64Data: string, name: string): Promise<string> {
  const fs = await import("fs/promises");
  const path = await import("path");
  
  const audioDir = path.join(process.cwd(), "public", "audio", "generated");
  await fs.mkdir(audioDir, { recursive: true });
  
  const filename = `${name}-${Date.now()}.mp3`;
  const filepath = path.join(audioDir, filename);
  
  const buffer = Buffer.from(base64Data, "base64");
  await fs.writeFile(filepath, buffer);
  
  return `/audio/generated/${filename}`;
}

