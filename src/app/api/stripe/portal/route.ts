import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBillingPortalSession } from "@/lib/stripe-server";
import { getUserSubscription } from "@/lib/subscription";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription to find Stripe customer ID
    const userSubscription = await getUserSubscription(session.user.id);

    if (!userSubscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Get the base URL for return URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      userSubscription.stripeCustomerId,
      `${baseUrl}/dashboard/settings`
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
