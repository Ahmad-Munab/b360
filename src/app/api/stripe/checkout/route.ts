import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import { getOrCreateStripeCustomer } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(session.user.id);

    // Get the base URL for redirect URLs
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${baseUrl}/dashboard/settings?success=true`,
      cancelUrl: `${baseUrl}/dashboard/settings?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
