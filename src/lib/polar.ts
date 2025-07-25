// lib/polar-utils.ts
import { db } from '@/db';
import { subscription, subscriptionUsage } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Pricing plans configuration
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      widget: 1,
      messagesPerMonth: 20,
      analytics: 'basic',
      support: 'community',
      branding: false,
      apiAccess: false,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 9,
    features: {
      widget: 10,
      messagesPerMonth: 1000,
      analytics: 'advanced',
      support: 'priority',
      branding: true,
      apiAccess: true,
    },
  },
} as const;

export type PricingPlan = typeof PRICING_PLANS[keyof typeof PRICING_PLANS];

// Polar webhook event interfaces
export interface PolarWebhookEvent {
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
      metadata?: Record<string, string>;
    };
    product: {
      id: string;
      name: string;
      type: string;
      metadata?: Record<string, string>;
    };
    subscription?: {
      id: string;
      status: string;
      current_period_start: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
      trial_start?: string;
      trial_end?: string;
    };
    metadata?: Record<string, string>;
  };
}

// Get user's current plan and usage
export async function getUserPlanAndUsage(userId: string) {
  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  // Get user's subscription
  const userSubscription = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId)
  });

  // Get current period usage
  const usage = await db.query.subscriptionUsage.findFirst({
    where: and(
      eq(subscriptionUsage.userId, userId),
      eq(subscriptionUsage.period, currentPeriod)
    )
  });

  // Determine current plan
  const planId = userSubscription?.plan || 'free';
  const plan = planId === 'pro' ? PRICING_PLANS.PRO : PRICING_PLANS.FREE;

  // Check if subscription is active
  const isSubscriptionActive = userSubscription?.status === 'active' && 
    userSubscription?.currentPeriodEnd && 
    new Date(userSubscription.currentPeriodEnd) > new Date();

  return {
    subscription: userSubscription,
    usage: usage || {
      messageCount: 0,
      widgetCount: 0,
      period: currentPeriod
    },
    plan: isSubscriptionActive ? plan : PRICING_PLANS.FREE,
    isActive: isSubscriptionActive,
    limits: {
      widgets: isSubscriptionActive ? plan.features.widget : PRICING_PLANS.FREE.features.widget,
      messagesPerMonth: isSubscriptionActive ? plan.features.messagesPerMonth : PRICING_PLANS.FREE.features.messagesPerMonth,
    }
  };
}

// Check if user can create more widgets
export async function canCreateWidget(userId: string): Promise<boolean> {
  const { usage, limits } = await getUserPlanAndUsage(userId);
  return usage.widgetCount < limits.widgets;
}

// Check if user can send more messages
export async function canSendMessage(userId: string): Promise<boolean> {
  const { usage, limits } = await getUserPlanAndUsage(userId);
  return usage.messageCount < limits.messagesPerMonth;
}

// Increment usage counters
export async function incrementUsage(
  userId: string, 
  type: 'widget' | 'message'
): Promise<void> {
  const currentPeriod = new Date().toISOString().slice(0, 7);
  
  await db
    .insert(subscriptionUsage)
    .values({
      userId,
      period: currentPeriod,
      messageCount: type === 'message' ? 1 : 0,
      widgetCount: type === 'widget' ? 1 : 0,
    })
    .onConflictDoUpdate({
      target: [subscriptionUsage.userId, subscriptionUsage.period],
      set: {
        messageCount: type === 'message' 
          ? sql`${subscriptionUsage.messageCount} + 1`
          : subscriptionUsage.messageCount,
        widgetCount: type === 'widget' 
          ? sql`${subscriptionUsage.widgetCount} + 1`
          : subscriptionUsage.widgetCount,
        updatedAt: new Date(),
      }
    });
}

// Reset usage for new period (call this in a cron job)
export async function resetMonthlyUsage(): Promise<void> {
  const currentPeriod = new Date().toISOString().slice(0, 7);
  
  // This would typically be called by a cron job at the start of each month
  // For now, it's just a utility function
  console.log(`Resetting usage for period: ${currentPeriod}`);
}

// Polar webhook event types
export const POLAR_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  ORDER_CREATED: 'order.created',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_CANCELED: 'subscription.canceled',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
} as const;

export type PolarWebhookEventType = typeof POLAR_WEBHOOK_EVENTS[keyof typeof POLAR_WEBHOOK_EVENTS];