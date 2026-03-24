import { NextResponse } from 'next/server';
import { prisma } from '@/core/db';
import { releaseAutonomousPayout } from '@/lib/billing/escrow-manager';

/**
 * 🤖 CRON FREELANCE SOUVERAIN
 * Déclenchement automatique des payouts pour les missions IA complétées.
 * Fréquence recommandée : Toutes les 10 minutes.
 */
export async function GET(req: Request) {
  console.log("⏰ [Cron Freelance] Vérification des missions en attente de paiement...");

  // Protection par secret (Vercel Cron)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Scanner les missions IA terminées (AIActionLog)
    const missions = await prisma.aIActionLog.findMany({
      where: { 
        status: 'completed',
        actionType: { not: 'PAYOUT_SYSTEM_LOG' } // Exclure les logs de paiement eux-mêmes
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    const results = [];

    for (const mission of missions) {
      // 2. Vérifier si un paiement a déjà été loggué pour cette mission dans le Ledger
      const alreadyPaid = await prisma.treasuryLedger.findFirst({
        where: { 
          referenceId: mission.id, 
          type: 'PAYOUT' 
        }
      });

      if (!alreadyPaid) {
        console.log(`🤑 [Cron Freelance] Initialisation du payout pour mission : ${mission.id} (${mission.actionType})`);
        
        // 3. Libérer le paiement (Stripe Connect + Ledger Update)
        const payout = await releaseAutonomousPayout(mission.id, mission.actionType);
        
        results.push({
          missionId: mission.id,
          success: payout.success,
          amount: payout.success ? payout.amount : 0,
          error: payout.error || null
        });

        if (payout.success) {
          console.log(`✅ [Cron Freelance] Payout exécuté avec succès pour ${mission.id}`);
        } else {
          console.error(`⚠️ [Cron Freelance] Échec payout pour ${mission.id} : ${payout.error}`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: results.length,
      details: results 
    });

  } catch (error: any) {
    console.error("❌ [Cron Freelance] Erreur critique :", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
