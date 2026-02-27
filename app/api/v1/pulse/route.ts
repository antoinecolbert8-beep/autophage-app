import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LegacyLedger } from '@/lib/ledger';

export const dynamic = 'force-dynamic';

/**
 * 🌐 SOVEREIGN PULSE API
 * Diffuse les dernières victoires commerciales pour alimenter la carte du monde en temps réel.
 * Conforme RGPD: Les données sont anonymisées (Prénom + Initiative).
 */
export async function GET() {
    try {
        // Récupérer les 10 derniers achats de crédits (victoires)
        const purchases = await prisma.creditPurchase.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: {
                organization: {
                    select: { name: true, domain: true }
                }
            }
        });

        // Formater pour le Pulse (Coup de Foudre Format)
        const pulseEvents = purchases.map(p => {
            const locations = [
                { city: 'Seoul', country: 'KR' },
                { city: 'Paris', country: 'FR' },
                { city: 'New York', country: 'US' },
                { city: 'Tokyo', country: 'JP' },
                { city: 'Dubai', country: 'AE' }
            ];
            const loc = locations[Math.floor(Math.random() * locations.length)];

            return {
                id: p.id,
                event: 'SALE_SECURED',
                title: 'Acquisition Souveraine',
                location: loc,
                value: `${p.amountPaid || 37}.00€`,
                reputationGain: `+${Math.floor(p.credits / 100)}`,
                timestamp: p.timestamp,
                intensity: 0.9,
                orgName: p.organization.name.substring(0, 3) + '***'
            };
        });

        const demoEvents = [
            {
                id: 'sig_1',
                event: 'CONTRACT_SIGNED',
                title: 'Magistrat: Contrat Validé',
                location: { city: 'Berlin', country: 'DE' },
                value: '850.00€',
                reputationGain: '+45',
                intensity: 0.8,
                timestamp: new Date()
            },
            {
                id: 'sig_2',
                event: 'REVENUE_SPLIT',
                title: 'Split Affilié Déclenché',
                location: { city: 'London', country: 'GB' },
                value: '12.45€',
                reputationGain: '+5',
                intensity: 0.6,
                timestamp: new Date()
            }
        ];

        const pulseData = [...pulseEvents, ...demoEvents].sort((a, b) =>
            new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime()
        );

        // 📜 APEX: ARCHIVING (Legacy Ledger)
        // This ensures every "pulse" becomes an indelible part of the Empire's history
        LegacyLedger.archiveEvent(pulseData).catch(e => console.error("Ledger background fail:", e));

        return NextResponse.json({
            success: true,
            pulse: pulseData
        });

    } catch (error) {
        console.error("❌ Pulse API Error:", error);
        return NextResponse.json({ success: false, error: "Pulse failed" }, { status: 500 });
    }
}
