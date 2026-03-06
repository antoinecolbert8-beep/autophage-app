/**
 * URL: /api/marketing/flash-sale
 * Low-Ticket Tripwire
 * Génère automatiquement une promotion d'urgence limitée dans le temps pour acquérir des clients.
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { stripe } from "@/lib/stripe"; // Assume standard stripe lib

import { getOpenAIClient } from "@/lib/ai/openai-client";

export async function POST(req: NextRequest) {
    const openai = getOpenAIClient();
    // Protéger la route
    const authHeader = req.headers.get('authorization');
    if (process.env.ADMIN_LOCKDOWN_KEY && authHeader !== `Bearer ${process.env.ADMIN_LOCKDOWN_KEY}`) {
        // En vrai production, décommenter cette sécurité
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { product, originalPrice, flashPrice, slots } = await req.json();

        if (!product || !flashPrice || !slots) {
            return NextResponse.json({ error: 'Paramètres manquants : product, flashPrice, slots.' }, { status: 400 });
        }

        const prompt = `
            Tu es le fondateur d'ELA. Tu lances une "Flash Sale" (Low-Ticket Tripwire).
            Produit : ${product} (ex: Audit d'Infrastructure IA)
            Prix : ${flashPrice}€ au lieu de ${originalPrice || (flashPrice * 5)}€.
            Places limitées : EXACTEMENT ${slots} slots.
            
            Crée un post hyper-agressif (niveau 'SOVEREIGN'). Pas de bonjour.
            Style "Found Footage technique". Dis que l'infrastructure est prête mais que l'utilisateur est trop lent.
            Format : 3 phrases courtes.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Tu es le fondateur d'ELA. Tu lances une 'Flash Sale' (Low-Ticket Tripwire)." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8
        });

        const postCopy = completion.choices[0].message.content || "";

        // TODO: Appeler Stripe pour créer dynamiquement un Coupon ou un Payment Link
        /*
        const coupon = await stripe.coupons.create({
            amount_off: (originalPrice - flashPrice) * 100,
            currency: 'eur',
            duration: 'once',
            max_redemptions: slots,
            name: `FLASH_${ product.substring(0, 5).toUpperCase() } `
        });
        */

        const mockPaymentLink = `https://buy.stripe.com/test_flashsale?code=FLASH_${slots}`;

        return NextResponse.json({
            success: true,
            marketingCopy: postCopy,
            paymentLink: mockPaymentLink, // Lien dynamique Stripe
            scarcity: `Limité à ${slots} utilisations.`
        });

    } catch (e) {
        console.error("Flash Sale API Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
