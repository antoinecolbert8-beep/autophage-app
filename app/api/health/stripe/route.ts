/**
 * URL: /api/health/stripe
 * Stripe Connection & Webhook Health Check
 * Permet au fondateur de vérifier instantanément si le tuyau financier est bouché ou actif.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        // Protection du endpoint
        if (process.env.ADMIN_LOCKDOWN_KEY && authHeader !== `Bearer ${process.env.ADMIN_LOCKDOWN_KEY}`) {
            // return NextResponse.json({ error: 'Accès Refusé' }, { status: 403 });
        }

        const stripeKey = process.env.STRIPE_SECRET_KEY || '';
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

        // 1. Check Live vs Test Mode
        const isLiveMode = stripeKey.startsWith('sk_live_');
        const isTestMode = stripeKey.startsWith('sk_test_');

        // 2. Webhook Configuration Check
        const hasWebhook = webhookSecret.length > 10;

        let status = 'UNKNOWN';
        let cashReady = false;

        if (isLiveMode && hasWebhook) {
            status = 'LIVE_AND_READY';
            cashReady = true;
        } else if (isTestMode && hasWebhook) {
            status = 'TEST_MODE_ACTIVE';
        } else if (!hasWebhook) {
            status = 'MISSING_WEBHOOK_SECRET';
        } else {
            status = 'MISSING_STRIPE_KEY';
        }

        return NextResponse.json({
            system: "ELA_FINANCE_PIPELINE",
            status,
            cashReady,
            diagnostics: {
                stripeKeyProvided: stripeKey.length > 0,
                isLiveMode,
                webhookSecretProvided: hasWebhook,
                advice: cashReady
                    ? "L'infrastructure est armée. Le système peut encaisser."
                    : "L'infrastructure financière est en mode test ou incomplète. Vérifiez les variables d'environnement STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET."
            }
        });

    } catch (error) {
        console.error("Stripe Health Check Error:", error);
        return NextResponse.json({ error: "Diagnotische Failure." }, { status: 500 });
    }
}
