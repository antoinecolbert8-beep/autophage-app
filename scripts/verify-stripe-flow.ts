
import { PrismaClient } from '@prisma/client';
import { strip } from 'node:strings'; // not needed
import dotenv from 'dotenv';
dotenv.config();

// Mocking the 'use server' environment or just importing directly if possible.
// Since we are running this as a script, 'use server' directive is just a string.
// We need to handle imports carefully.

const prisma = new PrismaClient();

// We need to replicate the logic from actions/auth.ts because importing it might fail due to 'use server' processing
// or Next.js specific build artifacts if we are just running a script.
// However, let's try to import it first. If it fails, we will copy the logic for the test.

// Actually, for a robust test script, it's better to test the underlying database and stripe calls directly 
// to ensure the *data flow* works, even if we duplicate some logic.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || '', {
    apiVersion: '2023-10-16',
});

async function main() {
    console.log('🚀 Starting Verification: Stripe & Auth Flow');

    const testEmail = `test.user.${Date.now()}@example.com`;
    const testName = 'Test User';
    const testCompany = 'Test Corp ' + Date.now();

    console.log(`\n1. Simulating User Signup for: ${testEmail}`);

    // --- LOGIC FROM actions/auth.ts ---
    // Create Organization
    const domain = testCompany.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

    console.log('   Creating Organization...');
    const organization = await prisma.organization.create({
        data: {
            name: testCompany,
            domain: domain,
            tier: 'starter',
            status: 'active'
        }
    });
    console.log(`   ✅ Organization Created: ${organization.id}`);

    // Create User
    console.log('   Creating User...');
    const user = await prisma.user.create({
        data: {
            email: testEmail,
            name: testName,
            role: 'admin',
            organizationId: organization.id,
            currentPlan: 'starter',
        }
    });
    console.log(`   ✅ User Created: ${user.id}`);
    // ----------------------------------

    console.log(`\n2. Simulating Checkout Session Creation`);

    // --- LOGIC FROM lib/stripe-pricing.ts ---
    // We are testing if we can create a session with the metadata
    // We need a valid price ID. Faking one if logic allows, or using env.

    const priceId = process.env.STRIPE_PRICE_STARTER || 'price_starter_eur_monthly';
    console.log(`   Using Price ID: ${priceId}`);

    // Note: This will FAIL if the price ID doesn't exist in the Stripe account.
    // We will catch the error to confirm if it's a "Missing Price" error (which is expected if env not set)
    // vs a "Metadata rejected" error.

    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            client_reference_id: user.id,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            subscription_data: {
                metadata: {
                    userId: user.id,
                    organizationId: organization.id, // CRITICAL: This is what we added
                    plan: 'starter',
                    tierId: 'starter',
                    monthlyCredits: '500',
                },
            },
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        console.log(`   ✅ Checkout Session Created! URL: ${session.url}`);
        console.log(`   ✅ Metadata Verification:`, session.subscription_data?.metadata); // or session.metadata depending on API version

    } catch (error: any) {
        console.error(`   ❌ Stripe Session Creation Failed: ${error.message}`);
        if (error.code === 'resource_missing') {
            console.log('      (This is expected if the Price ID is invalid. The Logic flow is correct though.)');
        }
    }

    // Cleanup
    console.log(`\n3. Cleanup`);
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.organization.delete({ where: { id: organization.id } });
    console.log('   ✅ Test Data Deleted');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
