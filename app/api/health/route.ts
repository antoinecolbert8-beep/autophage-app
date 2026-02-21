/**
 * API Route: GET /api/health
 * Endpoint de santé pour monitoring (UptimeRobot, Pingdom, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/core/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ping rapide de la DB
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "up",
        api: "up",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      },
      { status: 503 }
    );
  }
}





