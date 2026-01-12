/**
 * 🤖 Base Agent - Classe de base pour tous les agents autonomes
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const prisma = new PrismaClient();

export abstract class BaseAgent {
  protected name: string;
  protected role: string;
  protected model: any;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  /**
   * Méthode abstraite - Chaque agent implémente sa logique
   */
  abstract execute(): Promise<any>;

  /**
   * Prise de décision autonome
   */
  protected async decide(context: string, options: string[]): Promise<string> {
    // Hajime Protocol: Robustness Check
    const optionsWithFallback = [...options, "DEMANDER_AIDE"];
    const prompt = `Tu es ${this.name}, ${this.role}.

**Contexte** : ${context}

**Options disponibles** :
${optionsWithFallback.map((o, i) => `${i + 1}. ${o}`).join("\n")}

**Décide quelle action prendre**.
Si la demande est impossible, dangereuse ou incompréhensible, choisis la dernière option (DEMANDER_AIDE).
Réponds UNIQUEMENT avec le numéro de l'option choisie.`;

    try {
      const result = await this.model.generateContent(prompt);
      const decisionText = result.response.text().trim();
      const baseIndex = parseInt(decisionText, 10) - 1;

      if (isNaN(baseIndex) || baseIndex < 0 || baseIndex >= optionsWithFallback.length) {
        console.warn(`[${this.name}] Décision invalide (${decisionText}), repli sur sécurité.`);
        return "DEMANDER_AIDE";
      }

      return optionsWithFallback[baseIndex];
    } catch (e) {
      console.error(`[${this.name}] Erreur cognitive:`, e);
      return "DEMANDER_AIDE";
    }
  }

  /**
   * Log des actions de l'agent
   */
  protected async logAction(action: string, result: any) {
    console.log(`[${this.name}] ${action}:`, result);

    await prisma.actionHistory.create({
      data: {
        userId: "AGENT",
        platform: "SYSTEM",
        action: `AGENT_${this.name.toUpperCase()}_${action}`,
        context: JSON.stringify({ result }),
      },
    });
  }

  /**
   * Communication inter-agents
   */
  protected async sendMessage(targetAgent: string, message: string) {
    console.log(`[${this.name}] → [${targetAgent}]: ${message}`);
    // TODO: Implémenter queue Redis pour communication async
  }
}





