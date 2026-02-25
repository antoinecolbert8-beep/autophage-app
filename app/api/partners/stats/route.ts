import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";
import { PartnerService } from "@/lib/services/partner-service";

/**
 * GET PARTNER STATS
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const stats = await PartnerService.getPartnerStats(userId);

        if (!stats) {
            return NextResponse.json({ error: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("[PARTNERS_API] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
