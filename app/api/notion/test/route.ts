import { NextResponse } from "next/server";
import { getNotionDatabase } from "@/lib/notion";

export async function GET() {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey || !databaseId) {
        return NextResponse.json(
            { error: "Variables d'environnement NOTION_API_KEY ou NOTION_DATABASE_ID manquantes." },
            { status: 400 }
        );
    }

    try {
        const data = await getNotionDatabase(databaseId);
        return NextResponse.json({ success: true, count: data.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
