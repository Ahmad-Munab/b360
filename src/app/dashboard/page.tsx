import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  ThumbsUp,
  Bug,
  WorkflowIcon as Widgets,
  Plus,
  ExternalLink,
} from "lucide-react";
import { getDashboardAnalytics } from "@/lib/user-utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface DashboardData {
  stats: {
    totalMessages: number;
    totalFeedbacks: number;
    totalBugReports: number;
    activeWidgets: number;
  };
  recentFeedbacks: Array<{
    id: string;
    widgetId: string;
    widgetName: string;
    content: string;
    createdAt: Date;
  }>;
  recentBugReports: Array<{
    id: string;
    widgetId: string;
    widgetName: string;
    title: string;
    createdAt: Date;
  }>;
}

export default async function DashboardPage() {
  const data = (await getDashboardAnalytics()) as DashboardData;

  if (!data) return null;

  return (
    <div className="space-y-8 p-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalMessages.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Feedbacks
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalFeedbacks}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bug Reports
            </CardTitle>
            <Bug className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalBugReports}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widgets Section */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Widgets className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-xl">Active Widgets</CardTitle>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                {data.stats.activeWidgets}
              </Badge>
            </div>
            <Link href="/dashboard/widgets">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                View All
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data.stats.activeWidgets === 0 ? (
            <div className="text-center py-12">
              <Widgets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No widgets created yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first widget to start collecting feedback and
                messages.
              </p>
              <Link href="/dashboard/widgets/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Widget
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Feedbacks */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    Recent Feedbacks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentFeedbacks.map((feedback) => (
                      <Link
                        href={`/dashboard/widgets/${feedback.widgetId}`}
                        key={feedback.id}
                      >
                        <div className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant="default"
                              className="bg-blue-100 text-blue-700"
                            >
                              Feedback
                            </Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium mb-1 line-clamp-2">
                            {feedback.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{feedback.widgetName}</span>
                            <span>
                              {formatDistanceToNow(feedback.createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bug Reports */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bug className="h-4 w-4 text-red-600" />
                    Recent Bug Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentBugReports.map((bug) => (
                      <Link
                        href={`/dashboard/widgets/${bug.widgetId}`}
                        key={bug.id}
                      >
                        <div className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-700"
                            >
                              Bug Report
                            </Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium mb-1 line-clamp-2">
                            {bug.title}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{bug.widgetName}</span>
                            <span>
                              {formatDistanceToNow(bug.createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
