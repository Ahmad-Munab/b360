"use client";

import { useEffect, useMemo, useState } from "react";
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

import { Copy, Edit } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Custom hook to get the correct base URL
function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Check if we're in production (Vercel)
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      if (hostname === "b360-one.vercel.app") {
        setBaseUrl("https://b360-one.vercel.app");
      } else {
        // For other domains, use the current domain
        setBaseUrl(`${window.location.protocol}//${window.location.host}`);
      }
    }
  }, []);

  return baseUrl;
}

export default function WidgetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { widgets, isLoading, fetchWidgets } = useWidgetsStore();

  const [widgetId, setWidgetId] = useState<string>("");
  const baseUrl = useBaseUrl();
  const code = useMemo(() => {
    const widgetJSFile = baseUrl.includes("vercel")
      ? "widget.js"
      : "widget-dev.js";
    return `<script src="${baseUrl}/${widgetJSFile}" data-widget-id="${widgetId}" defer></script>`;
  }, [widgetId, baseUrl]);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  useEffect(() => {
    params.then((resolvedParams) => {
      setWidgetId(resolvedParams.id);
    });
  }, [params]);

  const handleCopyCode = async () => {
    if (!widgetId || !baseUrl) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Embed code copied to clipboard");
    } catch {
      toast.error("Failed to copy embed code");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Please wait while we load your widget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading widget data...</div>
            </div>
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
            Manage your widget configuration and view analytics
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
              <CardTitle className="text-xl font-bold flex items-center">
                🚀 Integrate Your AI Widget
              </CardTitle>
              <CardDescription className="text-base">
                Get your AI-powered customer support widget live in minutes with our simple integration guide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step-by-step instructions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Copy the Code</h4>
                    <p className="text-sm text-gray-600">Copy the integration snippet below.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Paste in Your Website</h4>
                    <p className="text-sm text-gray-600">Add the code to your website&apos;s &lt;head&gt; or before closing &lt;/body&gt; tag.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Go Live!</h4>
                    <p className="text-sm text-gray-600">Your AI widget will appear automatically and start helping customers.</p>
                  </div>
                </div>
              </div>
              
              {/* Code snippet */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Integration Code:</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <code>{code}</code>
                </div>
                <Button
                  onClick={handleCopyCode}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Integration Code
                </Button>
              </div>

              {/* Platform-specific instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📚 Platform-Specific Guides:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="text-blue-700">• WordPress: Add to footer.php</div>
                  <div className="text-blue-700">• Shopify: Add to theme.liquid</div>
                  <div className="text-blue-700">• React: Import in App.js</div>
                  <div className="text-blue-700">• HTML: Add before &lt;/body&gt;</div>
                </div>
              </div>

              {/* Features highlight */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✨ What You Get:</h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-green-700">
                  <div>✓ 24/7 AI-powered customer support</div>
                  <div>✓ Instant responses to customer queries</div>
                  <div>✓ Seamless handoff to human agents</div>
                  <div>✓ Customizable appearance and behavior</div>
                  <div>✓ Real-time analytics and insights</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Widget Preview and Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Status</CardTitle>
              <CardDescription>
                Your widget is {widget.isActive ? "active" : "inactive"} and
                ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Widget ID:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {widget.id}
                </code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
