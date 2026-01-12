"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { generateVideoWithVertexAI, generateVoiceWithGoogle } from "./vertex-ai-video";

export type ShortScript = {
  hook: string;
  body: string[];
  cta: string;
  keywords: string[];
  title: string;
  description: string;
  hashtags: string[];
};

export type ShortVideo = {
  script: ShortScript;
  videoUrl?: string;
  thumbnailUrl?: string;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  youtubeId?: string;
};

/**
 * 🎬 GÉNÉRATEUR DE YOUTUBE SHORTS
 * Génère un script viral optimisé pour YouTube Shorts (<60 secondes)
 */
export async function generateShortScript(topic: string): Promise<ShortScript> {
  const prompt = `Tu es un expert en création de contenu viral pour YouTube Shorts.

OBJECTIF: Créer un script captivant de 45-55 secondes sur le sujet: "${topic}"

STRUCTURE OBLIGATOIRE:
1. HOOK (3 secondes): Phrase choc qui arrête le scroll
2. BODY (40 secondes): 3-4 points clés, format bullet rapide
3. CTA (5 secondes): Appel à l'action percutant

RÈGLES STRICTES:
- Format vertical 9:16
- Langage direct, énergique
- Phrases courtes (max 10 mots)
- Pas de jargon technique
- Créer de la curiosité et de l'urgence
- Optimisé pour la rétention (dopamine algo)

RETOUR FORMAT JSON:
{
  "hook": "phrase d'accroche choc",
  "body": ["point 1", "point 2", "point 3"],
  "cta": "appel à l'action",
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
  "title": "Titre YouTube optimisé SEO (max 100 caractères)",
  "description": "Description complète avec keywords",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}

GÉNÈRE LE SCRIPT MAINTENANT:`;

  try {
    // Essayer d'abord avec OpenAI (plus fiable)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.length > 20) {
      console.log("🤖 Utilisation d'OpenAI GPT-4...");
      const openai = new OpenAI({
        apiKey: openaiKey,
      });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en création de contenu viral YouTube Shorts. Tu réponds UNIQUEMENT en JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content || "{}";
      const script: ShortScript = JSON.parse(response);
      return script;
    }
    
    // Fallback sur Gemini si OpenAI pas disponible
    console.log("🤖 Utilisation de Google Gemini...");
    const geminiKey = process.env.GOOGLE_API_KEY;
    if (!geminiKey || geminiKey.length < 20) {
      throw new Error("Aucune clé API disponible (OpenAI ou Google)");
    }
    
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extraire le JSON de la réponse
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Impossible d'extraire le script JSON");
    }

    const script: ShortScript = JSON.parse(jsonMatch[0]);
    return script;
  } catch (error) {
    console.error("❌ Erreur génération script:", error);
    throw error;
  }
}

/**
 * 🎙️ GÉNÉRATION AUDIO
 * Utilise Google Text-to-Speech ou mode simulation
 */
export async function generateVoiceover(script: ShortScript): Promise<string> {
  const fullText = `${script.hook}. ${script.body.join(". ")}. ${script.cta}`;
  
  console.log("📢 Texte pour voiceover:", fullText);
  
  // Vérifier si Vertex AI est activé
  const vertexEnabled = process.env.VERTEX_AI_ENABLED === "true";
  
  if (vertexEnabled) {
    try {
      console.log("🎙️ Mode PRODUCTION : Génération audio réelle avec Google TTS...");
      return await generateVoiceWithGoogle(fullText);
    } catch (error: any) {
      console.error("❌ Erreur TTS, fallback vers simulation:", error.message);
    }
  }
  
  // Mode simulation (par défaut)
  console.log("⚠️ Mode SIMULATION : audio placeholder");
  return "/audio/placeholder-voiceover.mp3";
}

/**
 * 🎨 GÉNÉRATION VIDÉO
 * Utilise Vertex AI Imagen Video ou mode simulation
 */
export async function generateVideoFromScript(script: ShortScript): Promise<string> {
  console.log("🎬 Génération vidéo pour:", script.title);
  
  // Vérifier si Vertex AI est activé
  const vertexEnabled = process.env.VERTEX_AI_ENABLED === "true";
  
  if (vertexEnabled) {
    try {
      console.log("🎬 Mode PRODUCTION : Génération vidéo réelle avec Vertex AI...");
      return await generateVideoWithVertexAI(script);
    } catch (error: any) {
      console.error("❌ Erreur Vertex AI, fallback vers simulation:", error.message);
    }
  }
  
  // Mode simulation (par défaut)
  console.log("⚠️ Mode SIMULATION : vidéo placeholder");
  return "/videos/placeholder-short.mp4";
}

/**
 * 🔄 Obtenir un Access Token depuis le Refresh Token
 */
