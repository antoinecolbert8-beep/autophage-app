import Stripe from "stripe";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
});

async function verifyMonetization() {
    console.log("🔍 DIAGNOSTIC MONÉTISATION ELA\n");

    // 1. Check Secret Key
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("❌ ERREUR : STRIPE_SECRET_KEY manquante dans .env");
    } else {
        try {
            const account = await stripe.accounts.retrieve();
            const isLive = account.details_submitted && !process.env.STRIPE_SECRET_KEY.startsWith("sk_test");
            console.log(`✅ Stripe Connection: OK (${isLive ? "LIVE" : "TEST MODE"})`);
        } catch (e) {
            console.error("❌ ERREUR : Connexion Stripe échouée. Vérifiez votre STRIPE_SECRET_KEY.");
        }
    }

    // 2. Check Webhook Secret
    if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET === "whsec_...") {
        console.warn("⚠️  WARNING : STRIPE_WEBHOOK_SECRET est un placeholder ou vide. Les paiements ne seront pas validés automatiquement.");
    } else {
        console.log("✅ Webhook Secret: Présent");
    }

    // 3. Check Flash Sale Link
    if (!process.env.FLASH_SALE_PAYMENT_LINK || process.env.FLASH_SALE_PAYMENT_LINK.includes("test_flashsale")) {
        console.warn("⚠️  WARNING : FLASH_SALE_PAYMENT_LINK est un lien de test ou vide.");
    } else {
        console.log("✅ Flash Sale Link: Configuré");
    }

    console.log("\n🚀 Diagnostic terminé.");
}

verifyMonetization().catch(console.error);
