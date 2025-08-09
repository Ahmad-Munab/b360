import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { constructWebhookEvent, stripe } from "@/lib/stripe-server";
import { upsertSubscription } from "@/lib/subscription";
import { db } from "@/lib/db";
import { payment, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Construct the webhook event
    const event = constructWebhookEvent(body, signature);

    console.log("Received webhook event:", event.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", {
          sessionId: session.id,
          mode: session.mode,
          subscription: session.subscription,
          metadata: session.metadata,
        });

        if (session.mode === "subscription" && session.subscription) {
          const userId = session.metadata?.userId;
          console.log("Processing subscription for user:", userId);

          if (userId) {
            // Get the subscription details
            const stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );
            console.log("Retrieved Stripe subscription:", {
              id: stripeSubscription.id,
              status: stripeSubscription.status,
              customer: stripeSubscription.customer,
            });

            // Create or update subscription in database
            const result = await upsertSubscription(userId, stripeSubscription);
            console.log("Subscription upserted:", result);

            console.log("Subscription created/updated for user:", userId);
          } else {
            console.error("No userId found in session metadata");
          }
        } else {
          console.log("Not a subscription checkout or no subscription ID");
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        console.log("Processing subscription event:", event.type, {
          subscriptionId: stripeSubscription.id,
          customer: stripeSubscription.customer,
          status: stripeSubscription.status,
        });

        // Find user by Stripe customer ID
        const [existingSubscription] = await db
          .select()
          .from(subscription)
          .where(
            eq(
              subscription.stripeCustomerId,
              stripeSubscription.customer as string
            )
          )
          .limit(1);

        if (existingSubscription) {
          const result = await upsertSubscription(
            existingSubscription.userId,
            stripeSubscription
          );
          console.log(
            "Subscription created/updated for user:",
            existingSubscription.userId,
            result
          );
        } else {
          // Try to find user by checking recent checkout sessions
          console.log(
            "No existing subscription found, checking recent sessions..."
          );

          // Get recent checkout sessions for this customer
          const sessions = await stripe.checkout.sessions.list({
            customer: stripeSubscription.customer as string,
            limit: 10,
          });

          console.log("Found sessions:", sessions.data.length);

          // Find a session with userId in metadata
          const sessionWithUser = sessions.data.find(
            (session) => session.metadata?.userId
          );

          if (sessionWithUser?.metadata?.userId) {
            console.log(
              "Found userId from session:",
              sessionWithUser.metadata.userId
            );
            const result = await upsertSubscription(
              sessionWithUser.metadata.userId,
              stripeSubscription
            );
            console.log("Subscription created for user from session:", result);
          } else {
            console.error(
              "No user found for customer:",
              stripeSubscription.customer,
              "Sessions checked:",
              sessions.data.map((s) => ({ id: s.id, metadata: s.metadata }))
            );
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        // Update subscription status to canceled
        await db
          .update(subscription)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(
            eq(
              subscription.stripeCustomerId,
              stripeSubscription.customer as string
            )
          );

        console.log(
          "Subscription canceled for customer:",
          stripeSubscription.customer
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;

        if (subscriptionId) {
          // Record successful payment
          const [existingSubscription] = await db
            .select()
            .from(subscription)
            .where(
              eq(subscription.stripeSubscriptionId, subscriptionId as string)
            )
            .limit(1);

          if (existingSubscription) {
            await db.insert(payment).values({
              userId: existingSubscription.userId,
              subscriptionId: existingSubscription.id,
              amount: (invoice.amount_paid / 100).toString(),
              currency: invoice.currency,
              status: "succeeded",
              stripePaymentId: (invoice as any).payment_intent as string,
              stripeInvoiceId: invoice.id,
              metadata: {
                invoiceNumber: invoice.number,
                invoiceUrl: invoice.hosted_invoice_url,
              },
              createdAt: new Date(),
            });

            console.log(
              "Payment recorded for user:",
              existingSubscription.userId
            );
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;

        if (subscriptionId) {
          // Record failed payment
          const [existingSubscription] = await db
            .select()
            .from(subscription)
            .where(
              eq(subscription.stripeSubscriptionId, subscriptionId as string)
            )
            .limit(1);

          if (existingSubscription) {
            await db.insert(payment).values({
              userId: existingSubscription.userId,
              subscriptionId: existingSubscription.id,
              amount: (invoice.amount_due / 100).toString(),
              currency: invoice.currency,
              status: "failed",
              stripeInvoiceId: invoice.id,
              metadata: {
                invoiceNumber: invoice.number,
                failureReason: "Payment failed",
              },
              createdAt: new Date(),
            });

            console.log(
              "Failed payment recorded for user:",
              existingSubscription.userId
            );
          }
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
