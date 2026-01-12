/**
 * API Route: POST /api/rag/query
 * Endpoint RAG pour répondre à des questions avec le contexte Pinecone
 */

import { NextRequest, NextResponse } from "next/server";
import { generateSmartResponse } from "@/lib/ai-brain";

export async function POST(req: NextRequest) {
  try {
    const { query, topK } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query requise (string)" },
        { status: 400 }
      );
    }

    const response = await generateSmartResponse(query, topK ?? 4);

    return NextResponse.json({
      success: true,
      response,
      query,
    });
  } catch (error) {
    console.error("Erreur RAG:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}





