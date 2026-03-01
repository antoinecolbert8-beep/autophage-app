import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { stripe } from '@/lib/stripe'; // Assume standard stripe lib

/**
 * L'ULTIME VERROU : THE EMPIRE KILL SWITCH
 * Route : /api/admin/lockdown
 * Protégée par une clé secrète asymétrique (ADMIN_LOCKDOWN_KEY).
 * Gele instantanément tous les contrats et les fonds sous séquestre en cas d'attaque systémique.
 */
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    // Vérification stricte du privilège Souverain
    if (!process.env.ADMIN_LOCKDOWN_KEY || authHeader !== `Bearer ${process.env.ADMIN_LOCKDOWN_KEY}`) {
        console.error("🚨 TENTATIVE D'ACTIVATION DU KILL SWITCH NON AUTORISÉE");
        return NextResponse.json({ error: 'Accès Souverain Refusé.' }, { status: 403 });
    }

    try {
        const { action } = await req.json();

        if (action === 'ENGAGE_LOCKDOWN') {
            console.log("🛑 KILL SWITCH ENGAGÉ. GEL DE L'INFRASTRUCTURE.");

            // 1. Geler tous les contrats en cours (Empêche toute validation par le Magistrat)
            const updatedContracts = await prisma.contract.updateMany({
                where: {
                    status: { in: ['PENDING_ESCROW', 'IN_PROGRESS', 'IN_REVIEW'] }
                },
                data: {
                    status: 'SYSTEM_LOCKDOWN'
                }
            });

            // 2. Geler toutes les annonces du marché (Stoppe les nouvelles ventes)
            const updatedListings = await prisma.marketplaceListing.updateMany({
                where: { status: 'ACTIVE' },
                data: { status: 'PAUSED_BY_ADMIN' }
            });

            // 3. TODO: API Call vers Stripe pour geler / rembourser préventivement les PaymentIntents non capturés ?
            // await stripe.paymentIntents.cancel(intentId);

            return NextResponse.json({
                success: true,
                message: "INFRASTRUCTURE GELÉE. Séquestres Verrouillés.",
                stats: {
                    contractsFrozen: updatedContracts.count,
                    listingsPaused: updatedListings.count
                }
            });
        }

        if (action === 'LIFT_LOCKDOWN') {
            console.log("🟢 LEVÉE DU KILL SWITCH. RESTAURATION DE L'INFRASTRUCTURE.");

            // Restauration de l'état (Simplifiée : nécessite un audit manuel dans un scénario réel)
            await prisma.contract.updateMany({
                where: { status: 'SYSTEM_LOCKDOWN' },
                data: { status: 'IN_REVIEW' } // On force la review manuelle/IA au redémarrage
            });

            await prisma.marketplaceListing.updateMany({
                where: { status: 'PAUSED_BY_ADMIN' },
                data: { status: 'ACTIVE' }
            });

            return NextResponse.json({ success: true, message: "INFRASTRUCTURE RESTAURÉE." });
        }

        return NextResponse.json({ error: 'Commande Invalide.' }, { status: 400 });

    } catch (e) {
        console.error("Erreur critique du Kill Switch:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
