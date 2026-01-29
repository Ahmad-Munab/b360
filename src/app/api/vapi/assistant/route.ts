import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agent } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { agentId } = body;

        if (!agentId) {
            return NextResponse.json({ error: "agentId is required" }, { status: 400 });
        }

        // Fetch agent from DB
        const currentAgent = await db.query.agent.findFirst({
            where: eq(agent.id, agentId)
        });

        if (!currentAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        // Construct Vapi Assistant Config
        const assistant = {
            name: currentAgent.name,
            firstMessage: currentAgent.welcomeMessage || "Hello!",
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            voice: {
                provider: "11labs",
                voiceId: "rachel", // Rachel is a very reliable default voice
            },
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful AI assistant representing a platform called B360. 
                        Context about the business: ${currentAgent.businessContext || "No context provided."}
                        Business Type: ${currentAgent.businessType || "General"}
                        Availability: ${currentAgent.availabilityContext || "Standard business hours."}
                        Your goal is to assist callers professionally and save their details as leads if necessary.`
                    }
                ],
            },
        };

        console.log("🚀 Generated Assistant Config:", JSON.stringify(assistant, null, 2));

        return NextResponse.json(assistant);
    } catch (error) {
        console.error("Error generating assistant config:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
