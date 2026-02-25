import { NextRequest, NextResponse } from "next/server";
import { Omniscience } from "@/lib/omniscience";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
        }

        const { organizationId } = await req.json();
        if (!organizationId) {
            return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
        }

        // Trigger the Singularity
        const result = await Omniscience.triggerSingularity(organizationId);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Omniscience Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
