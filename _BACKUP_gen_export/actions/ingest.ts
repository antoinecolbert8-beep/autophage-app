"use server";

import { ingestLocalDocs } from "@/lib/pinecone-ingest";

export async function ingestDataAction() {
  const res = await ingestLocalDocs();
  if (!res.success) {
    return { success: false, message: res.error || "Ingestion échouée" };
  }
  return { success: true, message: `Ingestion ok (${res.count} documents)` };
}






