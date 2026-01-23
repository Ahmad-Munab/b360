import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Phone,
    Clock,
    Users,
    TrendingUp,
    Plus,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface DashboardData {
    stats: {
        totalCalls: number;
        totalMinutes: number;
        activeNumbers: number;
        avgCallDuration: number;
    };
}

async function getCallDashboardData(): Promise<DashboardData> {
    return {
        stats: {
            totalCalls: 0,
            totalMinutes: 0,
            activeNumbers: 0,
            avgCallDuration: 0,
        },
    };
}

export default async function CallDashboardPage() {
    const data = await getCallDashboardData();

    if (!data) return null;

    return (
        <div className="space-y-8 p-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Calls
                        </CardTitle>
                        <Phone className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.stats.totalCalls.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Minutes
                        </CardTitle>
                        <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(data.stats.totalMinutes / 60).toFixed(1)}h
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Phone Numbers
                        </CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.activeNumbers}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Call Duration
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.avgCallDuration}m</div>
                    </CardContent>
                </Card>
            </div>

            {/* Phone Numbers Section */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-xl">Phone Numbers</CardTitle>
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700"
                            >
                                {data.stats.activeNumbers}
                            </Badge>
                        </div>
                        <Link href="/dashboard/phone-numbers">
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
                    {data.stats.activeNumbers === 0 ? (
                        <div className="text-center py-12">
                            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No phone numbers added yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Add your first phone number to start tracking calls.
                            </p>
                            <Link href="/dashboard/call-agents/new">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Phone Number
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                You have {data.stats.activeNumbers} active phone number
                                {data.stats.activeNumbers !== 1 ? "s" : ""}.
                            </p>
                            <Link href="/dashboard/phone-numbers">
                                <Button variant="outline" className="mt-4 bg-transparent">
                                    Manage Numbers
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
