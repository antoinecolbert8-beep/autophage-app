/**
 * API Route: GET /api/sales/subscription-plans
 * Liste des plans d'abonnement disponibles
 */

import { NextRequest, NextResponse } from "next/server";
import { SUBSCRIPTION_PLANS } from "@/lib/sales-automation";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    plans: Object.values(SUBSCRIPTION_PLANS),
    currency: "EUR",
    billingCycle: ["MONTHLY", "YEARLY"],
    guaranteeInfo: "Satisfait ou remboursé 14 jours",
  });
}





