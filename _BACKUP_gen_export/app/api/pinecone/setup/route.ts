/**
 * API Route: POST /api/pinecone/setup
 * Initialise ou vérifie l'instance Pinecone
 */

import { NextRequest, NextResponse } from "next/server";
import { initializePinecone, getPineconeStats } from "@/lib/pinecone-setup";

export async function POST(req: NextRequest) {
  try {
    const result = await initializePinecone();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const stats = await getPineconeStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}





