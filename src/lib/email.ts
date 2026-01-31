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

    const fromEmail = process.env.RESEND_FROM_EMAIL || "B360 <noreply@resend.dev>";

    try {
        // Send to admin
        const { error: adminError } = await resend.emails.send({
            from: fromEmail,
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

        if (adminError) {
            console.error("Resend admin email error:", adminError);
        }

        // Send confirmation to customer if email provided
        if (booking.customerEmail) {
            const { error: customerError } = await resend.emails.send({
                from: fromEmail,
                to: booking.customerEmail,
                subject: `✅ Booking Confirmed - ${booking.agentName}`,
                html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f4f7fa; padding: 40px;">
  <div style="max-width: 500px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0;">✅ Booking Confirmed!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">${booking.agentName}</p>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; color: #374151;">Hi ${booking.customerName || "there"},</p>
      <p style="color: #6b7280;">Your appointment has been successfully booked. Here are your booking details:</p>
      
      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <h4 style="margin: 0 0 8px;">📆 Your Appointment</h4>
        <p style="font-size: 18px; font-weight: bold; margin: 0; color: #059669;">${bookingDateFormatted}</p>
        ${booking.serviceDetails ? `<p style="margin: 12px 0 0; color: #6b7280;"><strong>Service:</strong> ${booking.serviceDetails}</p>` : ""}
      </div>
      
      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        If you need to reschedule or cancel, please contact us directly.
      </p>
      
      <p style="margin-top: 16px; color: #374151;">
        Thank you for choosing us!<br/>
        <strong>${booking.agentName}</strong>
      </p>
    </div>
  </div>
</body>
</html>`,
            });

            if (customerError) {
                console.error("Resend customer email error:", customerError);
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to send booking notification:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
