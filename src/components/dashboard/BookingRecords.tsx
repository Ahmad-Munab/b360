"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, User, Mail, Tag } from "lucide-react";

interface Booking {
    id: string;
    customerName: string | null;
    customerEmail: string | null;
    bookingDate: string | null;
    serviceDetails: string | null;
    status: string;
}

export function BookingRecords({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-gray-500">
                    No bookings recorded yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                            {booking.customerName || "No Name"}
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700 uppercase">
                                {booking.status}
                            </span>
                        </CardTitle>
                        <CardDescription className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {booking.bookingDate
                                ? format(new Date(booking.bookingDate), "MMM d, yyyy 'at' h:mm a")
                                : "TBD"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                        {booking.customerEmail && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                {booking.customerEmail}
                            </div>
                        )}
                        <div className="flex items-start text-sm text-gray-600 pt-2 border-t">
                            <Tag className="mr-2 h-4 w-4 text-gray-400 mt-1" />
                            <p className="line-clamp-2">{booking.serviceDetails || "No service details provided."}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
