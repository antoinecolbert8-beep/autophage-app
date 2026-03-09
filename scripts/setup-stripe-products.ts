import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is missing in .env");
    process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
});

const PLANS = [
    { key: 'STARTER', name: 'ELA Starter', price: 37, credits: 1000 },
    { key: 'PRO', name: 'ELA Pro', price: 197, credits: 5000 },
    { key: 'SUPREME', name: 'ELA Supreme', price: 497, credits: 15000 },
    { key: 'EMPIRE', name: 'ELA Empire', price: 1497, credits: 50000 },
];

async function setupStripe() {
    console.log("🚀 Lancement de la configuration automatisée Stripe (Live)...");

    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    const results = {};

    for (const plan of PLANS) {
        try {
            console.log(`Création du produit: ${plan.name}...`);

            const product = await stripe.products.create({
                name: plan.name,
                description: `Accès au système ELA - ${plan.credits} crédits/mois`,
            });

            console.log(`Création du prix pour ${plan.name} (${plan.price}€/mois)...`);

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: plan.price * 100, // en centimes
                currency: 'eur',
                recurring: {
                    interval: 'month',
                },
            });

            console.log(`✅ ${plan.name} configuré: ID Prix = ${price.id}`);
            results[`STRIPE_PRICE_${plan.key}_LIVE`] = price.id;

        } catch (err: any) {
            console.error(`❌ Erreur pour ${plan.name}:`, err.message);
        }
    }

    console.log("\nMise à jour du fichier .env en local...");

    for (const [key, value] of Object.entries(results)) {
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
            envContent += `\n${key}=${value}`;
        }
    }

    // Also try to setup a webhook secret if not provided
    try {
        console.log("Tentative de création d'un webhook endpoint factice pour obtenir un secret local...");
        const webhook = await stripe.webhookEndpoints.create({
            url: 'https://ela-revolution.com/api/webhooks/stripe',
            enabled_events: [
                'checkout.session.completed',
                'invoice.paid',
                'invoice.payment_failed',
                'customer.subscription.updated',
                'customer.subscription.deleted'
            ],
        });

        console.log(`✅ Webhook créé avec succès: ID Secret = ${webhook.secret}`);

        const key = "STRIPE_WEBHOOK_SECRET";
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}=${webhook.secret}`);
        } else {
            envContent += `\n${key}=${webhook.secret}`;
        }
    } catch (e: any) {
        console.log("⚠️ Impossible de créer automatiquement le webhook, vérifier le dashboard (" + e.message + ")");
    }

    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ TERMINÉ ! Tous les IDs produits Stripe ont été créés et injectés dans votre .env");
    console.log("Voici les clés prêtes pour Netlify :");
    for (const [k, v] of Object.entries(results)) {
        console.log(`${k}=${v}`);
    }
}

setupStripe();
