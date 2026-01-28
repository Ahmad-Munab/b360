// app/api/twilio/inbound/route.ts
import { NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { db } from "@/lib/db";
import { agent as agentTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {

        console.log("Twilio Inbound POST received");

        // Twilio sends x-www-form-urlencoded
        const formData = await req.text();
        const params = new URLSearchParams(formData);

        const allParams = Object.fromEntries(params.entries());
        console.log("Twilio All Params:", allParams);

        const callSid = params.get("CallSid");
        const from = params.get("From"); // caller identity (phone or client)
        const to = params.get("To"); // destination (from params.To in browser or Twilio dial)
        const agentIdParam = params.get("AgentId"); // custom param if passed

        console.log("Twilio Params:", { callSid, from, to, agentIdParam });

        // Determine tenant/agent identifier
        // 1. Check if To is a client identity
        // 2. Check if AgentId param is passed
        // 3. Fallback to To (phone number) or From (fallback)
        let tenantIdentifier: string | null = null;
        if (to && to.startsWith("client:")) tenantIdentifier = to;
        else if (to) tenantIdentifier = to;
        else if (from) tenantIdentifier = from;

        if (!tenantIdentifier) {
            return new NextResponse("Missing destination identifier", { status: 400 });
        }

        console.log(`Searching for agent with identifier: ${tenantIdentifier}`);

        // Lookup agent/tenant in DB
        const currentAgent = await db.query.agent.findFirst({
            where: tenantIdentifier.startsWith("client:")
                ? eq(agentTable.clientId, tenantIdentifier) // match browser client identity
                : eq(agentTable.phoneNumber, tenantIdentifier), // match Twilio number
        });

        const twiml = new VoiceResponse();

        if (!currentAgent || !currentAgent.isActive) {
            console.log(`❌ No active agent found for identity: ${tenantIdentifier}`);
            twiml.say(
                "We are sorry, this service is currently unavailable. Please verify the destination. Goodbye."
            );
            return new NextResponse(twiml.toString(), {
                headers: { "Content-Type": "text/xml" },
            });
        }

        console.log(`✅ Agent found: ${currentAgent.name}. Initiating AI session...`);

        // Prepare Vapi assistant configuration
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const vapiAssistant = {
            name: currentAgent.name,
            firstMessage: currentAgent.welcomeMessage || "Hello, how can I help you?",
            voice: {
                provider: "playht",
                voiceId: currentAgent.voice === "male" ? "will" : "jennifer",
            },
            serverUrl: `${baseUrl}/api/vapi/webhook`,
            analysisPlan: {
                structuredDataSchema: {
                    type: "object",
                    properties: {
                        booking_date: { type: "string", description: "The date and time of the booking in ISO format" },
                        customer_name: { type: "string" },
                        customer_email: { type: "string" },
                        service_details: { type: "string", description: "What the customer wants to book" },
                    },
                },
            },
        };

        const vapiModel = {
            provider: "groq",
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an AI Voice Assistant for ${currentAgent.name}.
        
Business Context:
${currentAgent.businessContext || "General assistance."}

Availability & Hours:
${currentAgent.availabilityContext || "Standard business hours."}

Guidelines:
- Be helpful, professional, and friendly.
- Always maintain a supportive tone as a representative of ${currentAgent.name}.`,
                },
            ],
        };

        const finalAssistant = {
            ...vapiAssistant,
            model: vapiModel,
        };

        // Use the actual caller identity if it looks like a phone number, otherwise use a placeholder
        // Vapi strictly requires E.164 format for the customer.number field in inboundPhoneCall
        const validCustomerNumber = from && from.startsWith("+") ? from : "+15005550006";

        // Trigger Vapi to join this call
        try {
            console.log(`Calling Vapi for agent ${currentAgent.id}...`);
            const vapiResponse = await fetch("https://api.vapi.ai/call", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assistant: finalAssistant,
                    type: "inboundPhoneCall",
                    twilioCallSid: callSid,
                    customer: { number: validCustomerNumber },
                    phoneNumber: {
                        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
                        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
                        twilioPhoneNumber: currentAgent.phoneNumber,
                    },
                    metadata: {
                        agentId: currentAgent.id,
                        callSid: callSid
                    },
                }),
            });

            if (!vapiResponse.ok) {
                const errorData = await vapiResponse.json();
                console.error("Vapi API Error Details:", JSON.stringify(errorData, null, 2));
                throw new Error(`Vapi failed with status ${vapiResponse.status}`);
            }

            console.log(`🎙️ Vapi session successfully triggered for ${currentAgent.name}`);

            // Keep call alive while Vapi takes over
            twiml.say({ voice: "alice" }, "Connecting you to the AI assistant...");
            twiml.pause({ length: 60 });
        } catch (vapiError) {
            console.error("❌ Vapi Initialization Failure:", vapiError);
            twiml.say(
                "I'm sorry, I'm having trouble connecting to the AI system. Please try again later."
            );
        }

        return new NextResponse(twiml.toString(), {
            headers: { "Content-Type": "text/xml" },
        });
    } catch (error) {
        console.error("🔥 Error in Twilio inbound route:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
