import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/core/db";

export const dynamic = "force-dynamic";

const preferenceSchema = z.object({
  userId: z.string(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  wording: z.record(z.string()).optional(),
  tone: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  const prefs = await db.userPreference.findUnique({ where: { userId } });
  return NextResponse.json({ preferences: prefs });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = preferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const prefs = await db.userPreference.upsert({
    where: { userId: data.userId },
    update: { ...data },
    create: { ...data },
  });

  return NextResponse.json({ success: true, preferences: prefs });
}






