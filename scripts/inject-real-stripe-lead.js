const Stripe = require('stripe');
const { Resend } = require('resend');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const resend = new Resend(process.env.RESEND_API_KEY || '');
const prisma = new PrismaClient();

async function inject() {
    console.log("🚀 [INJECTION JS] Sending Real Stripe Link...");

    const testEmail = "onboarding@resend.dev"; 
    const org = await prisma.organization.findFirst({ where: { status: "active" } });
    
    if (!org) {
        console.error("❌ No active organization found.");
        return;
    }

    try {
        // 1. Create Checkout Session directly
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'ELA - Pack Entrepreneur (Accès Swarm + 5000 Crédits)',
                        description: 'Activation de votre infrastructure d\'IA autonome pour 30 jours.',
                    },
                    unit_amount: 49900,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
            metadata: {
                organizationId: org.id,
                plan_type: 'enterprise',
                credits: '5000'
            },
        });

        console.log(`🔗 Stripe Session Created: ${session.id}`);
        console.log(`🔗 Link: ${session.url}`);

        // 2. Send via Resend
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'ELA <onboarding@resend.dev>',
                to: [testEmail],
                subject: "URGENT: Activation ELA",
                html: `<p>Votre lien de paiement est prêt: <strong><a href="${session.url}">${session.url}</a></strong></p>`
            });
            console.log("✅ Email sent via Resend!");
        } else {
            console.warn("⚠️ No RESEND_API_KEY found.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

inject();
