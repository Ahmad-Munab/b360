import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe-server";
import { upsertSubscription, getUserSubscription } from "@/lib/subscription";
import { db } from "@/lib/db";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("Syncing subscription for user:", userId);

    // Get current subscription from database
    const currentSubscription = await getUserSubscription(userId);
    console.log("Current subscription in DB:", currentSubscription);

    if (!currentSubscription?.stripeSubscriptionId) {
      console.log("No subscription record found, searching Stripe...");

      // First, try to find by customer ID if we have one
      if (currentSubscription?.stripeCustomerId) {
        console.log(
          "Looking for subscriptions by customer ID:",
          currentSubscription.stripeCustomerId
        );

        const stripeSubscriptions = await stripe.subscriptions.list({
          customer: currentSubscription.stripeCustomerId,
          status: "all",
          limit: 10,
        });

        console.log(
          "Found Stripe subscriptions:",
          stripeSubscriptions.data.length
        );

        if (stripeSubscriptions.data.length > 0) {
          // Get the most recent active subscription
          const activeSubscription =
            stripeSubscriptions.data.find((sub) => sub.status === "active") ||
            stripeSubscriptions.data[0];

          console.log(
            "Using subscription:",
            activeSubscription.id,
            "status:",
            activeSubscription.status
          );

          // Update the subscription in database
          const result = await upsertSubscription(userId, activeSubscription);
          console.log("Subscription synced:", result);

          return NextResponse.json({
            success: true,
            message: "Subscription synced successfully",
            subscription: result,
          });
        }
      }

      // If no customer ID or no subscriptions found, try to find by recent checkout sessions
      console.log("Searching for recent checkout sessions for user:", userId);

      const sessions = await stripe.checkout.sessions.list({
        limit: 20,
      });

      // Find sessions for this user
      const userSessions = sessions.data.filter(
        (session) => session.metadata?.userId === userId
      );
      console.log("Found user sessions:", userSessions.length);

      for (const session of userSessions) {
        if (session.subscription && session.mode === "subscription") {
          console.log("Found subscription from session:", session.subscription);

          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          console.log(
            "Retrieved subscription:",
            stripeSubscription.id,
            "status:",
            stripeSubscription.status
          );

          // Update the subscription in database
          const result = await upsertSubscription(userId, stripeSubscription);
          console.log("Subscription synced from session:", result);

          return NextResponse.json({
            success: true,
            message: "Subscription found and synced successfully",
            subscription: result,
          });
        }
      }

      return NextResponse.json({
        success: false,
        message: "No Stripe subscription found for this user",
      });
    }

    // Refresh existing subscription from Stripe
    console.log(
      "Refreshing subscription:",
      currentSubscription.stripeSubscriptionId
    );
    const stripeSubscription = await stripe.subscriptions.retrieve(
      currentSubscription.stripeSubscriptionId
    );

    console.log("Retrieved subscription from Stripe:", {
      id: stripeSubscription.id,
      status: stripeSubscription.status,
      customer: stripeSubscription.customer,
    });

    // Update in database
    const result = await upsertSubscription(userId, stripeSubscription);
    console.log("Subscription updated:", result);

    return NextResponse.json({
      success: true,
      message: "Subscription refreshed successfully",
      subscription: result,
    });
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return NextResponse.json(
      { error: "Failed to sync subscription", details: error },
      { status: 500 }
    );
  }
}
