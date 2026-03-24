const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');
const dotenv = require('dotenv');
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET);

async function testAPI() {
    const prisma = new PrismaClient();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const warChest = await prisma.warChest.findFirst();
        const warChestBalance = warChest ? (warChest.available_budget_cents + warChest.reserved_cents) / 100 : 0;

        const ledgerInflows = await prisma.treasuryLedger.aggregate({
            _sum: { amount_cents: true },
            where: {
                type: { in: ['REVENUE', 'REVENUE_IN', 'INFLOW', 'INJECTION', 'MANUAL_INJECTION'] },
                createdAt: { gte: today }
            }
        });
        
        const marketplaceTotal = await prisma.marketplaceTransaction.aggregate({
            _sum: { amountCent: true },
            where: {
                status: 'COMPLETED',
                updatedAt: { gte: today }
            }
        });

        const sessionRevenue = ((ledgerInflows._sum.amount_cents || 0) + (marketplaceTotal._sum.amountCent || 0)) / 100;

        let stripeBalance = 0;
        try {
            const balance = await stripe.balance.retrieve();
            stripeBalance = balance.available.reduce((acc, b) => b.currency === 'eur' ? acc + b.amount : acc, 0) / 100;
        } catch (err) {
            console.error('Stripe error:', err.message);
        }

        console.log('--- LIVE API LOGIC VERIFICATION ---');
        console.log('Session Revenue (Today):', sessionRevenue, '€');
        console.log('Stripe Balance (Live):', stripeBalance, '€');
        console.log('WarChest (System):', warChestBalance, '€');
        
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

testAPI();
