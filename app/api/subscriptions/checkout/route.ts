import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PLANS } from "@/lib/stripe-pricing";

/**
 * POST /api/subscriptions/checkout
 * Créer une session Stripe Checkout pour s'abonner
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail } = body;
    
    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields: planId, userId, userEmail" },
        { status: 400 }
      );
    }
    
    if (!PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}` },
        { status: 400 }
      );
    }
    
    const session = await createCheckoutSession({
      userId,
      userEmail,
      planId: planId as keyof typeof PLANS,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });
    
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
    
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


