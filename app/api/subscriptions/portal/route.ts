import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortal } from "@/lib/stripe-pricing";
import { prisma } from "@/core/db";

/**
 * POST /api/subscriptions/portal
 * Créer une session Customer Portal Stripe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }
    
    // Récupérer le customer ID Stripe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      );
    }
    
    const session = await createCustomerPortal(
      user.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    );
    
    return NextResponse.json({
      url: session.url,
    });
    
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


