import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe-server';
import { upsertSubscription } from '@/lib/subscription';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log('Fixing subscription for user:', userId);

    // Get the specific subscription ID from your logs
    const subscriptionId = 'sub_1RuFNOFfV3cY2g6d2uxqTQza'; // From your logs
    
    console.log('Retrieving subscription:', subscriptionId);
    
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log('Found subscription:', {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        customer: stripeSubscription.customer
      });

      // Create the subscription record in database
      const result = await upsertSubscription(userId, stripeSubscription);
      console.log('Subscription fixed:', result);

      return NextResponse.json({
        success: true,
        message: 'Subscription fixed successfully!',
        subscription: result
      });

    } catch (stripeError) {
      console.error('Error retrieving subscription from Stripe:', stripeError);
      return NextResponse.json({
        success: false,
        message: 'Subscription not found in Stripe',
        error: stripeError
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error fixing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fix subscription', details: error },
      { status: 500 }
    );
  }
}
