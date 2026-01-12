/**
 * 🎙️ ElevenLabs TTS Integration
 * Génération audio professionnelle pour les vidéos
 */

export type VoiceConfig = {
  voiceId?: string; // ID de la voix ElevenLabs
  stability?: number; // 0-1, défaut 0.5
  similarityBoost?: number; // 0-1, défaut 0.75
  style?: number; // 0-1, défaut 0
  useSpeakerBoost?: boolean; // défaut true
};

export type TTSRequest = {
  text: string;
  voice?: VoiceConfig;
  outputFormat?: "mp3_44100_128" | "mp3_22050_32" | "pcm_16000";
};

// Voix populaires ElevenLabs (à remplacer par les vraies IDs)
export const VOICES = {
  ADAM: "pNInz6obpgDQGcFmaJgB", // Voix masculine profonde
  ANTONI: "ErXwobaYiN019PkySvjV", // Voix masculine calme
  BELLA: "EXAVITQu4vr4xnSDxMaL", // Voix féminine douce
  RACHEL: "21m00Tcm4TlvDq8ikWAM", // Voix féminine claire
  DOMI: "AZnzlk1XvdvUeBnXmlld", // Voix féminine énergique
};

/**
 * Génère un fichier audio depuis du texte via ElevenLabs
 */
export async function generateSpeech(request: TTSRequest): Promise<{ url: string; duration: number }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY manquante dans .env");
  }

  const voiceId = request.voice?.voiceId ?? VOICES.ANTONI;
  const outputFormat = request.outputFormat ?? "mp3_44100_128";

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: request.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: request.voice?.stability ?? 0.5,
        similarity_boost: request.voice?.similarityBoost ?? 0.75,
        style: request.voice?.style ?? 0,
        use_speaker_boost: request.voice?.useSpeakerBoost ?? true,
      },
      output_format: outputFormat,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  // Récupère le buffer audio
  const audioBuffer = await response.arrayBuffer();
  
  // Sauvegarde temporaire (en production, upload sur S3/R2)
  const fs = await import("fs");
  const path = await import("path");
  const crypto = await import("crypto");
  
  const filename = `speech-${crypto.randomBytes(8).toString("hex")}.mp3`;
  const outputDir = path.join(process.cwd(), "public", "audio");
  
  // Crée le dossier si nécessaire
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

  // Estime la durée (approximation: 150 mots/min)
  const wordCount = request.text.split(/\s+/).length;
  const estimatedDuration = (wordCount / 150) * 60;

  return {
    url: `/audio/${filename}`,
    duration: Math.ceil(estimatedDuration),
  };
}

/**
 * Liste les voix disponibles
 */
export async function getAvailableVoices() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return Object.entries(VOICES).map(([name, id]) => ({ name, id }));
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
    });

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error("Erreur récupération voix:", error);
    return Object.entries(VOICES).map(([name, id]) => ({ name, id }));
  }
}





