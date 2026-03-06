import { db } from "@/lib/db";
import { agent as agentTable } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/utils";
import { generateVapiAssistantConfig } from "@/lib/vapi-config";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) {
            return NextResponse.json({ message: "Empty body" }, { status: 200 });
        }
        const body = JSON.parse(text);
        console.log("Vapi request body:", JSON.stringify(body, null, 2));

        // Vapi sends the message type at the top level
        const messageType = body.message?.type || body.type;

        // This is called by Vapi when looking for an assistant for an inbound call
        if (messageType !== "assistant-request") {
            const phoneNumber = body.message?.phoneNumber?.number || body.phoneNumber?.number;
            console.log(`Received ${messageType} message for ${phoneNumber}:`, JSON.stringify(body, null, 2));
            return NextResponse.json({ received: true });
        }

        // Extract the phone number being called - exhaustive list of fields
        const phoneNumber =
            body.message?.call?.to || // Most common for inbound calls
            body.message?.phoneNumber?.number ||
            body.message?.to ||
            body.phoneNumber?.number ||
            body.message?.call?.phoneNumber?.number ||
            body.call?.phoneNumber?.number ||
            body.to;

        if (!phoneNumber) {
            console.error("❌ No destination phone number found in request body:", JSON.stringify(body));
            return NextResponse.json({
                error: "Phone number not found in request"
            }, { status: 400 });
        }

        console.log(`Searching for agent for Dialed Number: ${phoneNumber}`);

        // Helper to strip non-digits for comparison
        const stripChars = (num: string) => num.replace(/\D/g, "");
        const cleanIncoming = stripChars(phoneNumber);

        // Find the agent associated with this phone number
        let currentAgent = await db.query.agent.findFirst({
            where: (agent, { eq, or, sql }) => {
                const conditions = [
                    eq(agent.phoneNumber, phoneNumber),
                    eq(agent.phoneNumber, cleanIncoming),
                    eq(agent.phoneNumber, `+${cleanIncoming}`),
                    sql`REGEXP_REPLACE(${agent.phoneNumber}, '\D', '', 'g') = ${cleanIncoming}`
                ];

                const vapiPhoneId = body.message?.phoneNumber?.id || body.phoneNumber?.id;
                if (vapiPhoneId) {
                    conditions.push(eq(agent.vapiPhoneNumberId, vapiPhoneId));
                }

                return or(...conditions);
            }
        });

        // FALLBACK: If no agent is found by number, try to get the first available agent
        // This ensures the call connects even if the phone mapping is slightly off
        if (!currentAgent) {
            console.warn(`⚠️ No direct match for ${phoneNumber}. Checking for any available agent...`);
            currentAgent = await db.query.agent.findFirst();
        }

        const baseUrl = getBaseUrl(req);

        // If STILL no agent (db empty), return a generic error assistant
        if (!currentAgent) {
            return NextResponse.json({
                assistant: {
                    firstMessage: "I apologize, but I couldn't find a configuration for this phone number. Please check your dashboard.",
                    model: {
                        provider: "openai",
                        model: "gpt-4o",
                        messages: [{ role: "system", content: "You are a fallback assistant. Explain that no agents were found in the database." }]
                    }
                }
            });
        }

        // Generate assistant config
        const assistant = generateVapiAssistantConfig({
            name: currentAgent.name,
            welcomeMessage: currentAgent.welcomeMessage,
            businessContext: currentAgent.businessContext,
            businessType: currentAgent.businessType,
            availabilityContext: currentAgent.availabilityContext,
            voice: currentAgent.voice,
            baseUrl,
            agentId: currentAgent.id
        });

        const responsePayload = { assistant: assistant };
        console.log(`✅ Delivering transient assistant for: ${currentAgent.name}`);
        console.log("Response JSON:", JSON.stringify(responsePayload, null, 2));

        return NextResponse.json(responsePayload);
    } catch (error) {
        console.error("❌ CRITICAL ERROR in assistant-request:", error);
        return NextResponse.json({
            assistant: {
                firstMessage: "I'm sorry, a server error occurred. Please try again later.",
                model: { provider: "openai", model: "gpt-4o", messages: [{ role: "system", content: "Explain that a server error occurred." }] }
            }
        });
    }
}
