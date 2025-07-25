"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWidgetsStore } from "@/store/useWidgetsStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Edit, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Widget from "@/components/Widget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function WidgetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { widgets, isLoading, fetchWidgets, getWidgetEmbedCode } =
    useWidgetsStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [widgetId, setWidgetId] = useState<string>("");

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  useEffect(() => {
    params.then((resolvedParams) => {
      setWidgetId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!widgetId) return;

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/widgets/${widgetId}/analytics`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [widgetId]);

  const handleCopyCode = async () => {
    if (!widgetId) return;
    try {
      const code = await getWidgetEmbedCode(widgetId);
      await navigator.clipboard.writeText(code);
      toast.success("Embed code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy embed code");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const widget = widgets.find((w) => w.id === widgetId);
  if (!widget && widgetId) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Widget Not Found</CardTitle>
            <CardDescription>
              The requested widget could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/widgets")}>
              Back to Widgets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!widget) {
    return null; // Still loading
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{widget.name}</h1>
          <p className="text-gray-600 mt-1">
            Manage your widget configuration, view analytics, and handle
            customer feedback
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <span className="text-sm text-gray-500">
              Widget ID: {widget.id}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                widget.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {widget.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/dashboard/widgets/${widget.id}/edit`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Configuration
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Widget Preview */}
        <div className="lg:col-span-1">
          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Embed Code
              </CardTitle>
              <CardDescription>
                Paste this code inside your your websites head or body tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                <code>{`<script src="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/widget.js" data-widget-id="${
                  widget.id
                }" defer></script>`}</code>
              </div>
              <Button
                onClick={handleCopyCode}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Messages
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.totalMessages || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Feedback
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.totalFeedbacks || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Bug Reports
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.totalBugReports || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Recent Feedback
              </CardTitle>
              <CardDescription>
                Latest customer feedback and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <Skeleton className="h-4 w-[200px] mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : analytics?.recentFeedbacks?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentFeedbacks.map(
                    (feedback: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Feedback
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {feedback.content}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No feedback yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Customer feedback will appear here once they start using
                    your widget.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bug Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Bug Reports
              </CardTitle>
              <CardDescription>Issues reported by customers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <Skeleton className="h-4 w-[200px] mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : analytics?.recentBugReports?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentBugReports.map((bug: any, index: number) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Bug Report
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(bug.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{bug.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No bug reports
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bug reports from customers will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
