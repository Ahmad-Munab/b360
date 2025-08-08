"use client";

import { SubscriptionStatus } from "@/components/dashboard/subscription/SubscriptionStatus";
import { UsageTracker } from "@/components/dashboard/subscription/UsageTracker";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your subscription, usage, and billing information.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Subscription Management */}
        <div className="space-y-6">
          <SubscriptionStatus />
        </div>

        {/* Right Column: Usage Statistics */}
        <div className="space-y-6">
          <UsageTracker />
        </div>
      </div>
    </div>
  );
}
