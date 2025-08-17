import { db } from "./db";
import { subscription, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe, createStripeCustomer } from "./stripe-server";
import type Stripe from "stripe";

export interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Get user's subscription
export async function getUserSubscription(
  userId: string
): Promise<SubscriptionData | null> {
  const [userSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  return userSubscription || null;
}

// Create default free subscription for new users
export async function createFreeSubscription(userId: string): Promise<SubscriptionData> {
  const subscriptionData = {
    userId,
    plan: "free",
    status: "active",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [newSubscription] = await db
    .insert(subscription)
    .values(subscriptionData)
    .returning();

  return newSubscription;
}

// Get or create user subscription (ensures every user has a subscription)
export async function getOrCreateUserSubscription(
  userId: string
): Promise<SubscriptionData> {
  let userSubscription = await getUserSubscription(userId);
  
  if (!userSubscription) {
    userSubscription = await createFreeSubscription(userId);
  }
  
  return userSubscription;
}

// Create or update subscription from Stripe webhook
export async function upsertSubscription(
  userId: string,
  stripeSubscription: Stripe.Subscription
): Promise<SubscriptionData> {
  const subscriptionData = {
    userId,
    plan: "pro",
    status: stripeSubscription.status,
    stripeCustomerId: stripeSubscription.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: stripeSubscription.items.data[0]?.price.id || null,
    currentPeriodStart: new Date(
      (stripeSubscription as any).current_period_start * 1000
    ),
    currentPeriodEnd: new Date(
      (stripeSubscription as any).current_period_end * 1000
    ),
    cancelAtPeriodEnd:
      (stripeSubscription as any).cancel_at_period_end || false,
    updatedAt: new Date(),
  };

  // Check if subscription already exists
  const existingSubscription = await getUserSubscription(userId);

  if (existingSubscription) {
    // Update existing subscription
    const [updatedSubscription] = await db
      .update(subscription)
      .set(subscriptionData)
      .where(eq(subscription.userId, userId))
      .returning();

    return updatedSubscription;
  } else {
    // Create new subscription
    const [newSubscription] = await db
      .insert(subscription)
      .values({
        ...subscriptionData,
        createdAt: new Date(),
      })
      .returning();

    return newSubscription;
  }
}

// Cancel subscription
export async function cancelUserSubscription(
  userId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<SubscriptionData | null> {
  const userSubscription = await getUserSubscription(userId);

  if (!userSubscription?.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  // Cancel in Stripe
  await stripe.subscriptions.update(userSubscription.stripeSubscriptionId, {
    cancel_at_period_end: cancelAtPeriodEnd,
  });

  // Update in database
  const [updatedSubscription] = await db
    .update(subscription)
    .set({
      cancelAtPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, userId))
    .returning();

  return updatedSubscription;
}

// Reactivate subscription
export async function reactivateUserSubscription(
  userId: string
): Promise<SubscriptionData | null> {
  const userSubscription = await getUserSubscription(userId);

  if (!userSubscription?.stripeSubscriptionId) {
    throw new Error("No subscription found");
  }

  // Reactivate in Stripe
  await stripe.subscriptions.update(userSubscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  // Update in database
  const [updatedSubscription] = await db
    .update(subscription)
    .set({
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, userId))
    .returning();

  return updatedSubscription;
}

// Get or create Stripe customer for user
export async function getOrCreateStripeCustomer(
  userId: string
): Promise<string> {
  // Get user data
  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) {
    throw new Error("User not found");
  }

  // Check if user already has a subscription with Stripe customer ID
  const userSubscription = await getUserSubscription(userId);

  if (userSubscription?.stripeCustomerId) {
    return userSubscription.stripeCustomerId;
  }

  // Create new Stripe customer
  const stripeCustomer = await createStripeCustomer(
    userData.email!,
    userData.name || undefined
  );

  return stripeCustomer.id;
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const userSubscription = await getUserSubscription(userId);

  if (!userSubscription) {
    return false;
  }

  // Check if subscription is active and not expired
  const now = new Date();
  const isActive = userSubscription.status === "active";
  const notExpired = userSubscription.currentPeriodEnd > now;
  const notCanceled =
    !userSubscription.cancelAtPeriodEnd ||
    userSubscription.currentPeriodEnd > now;

  return isActive && notExpired && notCanceled;
}

// Get subscription status for display
export function getSubscriptionStatus(
  subscriptionData: SubscriptionData | null
): {
  status: "free" | "active" | "canceled" | "past_due" | "unpaid";
  label: string;
  description: string;
} {
  if (!subscriptionData) {
    return {
      status: "free",
      label: "Free Plan",
      description: "You are currently on the free plan.",
    };
  }

  if (subscriptionData.status === "active") {
    if (subscriptionData.cancelAtPeriodEnd) {
      return {
        status: "canceled",
        label: "Canceled",
        description: `Your subscription will end on ${subscriptionData.currentPeriodEnd.toLocaleDateString()}.`,
      };
    }
    return {
      status: "active",
      label: "Pro Plan",
      description: `Your subscription renews on ${subscriptionData.currentPeriodEnd.toLocaleDateString()}.`,
    };
  }

  if (subscriptionData.status === "past_due") {
    return {
      status: "past_due",
      label: "Past Due",
      description:
        "Your payment is past due. Please update your payment method.",
    };
  }

  if (subscriptionData.status === "unpaid") {
    return {
      status: "unpaid",
      label: "Unpaid",
      description:
        "Your subscription is unpaid. Please update your payment method.",
    };
  }

  return {
    status: "free",
    label: "Free Plan",
    description: "You are currently on the free plan.",
  };
}
