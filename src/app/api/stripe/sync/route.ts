import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe-server";
import { upsertSubscription, getOrCreateUserSubscription } from "@/lib/subscription";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get current subscription
        const userSubscription = await getOrCreateUserSubscription(session.user.id);

        if (!userSubscription.stripeCustomerId || !userSubscription.stripeSubscriptionId) {
            return NextResponse.json({
                message: "No Stripe subscription to sync",
                subscription: userSubscription,
            });
        }

        // Fetch latest subscription data from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
            userSubscription.stripeSubscriptionId
        );

        console.log("Syncing subscription from Stripe:", {
            userId: session.user.id,
            subscriptionId: stripeSubscription.id,
            status: stripeSubscription.status,
        });

        // Update subscription in database
        const updatedSubscription = await upsertSubscription(
            session.user.id,
            stripeSubscription
        );

        return NextResponse.json({
            message: "Subscription synced successfully",
            subscription: updatedSubscription,
        });
    } catch (error) {
        console.error("Error syncing subscription:", error);
        return NextResponse.json(
            { error: "Failed to sync subscription" },
            { status: 500 }
        );
    }
}
