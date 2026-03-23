import { createEnterpriseCheckoutLink } from "../lib/services/stripe-links";
import { sendRealEmail } from "../lib/services/resend";
import { prisma } from "../core/db";

async function inject() {
    console.log("🚀 [INJECTION] Sending Real Stripe Link to a test lead...");

    const testEmail = "onboarding@resend.dev"; // Or any verified email
    const org = await prisma.organization.findFirst({ where: { status: "active" } });
    
    if (!org) {
        console.error("❌ No active organization found.");
        return;
    }

    // 1. Create a dummy lead for tracking
    const lead = await prisma.lead.upsert({
        where: { email_organizationId: { email: testEmail, organizationId: org.id } },
        update: { stage: 'warm' },
        create: {
            email: testEmail,
            name: "Test Prospect",
            organizationId: org.id,
            stage: 'warm',
            metadata: JSON.stringify({ source: "INJECTION" })
        }
    });

    // 2. Generate Stripe Link
    const stripeLink = await createEnterpriseCheckoutLink(lead.id, org.id);
    
    if (!stripeLink) {
        console.error("❌ Failed to generate Stripe link.");
        return;
    }

    console.log(`🔗 Stripe Link Generated: ${stripeLink}`);

    // 3. Send Email
    const success = await sendRealEmail(
        testEmail,
        "Activation de votre IA Autonome ELA",
        `Bonjour, votre infrastructure ELA est prête. Activez votre pack ici pour commencer la génération de revenus: ${stripeLink}`
    );

    if (success) {
        console.log("✅ [SUCCESS] Real Stripe link sent via Resend!");
    } else {
        console.warn("⚠️ [SIMULATION] Resend API not configured or failed. Logged link above.");
    }
}

inject().catch(console.error);
