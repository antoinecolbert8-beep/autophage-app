import { NextResponse } from "next/server";
// import { ingestLocalDocs } from "@/lib/pinecone-ingest"; // Désactivé pour le build

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  // Fonction désactivée temporairement pour le build Vercel
  // À activer manuellement après déploiement si nécessaire
  return NextResponse.json({ 
    success: false, 
    error: "Endpoint désactivé - Utiliser le script d'ingestion manuel" 
  }, { status: 501 });
  
  // const res = await ingestLocalDocs();
  // if (!res.success) {
  //   return NextResponse.json({ success: false, error: res.error }, { status: 500 });
  // }
  // return NextResponse.json({ success: true, count: res.count });
}

export async function GET() {
  return NextResponse.json({ status: "disabled" });
}



