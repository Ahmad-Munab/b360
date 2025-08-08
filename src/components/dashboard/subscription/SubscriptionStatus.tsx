"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/stripe";
import { plans } from "@/lib/config/plans";

interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionStatusData {
  status: 'free' | 'active' | 'canceled' | 'past_due' | 'unpaid';
  label: string;
  description: string;
}

interface SubscriptionResponse {
  subscription: SubscriptionData | null;
  status: SubscriptionStatusData;
}

export function SubscriptionStatus() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    setActionLoading('portal');
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const { url } = await response.json();
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });
      
      if (response.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading('reactivate');
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reactivate' }),
      });
      
      if (response.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading('upgrade');
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-gray-500">Unable to load subscription data.</p>
        </CardContent>
      </Card>
    );
  }

  const { subscription, status } = subscriptionData;
  const currentPlan = subscription?.plan === 'pro' ? plans.pro : plans.free;

  const getStatusIcon = () => {
    switch (status.status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'canceled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'past_due':
      case 'unpaid':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800';
      case 'past_due':
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
            <p className="text-sm text-gray-600">
              {currentPlan.price > 0 
                ? `${formatPrice(currentPlan.price)} per ${currentPlan.interval}`
                : 'Free forever'
              }
            </p>
          </div>
          <Badge className={getStatusColor()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {status.label}
            </div>
          </Badge>
        </div>

        {/* Status Description */}
        <p className="text-sm text-gray-600">{status.description}</p>

        {/* Billing Period */}
        {subscription && subscription.currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Plan Features */}
        <div>
          <h4 className="font-medium mb-2">Plan Features</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {status.status === 'free' && (
            <Button 
              onClick={handleUpgrade}
              disabled={actionLoading === 'upgrade'}
              className="w-full"
            >
              {actionLoading === 'upgrade' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upgrade to Pro'
              )}
            </Button>
          )}

          {status.status === 'active' && subscription?.stripeCustomerId && (
            <>
              <Button 
                onClick={handleBillingPortal}
                disabled={actionLoading === 'portal'}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'portal' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Manage Billing'
                )}
              </Button>

              {!subscription.cancelAtPeriodEnd && (
                <Button 
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  variant="destructive"
                  className="w-full"
                >
                  {actionLoading === 'cancel' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              )}
            </>
          )}

          {status.status === 'canceled' && subscription?.stripeSubscriptionId && (
            <Button 
              onClick={handleReactivateSubscription}
              disabled={actionLoading === 'reactivate'}
              className="w-full"
            >
              {actionLoading === 'reactivate' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reactivating...
                </>
              ) : (
                'Reactivate Subscription'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
