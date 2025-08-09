import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { widget, widgetAnalytics } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

    return NextResponse.json({
      totalMessages: totalMessages,
    });

  } catch (error) {
    console.error('Error fetching widget analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
