"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, CalendarCheck, TrendingUp } from "lucide-react";

interface Stats {
    totalCalls: number;
    avgDuration: number;
    totalBookings: number;
}

export function CallAnalytics({ stats }: { stats: Stats }) {
    const cards = [
        {
            title: "Total Calls",
            value: stats.totalCalls,
            icon: Phone,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Avg. Duration",
            value: `${stats.avgDuration}s`,
            icon: Clock,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Total Bookings",
            value: stats.totalBookings,
            icon: CalendarCheck,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: "Success Rate",
            value: stats.totalCalls > 0 ? `${Math.round((stats.totalBookings / stats.totalCalls) * 100)}%` : "0%",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-100",
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
