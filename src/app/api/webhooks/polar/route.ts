import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscription, payment, subscriptionUsage, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { PRICING_PLANS } from "@/lib/polar";

// Polar webhook event types
interface PolarWebhookEvent {
  id: string;
  type: string;
  created_at: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      id: string;
      email: string;
      name?: string;
    };
    product: {
      id: string;
      name: string;
      type: string;
    };
    subscription?: {
      id: string;
      status: string;
      current_period_start: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
    };
    metadata?: Record<string, string>;
  };
}

// Webhook signature verification
function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Polar uses HMAC-SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    // Signature format: "sha256=<hash>"
    const receivedSignature = signature.replace("sha256=", "");

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(receivedSignature, "hex")
    );
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
}

// Get user by Polar customer ID or email
async function getUserByPolarCustomer(customerId: string, email: string) {
  // First try to find by Polar customer ID in metadata
  let foundUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  return foundUser;
}

// Handle subscription creation/update
async function handleSubscriptionEvent(event: PolarWebhookEvent) {
  const { customer, subscription: polarSub, product, metadata } = event.data;

  if (!polarSub) {
    throw new Error("Subscription data missing from event");
  }

  // Find user by email
  const foundUser = await getUserByPolarCustomer(customer.id, customer.email);
  if (!foundUser) {
    throw new Error(`User not found for email: ${customer.email}`);
  }

  // Determine plan based on product or metadata
  const planId =
    metadata?.planId ||
    (product.name.toLowerCase().includes("pro") ? "pro" : "free");
  const plan = planId === "pro" ? PRICING_PLANS.PRO : PRICING_PLANS.FREE;

  await db.transaction(async (tx) => {
    // Create or update subscription
    await tx
      .insert(subscription)
      .values({
        userId: foundUser.id,
        plan: plan.id,
        status: polarSub.status === "active" ? "active" : "inactive",
        currentPeriodStart: new Date(polarSub.current_period_start),
        currentPeriodEnd: new Date(polarSub.current_period_end),
        cancelAtPeriodEnd: polarSub.cancel_at_period_end,
      })
      .onConflictDoUpdate({
        target: subscription.userId,
        set: {
          plan: plan.id,
          status: polarSub.status === "active" ? "active" : "inactive",
          currentPeriodStart: new Date(polarSub.current_period_start),
          currentPeriodEnd: new Date(polarSub.current_period_end),
          cancelAtPeriodEnd: polarSub.cancel_at_period_end,
          updatedAt: new Date(),
        },
      });

    // Update or create usage record
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format

    await tx
      .insert(subscriptionUsage)
      .values({
        userId: foundUser.id,
        period: currentPeriod,
        messageCount: 0,
        widgetCount: 0,
      })
      .onConflictDoUpdate({
        target: [subscriptionUsage.userId, subscriptionUsage.period],
        set: {
          updatedAt: new Date(),
        },
      });
  });

  console.log(
    `Subscription ${polarSub.status} for user ${foundUser.email} (${plan.name} plan)`
  );
}

// Handle payment success
async function handlePaymentSuccess(event: PolarWebhookEvent) {
  const { customer, subscription: polarSub, product, metadata } = event.data;

  // Find user by email
  const foundUser = await getUserByPolarCustomer(customer.id, customer.email);
  if (!foundUser) {
    throw new Error(`User not found for email: ${customer.email}`);
  }

  await db.transaction(async (tx) => {
    // Check if payment already processed
    const existingPayment = await tx
      .select({ id: payment.id })
      .from(payment)
      .where(eq(payment.polarPaymentId, event.data.id))
      .limit(1);

    if (existingPayment.length > 0) {
      console.log(`Payment ${event.data.id} already processed`);
      return;
    }

    // Get subscription ID if this is a subscription payment
    let subscriptionId: string | null = null;
    if (polarSub) {
      const userSubscription = await tx
        .select({ id: subscription.id })
        .from(subscription)
        .where(eq(subscription.userId, foundUser.id))
        .limit(1);

      subscriptionId = userSubscription[0]?.id || null;
    }

    // Record the payment
    await tx.insert(payment).values({
      userId: foundUser.id,
      subscriptionId,
      amount: (event.data.amount / 100).toString(), // Convert cents to dollars
      currency: event.data.currency.toUpperCase(),
      status: event.data.status,
      polarPaymentId: event.data.id,
      metadata: {
        polarEventId: event.id,
        polarCustomerId: customer.id,
        productId: product.id,
        productName: product.name,
        ...metadata,
      },
    });
  });

  console.log(
    `Payment recorded: $${event.data.amount / 100} for user ${foundUser.email}`
  );
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(event: PolarWebhookEvent) {
  const { customer, subscription: polarSub } = event.data;

  if (!polarSub) {
    throw new Error("Subscription data missing from cancellation event");
  }

  // Find user by email
  const foundUser = await getUserByPolarCustomer(customer.id, customer.email);
  if (!foundUser) {
    throw new Error(`User not found for email: ${customer.email}`);
  }

  // Update subscription status
  await db
    .update(subscription)
    .set({
      status: "canceled",
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, foundUser.id));

  console.log(`Subscription canceled for user ${foundUser.email}`);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the signature from headers
  const signature =
    req.headers.get("polar-signature") || req.headers.get("x-polar-signature");

  if (!signature) {
    console.error("Missing Polar webhook signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (error) {
    console.error("Failed to read request body:", error);
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PolarWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    console.error("Failed to parse webhook payload:", error);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  console.log(`Received Polar webhook: ${event.type} (${event.id})`);

  try {
    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
      case "order.created":
        await handlePaymentSuccess(event);

        // If this includes a subscription, handle that too
        if (event.data.subscription) {
          await handleSubscriptionEvent(event);
        }
        break;

      case "subscription.created":
      case "subscription.updated":
        await handleSubscriptionEvent(event);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(event);
        break;

      case "payment.succeeded":
        await handlePaymentSuccess(event);
        break;

      case "payment.failed":
        console.log(
          `Payment failed for customer ${event.data.customer.email}: ${event.data.id}`
        );
        // Optionally handle failed payments (send notification, etc.)
        break;

      default:
        console.log(`Unhandled Polar event type: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
      event_id: event.id,
      event_type: event.type,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `Webhook processing error for event ${event.id}:`,
      errorMessage
    );

    // Return 500 to trigger Polar's retry mechanism
    return NextResponse.json(
      {
        error: `Processing failed: ${errorMessage}`,
        event_id: event.id,
      },
      { status: 500 }
    );
  }
}
