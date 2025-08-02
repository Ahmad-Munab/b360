import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { widget } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { widgetFormSchema } from "@/lib/validations/widget";
import { user } from "@/db/schema";

// CORS headers for widget embedding
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "false",
};

// Get a specific widget (public access for widget loading)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const widgetData = await db.query.widget.findFirst({
      where: eq(widget.id, params.id),
    });

    if (!widgetData) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (!widgetData.isActive) {
      return NextResponse.json(
        { error: "Widget is not active" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Return only public widget configuration (no sensitive data)
    const publicWidget = {
      id: widgetData.id,
      position: widgetData.position,
      primaryColor: widgetData.primaryColor,
      productType: widgetData.productType,
      productName: widgetData.productName,
      features: widgetData.features,
      description: widgetData.description,
      faqs: widgetData.faqs,
      widgetTitle: widgetData.widgetTitle,
      welcomeMessage: widgetData.welcomeMessage,
      feedbackQuestion: widgetData.feedbackQuestion,
      enableBugReports: widgetData.enableBugReports,
    };

    return NextResponse.json(
      { widget: publicWidget },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
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

// Update a widget
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.email, session.user.email),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const now = new Date();

    const [updatedWidget] = await db
      .update(widget)
      .set({
        ...body,
        updatedAt: now,
      })
      .where(and(eq(widget.id, params.id), eq(widget.userId, userData.id)))
      .returning();

    if (!updatedWidget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json({ widget: updatedWidget });
  } catch (error) {
    console.error("Error updating widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a widget
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params; // Get the params from the context
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.email, session.user.email),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [deletedWidget] = await db
      .delete(widget)
      .where(and(eq(widget.id, params.id), eq(widget.userId, userData.id)))
      .returning();

    if (!deletedWidget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json({ widget: deletedWidget });
  } catch (error) {
    console.error("Error deleting widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
