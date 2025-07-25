"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </SessionProvider>
  );
}
