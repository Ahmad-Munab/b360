import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getUserSubscription, 
  cancelUserSubscription, 
  reactivateUserSubscription,
  getSubscriptionStatus 
} from '@/lib/subscription';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await getUserSubscription(session.user.id);
    const status = getSubscriptionStatus(subscription);

    return NextResponse.json({
      subscription,
      status,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    switch (action) {
      case 'cancel': {
        const subscription = await cancelUserSubscription(session.user.id, true);
        return NextResponse.json({ subscription });
      }

      case 'reactivate': {
        const subscription = await reactivateUserSubscription(session.user.id);
        return NextResponse.json({ subscription });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
