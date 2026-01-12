#!/usr/bin/env tsx

/**
 * 🔐 SCRIPT: Authentification YouTube OAuth2
 * Usage: tsx scripts/youtube-auth.ts
 * 
 * Ce script vous aide à obtenir un REFRESH_TOKEN pour YouTube API
 */

import { config } from "dotenv";
import { resolve } from "path";
import * as readline from "readline";

// Charger .env
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║  🔐 AUTHENTIFICATION YOUTUBE API                         ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("");

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // For desktop apps

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ ERREUR: YOUTUBE_CLIENT_ID ou YOUTUBE_CLIENT_SECRET manquant dans .env");
  console.error("");
  console.error("📝 Pour obtenir ces clés:");
  console.error("   1. Allez sur: https://console.cloud.google.com/");
  console.error("   2. Créez un projet et activez YouTube Data API v3");
  console.error("   3. Créez des credentials OAuth 2.0 (Desktop app)");
  console.error("   4. Ajoutez-les dans votre .env");
  console.error("");
  process.exit(1);
}

console.log("✅ Clés OAuth trouvées");
console.log("");

// Scopes nécessaires pour uploader des vidéos
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
].join(" ");

// Construire l'URL d'autorisation
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║  ÉTAPE 1: Autoriser l'application                        ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("");
console.log("🌐 Ouvrez cette URL dans votre navigateur:");
console.log("");
console.log(authUrl);
console.log("");
console.log("📋 Étapes:");
console.log("   1. Connectez-vous avec votre compte YouTube");
console.log("   2. Autorisez l'application");
console.log("   3. Copiez le CODE d'autorisation affiché");
console.log("");

// Interface pour lire l'input utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("🔑 Collez le code d'autorisation ici: ", async (authCode) => {
  rl.close();
  
  if (!authCode || authCode.trim().length === 0) {
    console.error("❌ Aucun code fourni. Abandon.");
    process.exit(1);
  }

  console.log("");
  console.log("⏳ Échange du code contre un token...");
  console.log("");

  try {
    // Échanger le code contre un access token et refresh token
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authCode.trim(),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur API: ${error}`);
    }

    const data = await response.json();

    if (!data.refresh_token) {
      console.error("❌ ERREUR: Pas de refresh_token reçu.");
      console.error("");
      console.error("💡 Solution: Relancez le script et assurez-vous de:");
      console.error("   1. Utiliser un compte qui n'a jamais autorisé cette app");
      console.error("   2. Ou révoquez l'accès sur: https://myaccount.google.com/permissions");
      console.error("");
      process.exit(1);
    }

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║  ✅ SUCCÈS ! TOKENS OBTENUS                              ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log("");
    console.log("📋 Ajoutez ces lignes à votre fichier .env:");
    console.log("");
    console.log("─────────────────────────────────────────────────────────");
    console.log(`YOUTUBE_REFRESH_TOKEN=${data.refresh_token}`);
    console.log("─────────────────────────────────────────────────────────");
    console.log("");
    console.log("🎯 Tokens détaillés:");
    console.log(`   Access Token: ${data.access_token.substring(0, 30)}...`);
    console.log(`   Refresh Token: ${data.refresh_token.substring(0, 30)}...`);
    console.log(`   Expires in: ${data.expires_in} secondes`);
    console.log("");
    console.log("✅ Configuration terminée !");
    console.log("");
    console.log("🚀 Vous pouvez maintenant uploader des vidéos avec:");
    console.log("   npx tsx scripts/generate-youtube-short.ts");
    console.log("");

  } catch (error: any) {
    console.error("❌ ERREUR lors de l'échange du code:");
    console.error(error.message);
    console.error("");
    process.exit(1);
  }
});