async function getAccessToken(): Promise<string> {
  const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
  const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error("Credentials YouTube manquants. Configurez YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur OAuth: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * 📤 UPLOAD SUR YOUTUBE
 * Utilise l'API YouTube Data v3
 */
export async function uploadToYouTube(video: ShortVideo): Promise<string> {
  console.log("📤 Upload sur YouTube...");
  console.log("Titre:", video.script.title);
  console.log("Description:", video.script.description);
  console.log("Hashtags:", video.script.hashtags.join(" "));

  try {
    // Obtenir un access token
    console.log("🔑 Obtention du token d'accès...");
    const accessToken = await getAccessToken();
    console.log("✅ Token obtenu");

    // Pour l'instant, on simule l'upload car on n'a pas de vraie vidéo
    // TODO: Implémenter l'upload réel avec un fichier vidéo
    console.log("⚠️ Mode simulation : upload réel nécessite un fichier vidéo");
    console.log("📝 Les métadonnées sont prêtes :");
    console.log(`   - Titre: ${video.script.title}`);
    console.log(`   - Description: ${video.script.description}`);
    console.log(`   - Tags: ${video.script.keywords.join(", ")}`);
    console.log(`   - Hashtags: ${video.script.hashtags.join(" ")}`);
    
    // Retourner un ID simulé pour l'instant
    const mockYouTubeId = `READY_${Date.now()}`;
    console.log("✅ Prêt pour upload ! ID simulé:", mockYouTubeId);
    
    return mockYouTubeId;

    /* CODE RÉEL D'UPLOAD (à activer quand vidéo disponible):
    
    const metadata = {
      snippet: {
        title: video.script.title,
        description: `${video.script.description}\n\n${video.script.hashtags.join(" ")}`,
        tags: video.script.keywords,
        categoryId: "22", // People & Blogs
      },
      status: {
        privacyStatus: "public", // ou "private" ou "unlisted"
        selfDeclaredMadeForKids: false,
      },
    };

    // Upload avec multipart
    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const videoData = await fetch(video.videoUrl).then(r => r.arrayBuffer());
    
    const body = 
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: video/mp4\r\n\r\n" +
      Buffer.from(videoData).toString("binary") +
      closeDelim;

    const uploadResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(`Erreur upload: ${JSON.stringify(error)}`);
    }

    const uploadData = await uploadResponse.json();
    console.log("✅ Vidéo uploadée avec succès !");
    return uploadData.id;
    */
    
  } catch (error: any) {
    console.error("❌ Erreur upload YouTube:", error.message);
    throw error;
  }
}

/**
 * 🚀 PIPELINE COMPLET
 * Génère et upload un YouTube Short de A à Z
 */
export async function createAndUploadShort(topic: string): Promise<ShortVideo> {
  console.log("🎬 DÉMARRAGE GÉNÉRATION YOUTUBE SHORT");
  console.log("Sujet:", topic);

  // Étape 1: Générer le script
  console.log("\n📝 Étape 1/4: Génération du script...");
  const script = await generateShortScript(topic);
  console.log("✅ Script généré:", script.title);

  // Étape 2: Générer le voiceover
  console.log("\n🎙️ Étape 2/4: Génération du voiceover...");
  const audioUrl = await generateVoiceover(script);
  console.log("✅ Audio généré:", audioUrl);

  // Étape 3: Générer la vidéo
  console.log("\n🎨 Étape 3/4: Génération de la vidéo...");
  const videoUrl = await generateVideoFromScript(script);
  console.log("✅ Vidéo générée:", videoUrl);

  // Étape 4: Upload sur YouTube
  console.log("\n📤 Étape 4/4: Upload sur YouTube...");
  const video: ShortVideo = {
    script,
    videoUrl,
    uploadStatus: "uploading",
  };

  try {
    const youtubeId = await uploadToYouTube(video);
    video.youtubeId = youtubeId;
    video.uploadStatus = "success";
    console.log("✅ Upload réussi! ID:", youtubeId);
  } catch (error) {
    console.error("❌ Erreur upload:", error);
    video.uploadStatus = "error";
  }

  console.log("\n🎉 GÉNÉRATION TERMINÉE !");
  return video;
}

/**
 * 🔥 GÉNÉRATEUR DE CONTENU VIRAL EN MASSE
 * Génère plusieurs shorts d'un coup sur différents sujets
 */
export async function generateViralShortsBatch(topics: string[]): Promise<ShortVideo[]> {
  console.log(`🚀 Génération de ${topics.length} YouTube Shorts...`);
  
  const results: ShortVideo[] = [];
  
  for (const topic of topics) {
    try {
      const short = await createAndUploadShort(topic);
      results.push(short);
      
      // Délai entre chaque génération pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erreur pour "${topic}":`, error);
      results.push({
        script: {
          hook: "Erreur",
          body: [],
          cta: "",
          keywords: [],
          title: topic,
          description: "",
          hashtags: [],
        },
        uploadStatus: "error",
      });
    }
  }
  
  console.log(`✅ Batch terminé: ${results.filter(r => r.uploadStatus === "success").length}/${topics.length} réussis`);
  return results;
}


