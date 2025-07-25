import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { widget, widgetAnalytics, feedback } from '@/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: widgetId } = await params;
    const userId = session.user.id;

    // Verify widget belongs to user
    const userWidget = await db
      .select()
      .from(widget)
      .where(and(
        eq(widget.id, widgetId),
        eq(widget.userId, userId)
      ))
      .limit(1);

    if (userWidget.length === 0) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    // Get widget analytics
    const [analyticsData] = await db
      .select()
      .from(widgetAnalytics)
      .where(eq(widgetAnalytics.widgetId, widgetId))
      .limit(1);

    // Use widget analytics if available, otherwise default to 0
    const totalMessages = analyticsData?.messageCount || 0;
    const totalFeedbacks = analyticsData?.feedbackCount || 0;
    const totalBugReports = analyticsData?.bugReportCount || 0;
    const totalFeatureRequests = 0; // Not tracked in widget_analytics

    // Get recent feedbacks for this widget (last 10)
    const recentFeedbacks = await db
      .select({
        id: feedback.id,
        content: feedback.content,
        type: feedback.type,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(and(
        eq(feedback.widgetId, widgetId),
        or(
          eq(feedback.type, 'feedback'),
          eq(feedback.type, 'question'),
          eq(feedback.type, 'agent')
        )
      ))
      .orderBy(desc(feedback.createdAt))
      .limit(10);

    // Get recent bug reports for this widget (last 10)
    const recentBugReports = await db
      .select({
        id: feedback.id,
        content: feedback.content,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(and(
        eq(feedback.widgetId, widgetId),
        eq(feedback.type, 'bug')
      ))
      .orderBy(desc(feedback.createdAt))
      .limit(10);

    // Messages over time not available in widget_analytics
    const messagesOverTime: any[] = [];

    return NextResponse.json({
      totalMessages: totalMessages,
      totalFeedbacks: totalFeedbacks,
      totalBugReports: totalBugReports,
      totalFeatureRequests: totalFeatureRequests,
      recentFeedbacks: recentFeedbacks,
      recentBugReports: recentBugReports,
      messagesOverTime: messagesOverTime,
    });

  } catch (error) {
    console.error('Error fetching widget analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
