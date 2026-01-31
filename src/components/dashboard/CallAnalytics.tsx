"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, CalendarCheck, TrendingUp } from "lucide-react";

interface Stats {
    totalCalls: number;
    avgDuration: number;
    totalBookings: number;
    completedCalls?: number;
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
}

export function CallAnalytics({ stats }: { stats: Stats }) {
    // Calculate success rate based on completed calls
    const successRate = stats.totalCalls > 0
        ? Math.round((stats.completedCalls ?? stats.totalCalls) / stats.totalCalls * 100)
        : 0;

    const cards = [
        {
            title: "Total Calls",
            value: stats.totalCalls.toString(),
            icon: Phone,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Avg. Duration",
            value: formatDuration(stats.avgDuration),
            icon: Clock,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Total Bookings",
            value: stats.totalBookings.toString(),
            icon: CalendarCheck,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: "Success Rate",
            value: `${successRate}%`,
            icon: TrendingUp,
            color: successRate >= 80 ? "text-green-600" : successRate >= 50 ? "text-orange-600" : "text-red-600",
            bg: successRate >= 80 ? "bg-green-100" : successRate >= 50 ? "bg-orange-100" : "bg-red-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-md ${card.bg}`}>
                            <card.icon className={card.color + " h-4 w-4"} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
