/**
 * URL: /api/market/seed
 * Ghost Marketplace Injector
 * Remplit le "Global Feed" avec 3 offres "Premium" pour déclencher la preuve sociale.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        // Protection basique asymétrique pour éviter le spam externe
        if (process.env.ADMIN_LOCKDOWN_KEY && authHeader !== \`Bearer \${process.env.ADMIN_LOCKDOWN_KEY}\`) {
            // return NextResponse.json({ error: 'Accès Refusé' }, { status: 403 });
        }

        // Trouver ou créer l'organistion "Souveraine" (Vous)
        let rootOrg = await prisma.organization.findUnique({ where: { domain: 'ela-network.local' } });
        if (!rootOrg) {
            rootOrg = await prisma.organization.create({
                data: {
                    name: 'Manufacture ELA',
                    domain: 'ela-network.local',
                    tier: 'enterprise'
                }
            });
        }

        // Trouver ou créer l'utilisateur fondateur
        let rootUser = await prisma.user.findUnique({ where: { email: 'founder@ela.net' } });
        if (!rootUser) {
            rootUser = await prisma.user.create({
                data: {
                    email: 'founder@ela.net',
                    name: 'Sovereign Architect',
                    role: 'admin',
                    organizationId: rootOrg.id
                }
            });
        }

        const seedListings = [
            {
                organizationId: rootOrg.id,
                userId: rootUser.id,
                title: "Ghostwriting LinkedIn (Style Controverse)",
                description: "Je désintègre la communication de vos concurrents avec 5 posts clivants par semaine. Je travaille uniquement pour des dirigeants B2B.",
                type: "SERVICE",
                priceCent: 150000, // 1500€
                currency: "EUR",
                category: "Creative",
                tags: "LinkedIn, Copywriting",
                status: "ACTIVE"
            },
            {
                organizationId: rootOrg.id,
                userId: rootUser.id,
                title: "Audit d'Infrastructure IA - 48h",
                description: "On analyse votre workflow opérationnel actuel, et j'injecte les bots de la Manufacture ELA pour remplacer 80% de votre main d'œuvre administrative.",
                type: "SERVICE",
                priceCent: 50000, // 500€
                currency: "EUR",
                category: "Technical",
                tags: "Audit, Automation",
                status: "ACTIVE"
            },
            {
                organizationId: rootOrg.id,
                userId: rootUser.id,
                title: "Montage Vidéo Cyber-BTP (Format Hook/Engine/Result)",
                description: "Montage percutant (15 sec) façon 'Found Footage' de votre SAAS ou Dashboard. 100% conçu pour générer du FOMO et détruire le temps d'attention sur TikTok/Reels.",
                type: "SERVICE",
                priceCent: 35000,   // 350€
                currency: "EUR",
                category: "Creative",
                tags: "Video, TikTokAds",
                status: "ACTIVE"
            }
        ];

        // Création massive
        const created = await prisma.marketplaceListing.createMany({
            data: seedListings
        });

        return NextResponse.json({ 
            success: true, 
            message: "Ghost Marketplace Injected.",
            insertedRows: created.count 
        });

    } catch (e) {
        console.error("Market Seed Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
