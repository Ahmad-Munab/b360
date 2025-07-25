import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { widget } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { generateAIResponse } from "@/lib/ai";
import { UsageService } from "@/lib/usage";
 
 // POST - Handle chat messages for a specific widget (public endpoint)
 export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { message } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Verify widget exists and is active
    const widgetData = await db.query.widget.findFirst({
      where: eq(widget.id, params.id),
    });

    if (!widgetData) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    if (!widgetData.isActive) {
      return NextResponse.json(
        { error: "Widget is not active" },
        { status: 400 }
      );
    }
 
    // Check usage limits before processing
    const canSendMessage = await UsageService.canPerformAction(
      widgetData.userId,
      "message"
    );

    if (!canSendMessage) {
      return NextResponse.json(
        {
          error: "Message limit reached for this month.",
          response:
            "Sorry, but I can't reply. The message limit for this widget has been reached.",
        },
        { status: 429 }
      );
    }
 
     // Generate AI response (replace with your actual AI logic)
     const aiResponse = await generateAIResponse(message, widgetData);
 
    // Generate a session ID for tracking
    const sessionId = uuidv4();

    // Track usage for the widget owner
    try {
      const { trackUsage } = await import("@/lib/middleware/usage");
      await trackUsage(widgetData.userId, "message", 1, params.id);
    } catch (usageError) {
      console.error("Error tracking usage:", usageError);
      // Don't fail the request if usage tracking fails
    }

    return NextResponse.json(
      {
        response: aiResponse,
        sessionId,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error processing widget chat message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
