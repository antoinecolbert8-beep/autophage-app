import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchByIntent, nativeTranslate } from '@/lib/ai/discovery';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const intent = searchParams.get('intent');
    const lang = searchParams.get('lang') || 'fr'; // Langue cible pour le "Polyglotte Natif"

    try {
        let listings = [];

        if (intent) {
            // 🧠 1. Recherche Sémantique par Intention
            const rankedResults = await searchByIntent(intent);
            const ids = rankedResults.map(r => r.listingId);

            // Fetch records in rank order
            listings = await prisma.marketplaceListing.findMany({
                where: { id: { in: ids }, status: 'ACTIVE' },
                include: { user: { select: { name: true, avatar: true } } }
            });
            // Re-sort per rank order
            listings = listings.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

        } else {
            // Pas d'intention : Flux Global par défaut (trié par date ou catégorie)
            listings = await prisma.marketplaceListing.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                take: 20,
                include: { user: { select: { name: true, avatar: true } } }
            });
        }

        // 🌐 2. Le Traducteur de Réalité (Polyglot Native)
        // Pour les listings trouvés, nous traduisons le titre et la description à la volée s'ils ne correspondent probablement pas.
        // En vrai production, on ferait ça en Batch ou Background Job avec cache, mais ici on le montre de manière Synchrone "On the fly"
        const translatedListings = await Promise.all(
            listings.map(async (listing) => {
                // Si l'utilisateur demande "ja" (Japonais) ou "en", on force la traduction.
                if (lang !== 'fr') {
                    const tTitle = await nativeTranslate(listing.title, lang);
                    const tDesc = await nativeTranslate(listing.description, lang);
                    return { ...listing, title: tTitle, description: tDesc };
                }
                return listing;
            })
        );

        return NextResponse.json({ success: true, listings: translatedListings });

    } catch (e) {
        console.error("Discovery API Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
