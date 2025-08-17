"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function SuccessHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle Stripe checkout success/cancel
    if (searchParams.get('success') === 'true') {
      toast.success("🎉 Subscription activated successfully! Welcome to Pro!");
    } else if (searchParams.get('canceled') === 'true') {
      toast.error("Subscription setup was cancelled. You can try again anytime.");
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}
