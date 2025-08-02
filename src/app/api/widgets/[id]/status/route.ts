import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { widget } from "@/db/schema";
import { eq } from "drizzle-orm";

// CORS headers for widget embedding
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "false",
};

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Widget ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get widget status
    const [widgetData] = await db
      .select({
        isActive: widget.isActive,
      })
      .from(widget)
      .where(eq(widget.id, id))
      .limit(1);

    if (!widgetData) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        isActive: widgetData.isActive,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching widget status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
