import { NextRequest, NextResponse } from "next/server";
import { generateSmartResponse } from "@/lib/ai-brain";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { prompt, topK } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "prompt requis" }, { status: 400 });
    }
    const answer = await generateSmartResponse(prompt, topK ?? 4);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("brain error", error);
    return NextResponse.json({ error: "brain_failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}






