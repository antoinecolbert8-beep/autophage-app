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
    // Auth check: must be logged in
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    // Use server session for security, not client-provided values
    const userId = session.user.id;
    const userEmail = session.user.email;
    const organizationId = session.user.organizationId;

    if (!planId) {
      return NextResponse.json(
        { error: "Missing required field: planId" },
        { status: 400 }
      );
    }

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: "User session missing required fields. Please log in again." },
        { status: 400 }
      );
    }

    if (!PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}` },
        { status: 400 }
      );
    }

    const checkoutSession = await createCheckoutSession({
      userId,
      userEmail,
      organizationId,
      planId: planId as keyof typeof PLANS,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
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



