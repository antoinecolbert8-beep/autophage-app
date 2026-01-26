/**
 * 🎙️ ElevenLabs TTS Integration
 * Génération audio professionnelle déléguée à Make.com
 */

import { triggerAutomation } from "./automations";

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

// Voix populaires ElevenLabs (à envoyer à Make pour qu'il les utilise)
export const VOICES = {
  ADAM: "pNInz6obpgDQGcFmaJgB",
  ANTONI: "ErXwobaYiN019PkySvjV",
  BELLA: "EXAVITQu4vr4xnSDxMaL",
  RACHEL: "21m00Tcm4TlvDq8ikWAM",
  DOMI: "AZnzlk1XvdvUeBnXmlld",
};

/**
 * Génère un fichier audio depuis du texte via Make
 * Retourne l'URL de l'audio généré (stocké par Make sur S3/Drive/Cloudinary)
 */
export async function generateSpeech(request: TTSRequest): Promise<{ url: string; duration: number }> {
  // Make scénario:
  // 1. Webhook (text, voiceId, settings)
  // 2. ElevenLabs Generate
  // 3. Upload to Storage (Google Drive / S3 / TMP)
  // 4. Webhook Response (publicUrl, duration)

  const result = await triggerAutomation("GENERATE_SPEECH", {
    text: request.text,
    voiceId: request.voice?.voiceId ?? VOICES.ANTONI,
    settings: request.voice,
    outputFormat: request.outputFormat
  });

  if (result.success && result.data?.url) {
    return {
      url: result.data.url,
      duration: result.data.duration || 0
    };
  }

  throw new Error(`Erreur génération TTS Make: ${result.message}`);
}

/**
 * Liste les voix disponibles (Via Make ou fallback statique)
 */
export async function getAvailableVoices() {
  // Optionnel: Demander à Make de lister les voix
  // Pour l'instant on retourne les constantes pour éviter la latence
  return Object.entries(VOICES).map(([name, id]) => ({ name, id }));
}





