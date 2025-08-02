import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  MessageSquare,
  Calendar,
  CreditCard,
  CheckCircle,
  PlusCircle,
  Mail,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getUserPlan, getUserUsage } from "@/lib/billing";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const plan = await getUserPlan();
  const usage = await getUserUsage();

  const remainingMessages =
    (usage?.limits.messages || 0) - (usage?.messageCount || 0);
  const remainingWidgets =
    (usage?.limits.widgets || 0) - (usage?.widgetCount || 0);
  const messageUsagePercentage =
    ((usage?.messageCount || 0) / (usage?.limits.messages || 1)) * 100;
  const widgetUsagePercentage =
    ((usage?.widgetCount || 0) / (usage?.limits.widgets || 1)) * 100;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your plan, usage, and billing information.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan & Billing */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Current Plan
              </CardTitle>
              <CardDescription>
                You are currently on the{" "}
                <span className="font-semibold text-primary">
                  {plan?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </span>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    plan?.status === "active" ? "default" : "destructive"
                  }
                  className="capitalize"
                >
                  {plan?.status || "Active"}
                </Badge>
              </div>
              {plan?.currentPeriodEnd && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Renews on</span>
                  <span className="font-medium">
                    {new Date(plan.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                {plan?.plan === "pro"
                  ? "Pro Plan Active"
                  : "Contact Sales to Upgrade"}
              </Button>
            </CardFooter>
          </Card>

          {plan?.plan === "free" && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-green-500" />
                  Upgrade to Pro
                </CardTitle>
                <CardDescription>
                  Unlock powerful features to enhance your feedback system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>1,000 AI responses/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>10 widgets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Advanced analytics</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/contact">
                  <Button className="w-full">Contact Sales</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column: Usage Statistics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                Here&apos;s how you&apos;re using your plan&apos;s resources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Messages Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    AI Responses
                  </h3>
                  <Badge
                    variant={remainingMessages > 0 ? "default" : "destructive"}
                  >
                    {remainingMessages > 0 ? "Available" : "Limit Reached"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>
                    {usage?.messageCount || 0} / {usage?.limits.messages || 0}{" "}
                    used
                  </span>
                  <span className="font-medium text-green-600">
                    {remainingMessages} remaining
                  </span>
                </div>
                <Progress value={messageUsagePercentage} className="h-2" />
              </div>

              <Separator />

              {/* Widgets Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-purple-500" />
                    Widgets
                  </h3>
                  <Badge
                    variant={remainingWidgets > 0 ? "default" : "destructive"}
                  >
                    {remainingWidgets > 0 ? "Available" : "Limit Reached"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>
                    {usage?.widgetCount || 0} / {usage?.limits.widgets || 0}{" "}
                    used
                  </span>
                  <span className="font-medium text-green-600">
                    {remainingWidgets} remaining
                  </span>
                </div>
                <Progress value={widgetUsagePercentage} className="h-2" />
              </div>
            </CardContent>
            {usage?.resetDate && (
              <CardFooter>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Usage limits reset on{" "}
                    {new Date(usage.resetDate).toLocaleDateString()}
                  </span>
                </div>
              </CardFooter>
            )}
          </Card>

          {remainingMessages <= 0 && (
            <Alert variant="destructive">
              <AlertTitle>
                You&apos;ve reached your AI response limit!
              </AlertTitle>
              <AlertDescription>
                Please upgrade your plan to continue receiving AI-powered
                responses. Your widgets will still collect feedback.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
