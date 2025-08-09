import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { user, widget, subscriptionUsage } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { getCurrentBillingPeriod } from "@/lib/billing";
import { plans } from "@/lib/config/plans";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user creation date for billing period calculation
    const [currentUser] = await db
      .select({ createdAt: user.createdAt })
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { periodKey } = getCurrentBillingPeriod(currentUser.createdAt);

    // Get usage data from subscriptionUsage table
    const [usageRecord] = await db
      .select({
        messageCount: subscriptionUsage.messageCount,
        widgetCount: subscriptionUsage.widgetCount,
      })
      .from(subscriptionUsage)
      .where(
        and(
          eq(subscriptionUsage.userId, userId),
          eq(subscriptionUsage.period, periodKey)
        )
      );

    // Get active widgets count
    const [activeWidgets] = await db
      .select({ count: count() })
      .from(widget)
      .where(and(eq(widget.userId, userId), eq(widget.isActive, true)));

    // For now, assume all users are on free plan
    // This can be enhanced later when subscription management is fully implemented
    const plan = "free";
    const planLimits = plans[plan].limits;

    const usage = {
      messages: {
        used: usageRecord?.messageCount || 0,
        limit: planLimits.messages,
      },
      widgets: {
        used: activeWidgets.count || 0,
        limit: planLimits.widgets,
      },
      plan,
    };

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
