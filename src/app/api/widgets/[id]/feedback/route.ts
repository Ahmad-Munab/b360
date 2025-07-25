import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback, widget, widgetAnalytics } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request, 
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { type, content } = await req.json();
        const params = await context.params;
        const widgetId = params.id

        if (!widgetId || !type || !content) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Verify widget exists (public endpoint, no auth required)
        const widgetExists = await db.query.widget.findFirst({
            where: eq(widget.id, widgetId),
        });

        if (!widgetExists) {
            return new NextResponse('Widget not found', { status: 404 });
        }

        // Create feedback entry
        const newFeedback = await db
            .insert(feedback)
            .values({
                widgetId,
                type,
                content,
                status: 'pending',
            })
            .returning()
            .then((rows) => rows[0]);

        // Update widget analytics
        if (type === 'feedback') {
          await db
            .insert(widgetAnalytics)
            .values({
              widgetId: widgetId,
              feedbackCount: 1,
              bugReportCount: 0,
            })
            .onConflictDoUpdate({
              target: widgetAnalytics.widgetId,
              set: {
                feedbackCount: sql`${widgetAnalytics.feedbackCount} + 1`,
                updatedAt: new Date(),
              },
            })
            .returning();
        } else if (type === 'bug') {
          await db
            .insert(widgetAnalytics)
            .values({
              widgetId: widgetId,
              feedbackCount: 0,
              bugReportCount: 1,
            })
            .onConflictDoUpdate({
              target: widgetAnalytics.widgetId,
              set: {
                bugReportCount: sql`${widgetAnalytics.bugReportCount} + 1`,
                updatedAt: new Date(),
              },
            })
            .returning();
        }

        return NextResponse.json({ success: true, id: newFeedback.id }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
    } catch (error) {
        console.error('Feedback API Error:', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params = await context.params;
    const feedbackId = params.id;

    if (!feedbackId) {
      return new NextResponse("Missing feedback ID", { status: 400 });
    }

    // Verify ownership (optional, but good practice for sensitive operations)
    const feedbackEntry = await db.query.feedback.findFirst({
      where: eq(feedback.id, feedbackId),
      with: {
        widget: {
          with: {
            user: true,
          },
        },
      } as const,
    });

    if (!feedbackEntry) {
      return new NextResponse("Feedback not found", { status: 404 });
    }

    if (feedbackEntry.widget.user.id !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await db.delete(feedback).where(eq(feedback.id, feedbackId));

    return new NextResponse("Feedback deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Feedback DELETE API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const widgetId = searchParams.get('widgetId');
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        // Build query conditions
        const conditions = [];
        if (widgetId) conditions.push(eq(feedback.widgetId, widgetId));
        if (type) conditions.push(eq(feedback.type, type));
        if (status) conditions.push(eq(feedback.status, status));

        // Get feedback entries
        const feedbackEntries = await db.query.feedback.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: (feedback, { desc }) => [desc(feedback.createdAt)],
        });

        return NextResponse.json(feedbackEntries);
    } catch (error) {
        console.error('Feedback API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id, status, response } = await req.json();

        if (!id || !status) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Update feedback entry
        const updatedFeedback = await db
            .update(feedback)
            .set({
                status,
                response,
                updatedAt: new Date(),
            })
            .where(eq(feedback.id, id))
            .returning()
            .then((rows) => rows[0]);

        return NextResponse.json(updatedFeedback);
    } catch (error) {
        console.error('Feedback API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 