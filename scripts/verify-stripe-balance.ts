require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkBalance() {
    console.log("📡 [Souverain] Interrogation du Solde Stripe LIVE...");
    try {
        const balance = await stripe.balance.retrieve();
        console.log("💰 SOLDE RÉEL STRIPE :");
        balance.available.forEach(b => {
            console.log(`   - ${b.amount / 100} ${b.currency.toUpperCase()} (Disponible)`);
        });
        balance.pending.forEach(b => {
            console.log(`   - ${b.amount / 100} ${b.currency.toUpperCase()} (En attente)`);
        });
        
        process.exit(0);
    } catch (e) {
        console.error("❌ ERREUR STRIPE:", e.message);
        process.exit(1);
    }
}

checkBalance();
