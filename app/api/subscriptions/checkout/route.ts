import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { createCheckoutSession, PLANS } from "@/lib/stripe-pricing";

/**
 * POST /api/subscriptions/checkout
 * Créer une session Stripe Checkout pour s'abonner
 * Requires authentication — userId and organizationId come from server session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, email: guestEmail } = body;

    // Auth check: prioritize session, fallback to guestEmail
    const session = await getServerSession(authOptions) as any;

    const userId = session?.user?.id;
    const userEmail = session?.user?.email || guestEmail;
    const organizationId = session?.user?.organizationId;

    if (!userEmail) {
      return NextResponse.json({ error: "Email requis pour le checkout invité." }, { status: 401 });
    }

    if (!planId) {
      return NextResponse.json(
        { error: "Missing required field: planId" },
        { status: 400 }
      );
    }

    if (!PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      userId,
      userEmail,
      organizationId,
      planId: planId as keyof typeof PLANS,
      successUrl: `${appUrl}/onboarding?welcome=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



