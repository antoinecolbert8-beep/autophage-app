import { triggerEvidenceBroadcast } from '../lib/jobs/evidence-broadcaster';

async function simulate() {
    console.log('🧪 Simulation du FOMO Loop...');

    const mockPayments = [
        { plan: 'God Mode', amount: 997, customerEmail: 'investor@market-capture.com' },
        { plan: 'Evolution', amount: 297, customerEmail: 'growth-hacker@startup.io' },
        { plan: 'Souverain Credits', amount: 49, customerEmail: 'early-adopter@tech.fr' }
    ];

    for (const payment of mockPayments) {
        console.log(`📡 Simulation d'un paiement Stripe pour : ${payment.plan} (${payment.amount}€)`);
        await triggerEvidenceBroadcast(payment);
        // Attendre un peu entre chaque simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Simulation envoyée à la file BullMQ (evidence-broadcaster).');
    console.log('🛠️ Vérifiez vos logs BullMQ ou votre dashboard pour voir les posts générés par l\'IA.');
}

simulate().catch(console.error);
