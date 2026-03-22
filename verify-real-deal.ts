import { sendRealEmail } from './lib/services/resend';

async function test() {
    console.log("🚀 Testing REAL Resend Email...");
    const result = await sendRealEmail(
        "lebor@autophage.app", // User's assumed email from dir
        "ELA PROD Activation Success",
        "<h1>Le système est RÉEL</h1><p>Ce message confirme que l'API Resend est active et connectée à votre engine de vente.</p>"
    );
    console.log(result ? "✅ TEST SUCCESS" : "❌ TEST FAILED");
}

test();
