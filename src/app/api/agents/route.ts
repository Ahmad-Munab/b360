import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { agent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureUserExists } from "@/lib/user-utils";

// GET - Fetch user's agents
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureUserExists({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.name || "",
            image: session.user.image || null,
        });

        const userAgents = await db
            .select()
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .orderBy(agent.createdAt);

        return NextResponse.json({ agents: userAgents });
    } catch (error) {
        console.error("Error fetching agents:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new agent
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        await ensureUserExists({
            id: userId,
            email: session.user.email || "",
            name: session.user.name || "",
            image: session.user.image || null,
        });

        const body = await request.json();
        const {
            name,
            description,
            phoneNumber,
            phoneSid,
            voice = "female",
            welcomeMessage = "Hi! How can I help you today?",
            businessContext,
            businessType,
            availabilityContext,
            adminEmail,
            isActive = true,
        } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: "Agent name is required" },
                { status: 400 }
            );
        }

        if (!phoneNumber || !phoneSid) {
            return NextResponse.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        // Create the agent
        const newAgent = await db
            .insert(agent)
            .values({
                userId,
                name,
                description,
                phoneNumber,
                phoneSid,
                voice,
                welcomeMessage,
                businessContext,
                businessType,
                availabilityContext,
                adminEmail,
                isActive,
            })
            .returning();

        return NextResponse.json(
            {
                agent: newAgent[0],
                message: "Agent created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating agent:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
