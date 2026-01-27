import { db } from "@/lib/db";
import { callLogs, bookings } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Vapi Webhook Received:", JSON.stringify(body, null, 2));

        const { message } = body;

        // We only care about the end-of-call-report
        if (message?.type !== "end-of-call-report") {
            return NextResponse.json({ received: true });
        }

        const { call, artifact, analysis, customer } = message;
        const metadata = call?.metadata || {};
        const agentId = metadata.agentId;

        if (!agentId) {
            console.warn("Vapi webhook received without agentId in metadata");
            return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
        }

        // 1. Save the Call Log
        const [savedCallLog] = await db
            .insert(callLogs)
            .values({
                agentId: agentId,
                callSid: call.twilioCallSid || null,
                vapiCallId: call.id,
                callerNumber: customer?.number || null,
                duration: call.duration ? Math.round(call.duration) : 0,
                summary: analysis?.summary || null,
                transcript: artifact?.transcript || null,
                status: call.status || "completed",
                recordingUrl: artifact?.recordingUrl || null,
            })
            .returning();

        // 2. Extract and Save Booking if present in structuredData
        // We assume the assistant is configured to extract service details, date, name, etc.
        const structuredData = analysis?.structuredData;

        if (structuredData && (structuredData.bookingDate || structuredData.booking_date)) {
            console.log("Booking found in structured data:", structuredData);

            await db.insert(bookings).values({
                agentId: agentId,
                callLogId: savedCallLog.id,
                customerName: structuredData.customerName || structuredData.customer_name || null,
                customerEmail: structuredData.customerEmail || structuredData.customer_email || null,
                customerPhone: structuredData.customerPhone || structuredData.customer_phone || customer?.number || null,
                bookingDate: structuredData.bookingDate || structuredData.booking_date ? new Date(structuredData.bookingDate || structuredData.booking_date) : null,
                serviceDetails: structuredData.serviceDetails || structuredData.service_details || structuredData.summary || null,
                status: "confirmed",
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in Vapi webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
