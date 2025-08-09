import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { subscription, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    // Get subscription data
    const subscriptionData = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, session.user.id));

    return NextResponse.json({
      userId: session.user.id,
      userEmail: session.user.email,
      userData: userData[0] || null,
      subscriptions: subscriptionData,
      subscriptionCount: subscriptionData.length,
    });
  } catch (error) {
    console.error('Debug subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
