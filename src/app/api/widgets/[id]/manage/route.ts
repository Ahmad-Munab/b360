import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { widget } from '@/db/schema';
import { eq, and } from 'drizzle-orm';


// Get a specific widget for authenticated user
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const widgetData = await db.query.widget.findFirst({
      where: and(
        eq(widget.id, params.id),
        eq(widget.userId, session.user.id)
      ),
    });

    if (!widgetData) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ widget: widgetData });
  } catch (error) {
    console.error('Error fetching widget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
