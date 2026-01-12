/**
 * 🔧 Self-Healing System - Auto-réparation intelligente
 * Le système détecte les erreurs, analyse avec Gemini et se répare automatiquement
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export type ErrorLog = {
  timestamp: Date;
  service: string;
  error: string;
  stackTrace: string;
  context?: Record<string, any>;
};

export type HealingAction = {
  detected: string;
  diagnosis: string;
  fix: string;
  codePatches?: Array<{ file: string; oldCode: string; newCode: string }>;
  confidence: number;
};

/**
 * Analyse une erreur et propose une correction
 */
export async function analyzeAndHeal(errorLog: ErrorLog): Promise<HealingAction> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Tu es un système expert en auto-réparation de code.

**Erreur détectée** :
Service: ${errorLog.service}
Erreur: ${errorLog.error}
Stack: ${errorLog.stackTrace}

**Contexte** : ${JSON.stringify(errorLog.context || {})}

**Analyse et propose une correction** :

1. **Diagnostic** : Quelle est la cause racine ?
2. **Fix** : Comment corriger automatiquement ?
3. **Code Patch** : Si c'est un problème de scraping (sélecteur CSS), fournis le nouveau code

Format JSON :
{
  "detected": "Description problème",
  "diagnosis": "Cause racine",
  "fix": "Action corrective",
  "codePatches": [
    {
      "file": "chemin/fichier.py",
      "oldCode": "ancien code",
      "newCode": "nouveau code"
    }
  ],
  "confidence": 0-100
}

**IMPORTANT** : Pour les erreurs de scraping LinkedIn/Instagram, identifie les nouveaux sélecteurs CSS en analysant la structure HTML moderne.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const healing = JSON.parse(jsonMatch[0]);

      // Log l'action de guérison
      logHealingAction(errorLog, healing);

      return healing;
    }

    return {
      detected: errorLog.error,
      diagnosis: "Erreur d'analyse Gemini",
      fix: "Inspection manuelle requise",
      confidence: 0,
    };
  } catch (error) {
    console.error("❌ Erreur analyse auto-réparation:", error);
    return {
      detected: errorLog.error,
      diagnosis: "Erreur système de guérison",
      fix: "Escalade vers admin",
      confidence: 0,
    };
  }
}

/**
 * Applique automatiquement un patch de code
 */
export async function applyCodePatch(patch: {
  file: string;
  oldCode: string;
  newCode: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), patch.file);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: `Fichier introuvable: ${patch.file}` };
    }

    let content = fs.readFileSync(filePath, "utf-8");

    // Remplace l'ancien code
    if (!content.includes(patch.oldCode)) {
      return {
        success: false,
        error: "Code original non trouvé (fichier déjà modifié ?)",
      };
    }

    content = content.replace(patch.oldCode, patch.newCode);

    // Sauvegarde avec backup
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    fs.writeFileSync(filePath, content, "utf-8");

    console.log(`✅ Patch appliqué : ${patch.file}`);
    console.log(`💾 Backup créé : ${backupPath}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Surveillance continue des logs
 */
export function watchLogs(logFilePath: string, callback: (errorLog: ErrorLog) => void) {
  if (!fs.existsSync(logFilePath)) {
    console.warn(`⚠️ Fichier de logs introuvable: ${logFilePath}`);
    return;
  }

  console.log(`👁️ Surveillance des logs: ${logFilePath}`);

  fs.watchFile(logFilePath, { interval: 5000 }, () => {
    const logs = fs.readFileSync(logFilePath, "utf-8");
    const lines = logs.split("\n").filter(Boolean);

    // Analyse les dernières lignes pour détecter les erreurs
    lines.slice(-10).forEach((line) => {
      if (line.includes("ERROR") || line.includes("Exception")) {
        const errorLog: ErrorLog = {
          timestamp: new Date(),
          service: "Unknown",
          error: line,
          stackTrace: line,
        };

        callback(errorLog);
      }
    });
  });
}

/**
 * Log une action de guérison
 */
function logHealingAction(error: ErrorLog, healing: HealingAction) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: error.error,
    diagnosis: healing.diagnosis,
    fix: healing.fix,
    confidence: healing.confidence,
  };

  const logPath = path.join(process.cwd(), "logs", "healing.log");
  const logDir = path.dirname(logPath);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n");
}

/**
 * Démarre le système d'auto-réparation
 */
export function startSelfHealing() {
  const logsDir = path.join(process.cwd(), "logs");

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Surveille les logs du bot Python
  watchLogs(path.join(process.cwd(), "SaaS_Bot_LinkedIn", "bot.log"), async (errorLog) => {
    console.log("🔧 Erreur détectée, analyse en cours...");

    const healing = await analyzeAndHeal(errorLog);

    if (healing.confidence >= 70 && healing.codePatches) {
      console.log(`💊 Confiance ${healing.confidence}%, application du patch...`);

      for (const patch of healing.codePatches) {
        const result = await applyCodePatch(patch);
        if (result.success) {
          console.log("✅ Système réparé automatiquement");
        } else {
          console.error(`❌ Échec patch: ${result.error}`);
        }
      }
    } else {
      console.log(`⚠️ Confiance faible (${healing.confidence}%), escalade manuelle`);
    }
  });

  console.log("🔧 Système d'auto-réparation démarré");
}





