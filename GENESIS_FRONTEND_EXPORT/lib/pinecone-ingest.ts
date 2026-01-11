"use server";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const DATA_DIR = path.join(process.cwd(), "data");

// Initialisation lazy pour éviter les erreurs au build
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-dummy" });
}

function getPinecone() {
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "pc-dummy" });
}

type IngestedDoc = {
  id: string;
  text: string;
  source: string;
};

function chunkText(text: string, chunkSize = 1200, overlap = 200) {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}

async function extractFromFile(filePath: string): Promise<IngestedDoc[]> {
  const ext = path.extname(filePath).toLowerCase();
  const baseId = path.basename(filePath);

  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const pdf = await pdfParse(buffer);
    return [
      {
        id: baseId,
        text: pdf.text,
        source: filePath,
      },
    ];
  }

  if (ext === ".txt" || ext === ".md") {
    const text = fs.readFileSync(filePath, "utf-8");
    return [
      {
        id: baseId,
        text,
        source: filePath,
      },
    ];
  }

  // fichiers inconnus ignorés
  return [];
}

async function embedAndUpsert(indexName: string, docs: IngestedDoc[]) {
  const pc = getPinecone();
  const openai = getOpenAI();
  const index = pc.index(indexName);

  for (const doc of docs) {
    const chunks = chunkText(doc.text);
    for (let i = 0; i < chunks.length; i++) {
      const input = chunks[i];
      if (!input.trim()) continue;

      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input,
        dimensions: 512,
      });

      const vector = embeddingResponse.data[0].embedding;

      await index.upsert([
        {
          id: `${doc.id}-${i}`,
          values: vector,
          metadata: { content: input, source: doc.source, chunk: i },
        },
      ]);
    }
  }
}

/**
 * Ingestion principale : lit les fichiers de ./data et les pousse dans Pinecone.
 */
export async function ingestLocalDocs(indexName = "autophage-brain") {
  try {
    // Vérification conditionnelle (ne pas échouer au build)
    if (!fs.existsSync(DATA_DIR)) {
      return { success: false, error: "Le dossier ./data n'existe pas. Ajoute tes PDF/Docs dedans." };
    }

    const files = fs.readdirSync(DATA_DIR)
      .filter(f => !f.startsWith('.')) // Ignorer les fichiers cachés
      .map((f) => path.join(DATA_DIR, f))
      .filter(f => fs.statSync(f).isFile()); // Seulement les fichiers
    const docs: IngestedDoc[] = [];

    for (const file of files) {
      const extracted = await extractFromFile(file);
      docs.push(...extracted);
    }

    if (docs.length === 0) {
      throw new Error("Aucun document pris en charge trouvé dans ./data");
    }

    await embedAndUpsert(indexName, docs);
    return { success: true, count: docs.length };
  } catch (error) {
    console.error("Erreur d'ingestion :", error);
    return { success: false, error: (error as Error).message };
  }
}
