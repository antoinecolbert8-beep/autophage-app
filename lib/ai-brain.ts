import { triggerAutomation } from "./automations";

/**
 * Génère une réponse en utilisant le contexte RAG Pinecone via Make
 * - embeddings 512d (text-embedding-3-small)
 * - topK configurable (par défaut 4)
 */
export async function generateSmartResponse(userPrompt: string, topK = 4) {
  // Make scénario:
  // 1. Webhook (prompt, topK)
  // 2. OpenAI Embedding
  // 3. Pinecone Search
  // 4. OpenAI Chat Completion (avec contexte)
  // 5. Webhook Response (content)

  const result = await triggerAutomation("GENERATE_SMART_RESPONSE", {
    prompt: userPrompt,
    topK
  });

  if (result.success && result.data?.response) {
    return result.data.response;
  }

  console.error("❌ Erreur Smart Response via Make:", result.message);
  return "Je n'ai pas pu générer une réponse intelligente pour le moment.";
}

/**
 * Génère du copy pour landing page selon le style demandé via Make
 * @param style - Style de copywriting: 'agressif', 'professionnel', 'amical'
 */
export async function generateLandingCopy(style: string = 'agressif') {
  const result = await triggerAutomation("GENERATE_LANDING_COPY", {
    style
  });

  if (result.success && result.data?.copy) {
    return result.data.copy;
  }

  return "Erreur de génération du copy.";
}
