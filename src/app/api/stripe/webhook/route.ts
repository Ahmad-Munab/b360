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

        if (session.mode === "subscription" && session.subscription) {
          const userId = session.metadata?.userId;

          if (userId) {
            // Get the subscription details
            const stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            // Create or update subscription in database
            await upsertSubscription(userId, stripeSubscription);

            console.log("Subscription created/updated for user:", userId);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;

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
          await upsertSubscription(
            existingSubscription.userId,
            stripeSubscription
          );
          console.log(
            "Subscription updated for user:",
            existingSubscription.userId
          );
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
