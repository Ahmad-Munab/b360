import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { widget } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Widget ID is required' },
        { status: 400 }
      );
    }

    // Get widget status
    const [widgetData] = await db
      .select({
        isActive: widget.isActive,
      })
      .from(widget)
      .where(eq(widget.id, id))
      .limit(1);

    if (!widgetData) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isActive: widgetData.isActive,
    });

  } catch (error) {
    console.error('Error fetching widget status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
