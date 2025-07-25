import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { eq, and, count, desc } from 'drizzle-orm';

export interface UserData {
    id: string;
    email: string;
    name: string;
    image?: string | null;
}

/**
 * Ensures a user exists in the database, creating them if they don't exist
 */
export async function ensureUserExists(userData: UserData): Promise<boolean> {
    try {
        // Check if user exists
        const existingUser = await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.id, userData.id))
            .limit(1);

        if (existingUser.length === 0) {
            // User doesn't exist, create them
            await db.insert(user).values({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                image: userData.image || null,
            });
            console.log(`Created user record for ${userData.email}`);
        }

        return true;
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        return false;
    }
}

/**
 * Checks if a user exists in the database
 */
export async function userExists(userId: string): Promise<boolean> {
    try {
        const existingUser = await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        return existingUser.length > 0;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { widget, feedback, widgetAnalytics, subscriptionUsage } from "@/db/schema";
import { getCurrentBillingPeriod } from "@/lib/billing";

export async function getDashboardAnalytics() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    // Get user creation date for billing period calculation
    const [currentUser] = await db
      .select({ createdAt: user.createdAt })
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser) {
      return null;
    }

    const { periodKey } = getCurrentBillingPeriod(currentUser.createdAt);

    // Get total stats
    const [totalWidgetsResult] = await db
      .select({ count: count() })
      .from(widget)
      .where(eq(widget.userId, userId));

    // Use subscriptionUsage table to get total messages for the current period
    const [totalMessages] = await db
      .select({ messageCount: subscriptionUsage.messageCount })
      .from(subscriptionUsage)
      .where(
        and(
          eq(subscriptionUsage.userId, userId),
          eq(subscriptionUsage.period, periodKey)
        )
      );

    const [totalFeedbacks] = await db
      .select({ count: count() })
      .from(feedback)
      .innerJoin(widget, eq(feedback.widgetId, widget.id))
      .where(and(eq(widget.userId, userId), eq(feedback.type, "feedback")));

    const [totalBugReports] = await db
      .select({ count: count() })
      .from(feedback)
      .innerJoin(widget, eq(feedback.widgetId, widget.id))
      .where(and(eq(widget.userId, userId), eq(feedback.type, "bug")));

    const [activeWidgets] = await db
      .select({ count: count() })
      .from(widget)
      .where(and(eq(widget.userId, userId), eq(widget.isActive, true)));

    // Get recent feedbacks (last 10)
    const recentFeedbacks = await db
      .select({
        id: feedback.id,
        widgetId: feedback.widgetId,
        widgetName: widget.name,
        content: feedback.content,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .innerJoin(widget, eq(feedback.widgetId, widget.id))
      .where(and(eq(widget.userId, userId), eq(feedback.type, "feedback")))
      .orderBy(desc(feedback.createdAt))
      .limit(10);

    // Get recent bug reports (last 10)
    const recentBugReports = await db
      .select({
        id: feedback.id,
        widgetId: feedback.widgetId,
        widgetName: widget.name,
        title: feedback.content,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .innerJoin(widget, eq(feedback.widgetId, widget.id))
      .where(and(eq(widget.userId, userId), eq(feedback.type, "bug")))
      .orderBy(desc(feedback.createdAt))
      .limit(10);

    return {
      stats: {
        totalMessages: totalMessages?.messageCount || 0,
        totalFeedbacks: totalFeedbacks.count || 0,
        totalBugReports: totalBugReports.count || 0,
        activeWidgets: activeWidgets.count || 0,
      },
      recentFeedbacks: recentFeedbacks.map((f) => ({
        ...f,
        createdAt: new Date(f.createdAt),
      })),
      recentBugReports: recentBugReports.map((b) => ({
        ...b,
        createdAt: new Date(b.createdAt),
      })),
    };
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return null;
  }
}
