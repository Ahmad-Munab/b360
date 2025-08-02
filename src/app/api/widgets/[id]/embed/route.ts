import { NextResponse } from "next/server";
import { db } from "@/db";
import { widget } from "@/db/schema";
import { eq } from "drizzle-orm";

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
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    if (!widgetData.isActive) {
      return NextResponse.json(
        { error: "Widget is not active" },
        { status: 400 }
      );
    }

    // Return simple script tag that only requires widget ID
    // Get the host from the request headers for dynamic URL generation
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const embedCode = `<script src="${baseUrl}/widget.js" data-widget-id="${params.id}" defer></script>`;

    return NextResponse.json({
      embedCode,
      widget: widgetData,
    });
  } catch (error) {
    console.error("Widget embed error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
