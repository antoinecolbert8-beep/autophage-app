/**
 * 🏥 Health Check - Vérifie que tous les systèmes sont opérationnels
 * Usage: npx tsx scripts/health-check.ts
 */

import { PrismaClient } from "@prisma/client";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { existsSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

type CheckResult = {
  name: string;
  status: "✅" | "⚠️" | "❌";
  message: string;
};

const results: CheckResult[] = [];

async function checkDatabase() {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    results.push({
      name: "Database (PostgreSQL)",
      status: "✅",
      message: `Connecté (${userCount} utilisateurs)`,
    });
  } catch (error) {
    results.push({
      name: "Database (PostgreSQL)",
      status: "❌",
      message: `Erreur: ${(error as Error).message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function checkPinecone() {
  try {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      results.push({
        name: "Pinecone",
        status: "❌",
        message: "PINECONE_API_KEY manquante",
      });
      return;
    }

    const pc = new Pinecone({ apiKey });
    const indexes = await pc.listIndexes();
    const hasIndex = indexes.indexes?.some((idx) => idx.name === "autophage-brain");

    results.push({
      name: "Pinecone",
      status: hasIndex ? "✅" : "⚠️",
      message: hasIndex
        ? "Index 'autophage-brain' trouvé"
        : "Index manquant (lance: npm run setup:pinecone)",
    });
  } catch (error) {
    results.push({
      name: "Pinecone",
      status: "❌",
      message: `Erreur: ${(error as Error).message}`,
    });
  }
}

async function checkOpenAI() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      results.push({
        name: "OpenAI",
        status: "❌",
        message: "OPENAI_API_KEY manquante",
      });
      return;
    }

    const openai = new OpenAI({ apiKey });
    await openai.models.list();

    results.push({
      name: "OpenAI",
      status: "✅",
      message: "API fonctionnelle",
    });
  } catch (error) {
    results.push({
      name: "OpenAI",
      status: "❌",
      message: `Erreur: ${(error as Error).message}`,
    });
  }
}

function checkElevenLabs() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  results.push({
    name: "ElevenLabs (optionnel)",
    status: apiKey ? "✅" : "⚠️",
    message: apiKey ? "Configuré" : "Non configuré (génération audio désactivée)",
  });
}

function checkFFmpeg() {
  const { execSync } = require("child_process");
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    results.push({
      name: "FFmpeg",
      status: "✅",
      message: "Installé",
    });
  } catch {
    results.push({
      name: "FFmpeg",
      status: "❌",
      message: "Non installé (requis pour génération vidéo)",
    });
  }
}

function checkPythonBot() {
  const storageStatePath = join(process.cwd(), "SaaS_Bot_LinkedIn", "storage_state.json");
  const hasSession = existsSync(storageStatePath);

  results.push({
    name: "Bot LinkedIn (Python)",
    status: hasSession ? "✅" : "⚠️",
    message: hasSession
      ? "Session sauvegardée trouvée"
      : "Pas de session (lance: cd SaaS_Bot_LinkedIn && python login_saver.py)",
  });
}

async function main() {
  console.log("🏥 Health Check - Vérification des systèmes...\n");

  await checkDatabase();
  await checkPinecone();
  await checkOpenAI();
  checkElevenLabs();
  checkFFmpeg();
  checkPythonBot();

  console.log("=".repeat(70));
  console.log("Résultats :\n");

  results.forEach((result) => {
    console.log(`${result.status} ${result.name}`);
    console.log(`   ${result.message}\n`);
  });

  const criticalErrors = results.filter((r) => r.status === "❌").length;
  const warnings = results.filter((r) => r.status === "⚠️").length;
  const success = results.filter((r) => r.status === "✅").length;

  console.log("=".repeat(70));
  console.log(
    `\nRésumé: ${success} ✅ | ${warnings} ⚠️ | ${criticalErrors} ❌\n`
  );

  if (criticalErrors > 0) {
    console.log("❌ Erreurs critiques détectées. Consulte la documentation.");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("⚠️ Avertissements détectés. Système partiellement fonctionnel.");
    process.exit(0);
  } else {
    console.log("✅ Tous les systèmes sont opérationnels !");
    process.exit(0);
  }
}

main();





