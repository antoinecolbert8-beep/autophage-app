require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
    console.log("🛠️ [FluxRéel] Génération d'un lien de paiement LIVE de 1.00€...");
    
    try {
        const product = await stripe.products.create({
            name: "Audit Flux Réel ELA (Souverain)",
            description: "Test de validation du système de trésorerie live (Sans Simulation)."
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 100, // 1.00€
            currency: 'eur',
        });

        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
        });

        console.log(`✅ LIEN GÉNÉRÉ: ${paymentLink.url}`);
        process.exit(0);
    } catch (e) {
        console.error("❌ ERREUR STRIPE:", e.message);
        process.exit(1);
    }
}

main();
