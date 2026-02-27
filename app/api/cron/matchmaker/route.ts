/**
 * URL: /api/cron/matchmaker
 * Déclenché par Vercel Cron.
 * Le 'Proactive Matchmaker' exécute un batch job pour envoyer les suggestions aux Orgas Actives.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { proactiveMatchmaker } from "@/lib/ai/discovery";
import { triggerProactiveUpsell } from "@/lib/ai/upsell-engine";

const getActiveOrganizations = async () => {
    return await prisma.organization.findMany({
        where: { status: 'active' },
        include: {
            users: {
                include: {
                    contractsBought: { where: { status: 'COMPLETED' } }
                }
            }
        }
    });
};

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orgs = await getActiveOrganizations();
        let matchesSent = 0;

        for (const org of orgs) {
            console.log(`🕵️ Running Proactive Matchmaker for Org: ${org.id}`);

            // LTV Optimization: The Upsell Trigger
            const totalContracts = org.users.reduce((acc, user) => acc + user.contractsBought.length, 0);
            const isCreditsSaturated = org.creditBalance < 20; // Ex: less than 20% left

            if (totalContracts >= 10 || isCreditsSaturated) {
                console.log(`🚀 LTV Upsell Triggered for Org: ${org.id}`);
                const revenueGenerated = org.users.reduce((acc, user) => acc + (user.contractsBought.reduce((s, c) => s + c.totalAmount, 0)), 0);

                await triggerProactiveUpsell(org.id, {
                    creditUsage: isCreditsSaturated ? 0.9 : 0.5,
                    contractCount: totalContracts,
                    revenueGenerated
                });
            }

            // Generate the proactive matchmaking suggestion
            const matches = await proactiveMatchmaker(org.id);

            if (matches.length > 0) {
                // 🚨 Notification au "Patient Zéro"
                const message = matches[0];
                console.log(`📩 Matchmaker Alert Sent to ${org.id}:`);
                console.log(message);

                // TODO: Integrer avec le système de notification (Email/In-App Push)

                matchesSent++;
            }
        }

        return NextResponse.json({ success: true, messagesDispatched: matchesSent });

    } catch (e) {
        console.error("Proactive Matchmaker API Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
