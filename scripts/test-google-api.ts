#!/usr/bin/env tsx

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

console.log("🔑 Test de la clé API Google");
console.log("=====================================");
console.log("");

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ GOOGLE_API_KEY non trouvée dans .env");
  process.exit(1);
}

console.log("✅ Clé trouvée:", apiKey.substring(0, 10) + "...");
console.log("");
console.log("🧪 Test de connexion à l'API Google Generative AI...");
console.log("");

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log("📤 Envoi de la requête test...");
    const result = await model.generateContent("Dis bonjour en une phrase");
    const response = result.response.text();
    
    console.log("✅ API FONCTIONNELLE !");
    console.log("📝 Réponse:", response);
    console.log("");
    console.log("🎉 Votre clé API Google fonctionne correctement !");
  } catch (error: any) {
    console.error("❌ ERREUR:");
    console.error("");
    console.error(error.message);
    console.error("");
    
    if (error.message.includes("403")) {
      console.log("💡 SOLUTION:");
      console.log("   1. Vérifiez que votre clé API est correcte");
      console.log("   2. Allez sur: https://makersuite.google.com/app/apikey");
      console.log("   3. Créez une nouvelle clé API");
      console.log("   4. Activez l'API Gemini sur votre projet Google Cloud");
      console.log("   5. Remplacez dans .env: GOOGLE_API_KEY=votre_nouvelle_cle");
    }
    
    process.exit(1);
  }
}

testAPI();




