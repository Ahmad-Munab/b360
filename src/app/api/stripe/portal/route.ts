import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBillingPortalSession } from "@/lib/stripe-server";
import { getOrCreateUserSubscription } from "@/lib/subscription";
import { STRIPE_CONFIG } from "@/lib/config/stripe";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription to find Stripe customer ID
    const userSubscription = await getOrCreateUserSubscription(session.user.id);

    if (!userSubscription?.stripeCustomerId) {
      console.log(`User ${session.user.id} attempted to access billing portal but has no Stripe customer ID. Subscription:`, {
        plan: userSubscription?.plan,
        status: userSubscription?.status,
        hasStripeCustomerId: !!userSubscription?.stripeCustomerId
      });
      return NextResponse.json(
        { error: "No paid subscription found" },
        { status: 404 }
      );
    }

    // Get the base URL for return URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      userSubscription.stripeCustomerId,
      `${baseUrl}${STRIPE_CONFIG.PORTAL_RETURN_URL}`
    );

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
