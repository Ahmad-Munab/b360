"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/stripe";
import { plans } from "@/lib/config/plans";
import { getStripePriceId } from "@/lib/config/stripe";

interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionStatusData {
  status: "free" | "active" | "canceled" | "past_due" | "unpaid";
  label: string;
  description: string;
}

interface SubscriptionResponse {
  subscription: SubscriptionData | null;
  status: SubscriptionStatusData;
}

export function SubscriptionStatus() {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/subscription");
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    setActionLoading("portal");
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404 && data.error === "No paid subscription found") {
          alert("Billing portal is only available for paid subscriptions. Please upgrade to a paid plan first.");
        } else {
          alert(`Failed to open billing portal: ${data.error || 'Unknown error'}`);
        }
        return;
      }

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("No billing portal URL received. Please try again.");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      alert("Failed to open billing portal. Please check your internet connection and try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.")) {
      return;
    }

    setActionLoading("cancel");
    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      await fetchSubscription();
      alert("Subscription cancelled successfully. You'll have access until the end of your billing period.");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading("reactivate");
    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reactivate" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      await fetchSubscription();
      alert("Subscription reactivated successfully!");
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      alert("Failed to reactivate subscription. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSyncSubscription = async () => {
    setActionLoading("sync");
    try {
      const response = await fetch("/api/stripe/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      await fetchSubscription();
      alert("Subscription data refreshed successfully!");
    } catch (error) {
      console.error("Error syncing subscription:", error);
      alert("Failed to refresh subscription data. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading("upgrade");
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: getStripePriceId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
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
          <p className="text-center text-gray-500">
            Unable to load subscription data.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { subscription, status } = subscriptionData;
  const currentPlan = subscription?.plan === "pro" ? plans.pro : plans.free;

  const getStatusIcon = () => {
    switch (status.status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "canceled":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "past_due":
      case "unpaid":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-yellow-100 text-yellow-800";
      case "past_due":
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          Subscription Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 p-6 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl text-gray-900">
                {currentPlan.name} Plan
              </h3>
              <p className="text-emerald-600 font-medium mt-1">
                {currentPlan.price > 0
                  ? `${formatPrice(currentPlan.price)} per ${
                      currentPlan.interval
                    }`
                  : "Free forever"}
              </p>
            </div>
            <Badge
              className={`${getStatusColor()} px-3 py-1 text-sm font-medium`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                {status.label}
              </div>
            </Badge>
          </div>
        </div>

        {/* Status Description */}
        <p className="text-sm text-gray-600">{status.description}</p>

        {/* Billing Period */}
        {subscription && subscription.currentPeriodEnd && subscription.plan !== "free" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Next billing:{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {/* Free Plan Info */}
        {subscription && subscription.plan === "free" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>Free plan - no billing required</span>
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
          {status.status === "free" && (
            <Button
              onClick={handleUpgrade}
              disabled={actionLoading === "upgrade"}
              className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200"
            >
              {actionLoading === "upgrade" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Pro Plan"
              )}
            </Button>
          )}

          {(status.status === "active" || status.status === "past_due") && subscription?.stripeCustomerId && (
            <>
              <Button
                onClick={handleBillingPortal}
                disabled={actionLoading === "portal"}
                variant="outline"
                className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium py-3 rounded-xl"
              >
                {actionLoading === "portal" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </>
                )}
              </Button>

              {!subscription.cancelAtPeriodEnd && (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === "cancel"}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl"
                >
                  {actionLoading === "cancel" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {status.status === "canceled" &&
            subscription?.stripeSubscriptionId && (
              <Button
                onClick={handleReactivateSubscription}
                disabled={actionLoading === "reactivate"}
                className="w-full"
              >
                {actionLoading === "reactivate" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reactivating...
                  </>
                ) : (
                  "Reactivate Subscription"
                )}
              </Button>
            )}

          {/* Sync button for paid subscriptions */}
          {subscription?.stripeSubscriptionId && (
            <Button
              onClick={handleSyncSubscription}
              disabled={actionLoading === "sync"}
              variant="outline"
              size="sm"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 text-xs py-2"
            >
              {actionLoading === "sync" ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Subscription Data"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
