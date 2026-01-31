import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingDetails {
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    bookingDate: Date | string | null;
    serviceDetails: string | null;
    agentName: string;
}

export async function sendBookingNotification(
    adminEmail: string,
    booking: BookingDetails
): Promise<{ success: boolean; error?: string }> {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not configured");
        return { success: false, error: "Email service not configured" };
    }

    const bookingDateFormatted = booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        : "To be confirmed";

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "B360 <noreply@resend.dev>",
            to: adminEmail,
            subject: `📅 New Booking: ${booking.customerName || "Customer"} - ${booking.agentName}`,
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f4f7fa; padding: 40px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0;">📅 New Booking</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">via ${booking.agentName}</p>
    </div>
    <div style="padding: 24px;">
      <h3 style="margin: 0 0 12px;">Customer Details</h3>
      <p><strong>Name:</strong> ${booking.customerName || "Not provided"}</p>
      <p><strong>Email:</strong> ${booking.customerEmail || "Not provided"}</p>
      <p><strong>Phone:</strong> ${booking.customerPhone || "Not provided"}</p>
      
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <h4 style="margin: 0 0 8px;">📆 Appointment</h4>
        <p style="font-size: 18px; font-weight: bold; margin: 0;">${bookingDateFormatted}</p>
        ${booking.serviceDetails ? `<p style="margin: 12px 0 0; color: #6b7280;">${booking.serviceDetails}</p>` : ""}
      </div>
    </div>
  </div>
</body>
</html>`,
        });

        if (error) {
            console.error("Resend email error:", error);
            return { success: false, error: error.message };
        }

        console.log(`✉️ Booking notification sent to ${adminEmail}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to send booking notification:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
