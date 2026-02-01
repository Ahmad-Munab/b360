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
      subject: `New Lead: ${booking.customerName || "Customer"} booked an appointment`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f4f7fa; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
    <div style="background: #1e293b; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0; font-size: 20px;">🔔 New Booking Lead</h2>
    </div>
    <div style="padding: 24px;">
      <p style="margin-top: 0; color: #64748b;">You have received a new booking via <strong>${booking.agentName}</strong>.</p>
      
      <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 30%;">Customer Name</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${booking.customerName || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${booking.customerEmail || "Not provided"}</td>
        </tr>
         <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Phone</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${booking.customerPhone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Appointment Time</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500; color: #2563eb;">${bookingDateFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Service/Notes</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${booking.serviceDetails || "None"}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; text-align: center;">
        <a href="#" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">View in Dashboard</a>
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
        subject: `Appointment Confirmed: ${bookingDateFormatted}`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #ffffff; padding: 40px;">
  <div style="max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
    <div style="padding: 24px; text-align: center; border-bottom: 1px solid #f3f4f6;">
      <h1 style="color: #059669; margin: 0; font-size: 24px;">✅ Booking Confirmed</h1>
      <p style="color: #6b7280; margin: 8px 0 0;">with ${booking.agentName}</p>
    </div>
    
    <div style="padding: 32px 24px;">
      <p style="font-size: 16px; color: #374151; margin-top: 0;">Hi ${booking.customerName || "there"},</p>
      <p style="color: #4b5563; line-height: 1.5;">Your appointment has been successfully scheduled. We look forward to seeing you!</p>
      
      <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <div style="font-size: 14px; color: #166534; margin-bottom: 4px;">WHEN</div>
        <div style="font-size: 18px; font-weight: 600; color: #14532d;">${bookingDateFormatted}</div>
        
        ${booking.serviceDetails ? `
        <div style="margin-top: 16px;">
          <div style="font-size: 14px; color: #166534; margin-bottom: 4px;">WHAT</div>
          <div style="font-size: 16px; color: #14532d;">${booking.serviceDetails}</div>
        </div>` : ""}
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        Need to make changes? Please reply to this email or call us.
      </p>
    </div>
    
    <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
      &copy; ${new Date().getFullYear()} ${booking.agentName}. All rights reserved.
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
