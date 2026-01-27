import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { agent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureUserExists } from "@/lib/user-utils";
import { twilioClient } from "@/lib/twilio";

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

        // Detect App URL for webhooks
        const host = request.headers.get("host") || "";
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        const tunnelUrl = "https://chafflike-weightily-clarita.ngrok-free.dev";

        let appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        if (appUrl.includes("localhost") || appUrl.includes("127.0.0.1")) {
            appUrl = tunnelUrl;
        }

        const {
            name,
            description,
            phoneNumber,
            phoneSid,
            clientId,
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

        // If phoneSid is missing, it means we need to purchase the number now
        let finalPhoneNumber = phoneNumber;
        let finalPhoneSid = phoneSid;

        if (!finalPhoneSid) {
            try {
                // Purchase the number
                const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
                    phoneNumber: finalPhoneNumber,
                    voiceUrl: `${appUrl}/api/twilio/inbound`,
                    voiceMethod: 'POST'
                });

                finalPhoneNumber = purchasedNumber.phoneNumber;
                finalPhoneSid = purchasedNumber.sid;
                console.log(`Successfully purchased number ${finalPhoneNumber} (SID: ${finalPhoneSid}) via ${appUrl}`);
            } catch (error) {
                console.error("Twilio Purchase Error:", error);
                return NextResponse.json(
                    { error: "Failed to purchase the selected phone number. Please try a different one." },
                    { status: 500 }
                );
            }
        }

        // Generate a clientId if missing (needed for browser calls)
        let finalClientId = clientId;
        if (!finalClientId) {
            finalClientId = `client:${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
        }

        // Create the agent
        const newAgent = await db
            .insert(agent)
            .values({
                userId,
                name,
                description,
                phoneNumber: finalPhoneNumber,
                phoneSid: finalPhoneSid,
                clientId: finalClientId,
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
