const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// On utilise directement la clé du .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
    console.log("💰 [FluxRéel] Lancement du Payout de 5.00€ (SANS SIMULATION)...");
    
    // 1. Chercher une action à payer
    const action = await prisma.aIActionLog.findFirst({
        where: { actionType: 'TEST_LIVE_FLUX', status: 'completed' },
        orderBy: { createdAt: 'desc' }
    });

    if (!action) {
        // Fallback si le test-api-log a été raté, on crée un ID fictif métier
        console.warn("⚠️ Aucune action TEST_LIVE_FLUX trouvée. Utilisation d'un ID de mission généré.");
    }

    const missionId = action ? action.id : `mission_live_${Date.now()}`;

    // 2. Chercher le destinataire (Admin linké au Stripe Live)
    const recipient = await prisma.user.findFirst({ 
        where: { role: 'admin', stripeAccountId: { startsWith: 'acct_' } } 
    });

    if (!recipient || !recipient.stripeAccountId) {
        console.error("❌ ERREUR: Aucun administrateur configuré avec un Stripe Account ID (acct_...).");
        process.exit(1);
    }

    console.log(`📡 [FluxRéel] Destinataire: ${recipient.email}`);
    console.log(`📡 [FluxRéel] Target Connect Account: ${recipient.stripeAccountId}`);

    try {
        // 3. TRANSFERT RÉEL STRIPE
        const transfer = await stripe.transfers.create({
            amount: 500, // 5.00 € (Montant test minimal mais réel)
            currency: 'eur',
            destination: recipient.stripeAccountId,
            description: `ROI ELA Freelance Live: Test Flux Réel ${missionId}`,
            metadata: { missionId: missionId, mode: 'SOUVERAIN_LIVE' }
        });

        console.log(`✅ SUCCÈS STRIPE: Transfert ID: ${transfer.id}`);

        // 4. Log dans le Ledger pour confirmation visuelle
        await prisma.treasuryLedger.create({
            data: {
                amount_cents: -500,
                type: 'PAYOUT',
                referenceId: transfer.id,
                resulting_balance: 0, 
                description: `💰 Flux Réel Stripe (Connect Transfer): ${transfer.id}`
            }
        });

        console.log("🏦 [FluxRéel] Ledger mis à jour. Argent réel en mouvement.");
        process.exit(0);

    } catch (e) {
        console.error("❌ ÉCHEC CRITIQUE DU TRANSFERT STRIPE:", e.message);
        if (e.message.includes("No such destination")) {
            console.error("👉 Le compte Connect 'acct_1SfgXjHRxqwyqckG' n'est peut-être pas encore validé ou n'existe pas dans cet environnement Stripe.");
        }
        process.exit(1);
    }
}

main();
