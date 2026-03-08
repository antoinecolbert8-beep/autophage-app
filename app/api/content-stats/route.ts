import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/core/db";

export const dynamic = "force-dynamic";

const statSchema = z.object({
  postId: z.string(),
  platform: z.string(),
  views: z.number().int().nonnegative().optional().default(0),
  likes: z.number().int().nonnegative().optional().default(0),
  comments: z.number().int().nonnegative().optional().default(0),
  shares: z.number().int().nonnegative().optional().default(0),
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const postId = searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId requis" }, { status: 400 });
  }

  const stats = await db.contentStat.findMany({
    where: { postId },
    orderBy: { collectedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ stats });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = statSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const stat = await db.contentStat.create({ data: parsed.data as any });
  return NextResponse.json({ success: true, stat });
}






