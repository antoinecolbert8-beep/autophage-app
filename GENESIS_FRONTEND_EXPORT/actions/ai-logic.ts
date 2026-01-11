"use server"
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function generateWithBrainAction(userPrompt: string) {
  try {
    const index = pc.index("autophage-brain");

    // 1. Transformer ta question en vecteur (512d) pour Pinecone
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userPrompt,
      dimensions: 512, // Doit correspondre à ton index AWS
    });

    // 2. Chercher les modules les plus proches de ta question
    const queryResponse = await index.query({
      vector: embedding.data[0].embedding,
      topK: 2,
      includeMetadata: true,
    });

    // 3. Extraire le texte de tes modules (ex: Module 1, Module 2)
    const context = queryResponse.matches.map(m => m.metadata?.content).join("\n\n");

    // 4. Envoyer le tout à GPT-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `Tu es l'IA Autophage. Réponds en utilisant UNIQUEMENT ces modules stratégiques de ma connaissance : ${context}` 
        },
        { role: "user", content: userPrompt }
      ],
    });

    return { output: response.choices[0].message.content };
  } catch (error) {
    console.error("Erreur cerveau :", error);
    return { error: "L'IA n'a pas pu accéder à Pinecone." };
  }
}
