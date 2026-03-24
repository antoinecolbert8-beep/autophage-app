import { NextResponse } from 'next/server';
import { prisma } from '@/core/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Fetch WarChest Balance (Dynamic System Reserve)
        const warChest = await prisma.warChest.findFirst();
        const warChestBalance = warChest ? (warChest.available_budget_cents + warChest.reserved_cents) / 100 : 0;

        // 2. Fetch Session Revenue (Only from TODAY)
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

        // 3. Fetch Real Stripe Balance (Direct API)
        let stripeBalance = 0;
        try {
            const balance = await stripe.balance.retrieve();
            // Sum available funds in EUR
            stripeBalance = balance.available.reduce((acc, b) => b.currency === 'eur' ? acc + b.amount : acc, 0) / 100;
        } catch (err) {
            console.error('Stripe balance fetch failed:', err);
        }

        // 4. Fetch Active Missions (Quests)
        const activeMissionsCount = await prisma.userQuest.count({
            where: { status: 'PENDING' }
        });

        // 5. Fetch Live Logs (Recent AI Action Logs)
        const liveLogs = await prisma.aIActionLog.findMany({
            take: 15,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                actionType: true,
                status: true,
                decisionReasoning: true,
                createdAt: true
            }
        });

        const formattedLogs = liveLogs.map(log => ({
            id: log.id,
            type: log.actionType,
            msg: log.decisionReasoning || `Action ${log.actionType} status: ${log.status}`,
            time: log.createdAt.toLocaleTimeString()
        }));

        return NextResponse.json({
            success: true,
            stats: {
                revenue: sessionRevenue,
                warChest: warChestBalance,
                stripeBalance: stripeBalance,
                activeMissions: activeMissionsCount,
                logs: formattedLogs
            }
        });

    } catch (error: any) {
        console.error('WarRoom Stats API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
