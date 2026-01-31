// app/api/twilio/inbound/route.ts
import { NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { db } from "@/lib/db";
import { agent as agentTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        console.log("Twilio Inbound POST received");

        const formData = await req.text();
        const params = new URLSearchParams(formData);

        const allParams = Object.fromEntries(params.entries());
        console.log("Twilio All Params:", allParams);

        const callSid = params.get("CallSid");
        const from = params.get("From");
        const to = params.get("To");

        console.log("Twilio Params:", { callSid, from, to });

        let tenantIdentifier: string | null = null;
        if (to && to.startsWith("client:")) tenantIdentifier = to;
        else if (to) tenantIdentifier = to;
        else if (from) tenantIdentifier = from;

        if (!tenantIdentifier) {
            return new NextResponse("Missing destination identifier", { status: 400 });
        }

        console.log(`Searching for agent with identifier: ${tenantIdentifier}`);

        const currentAgent = await db.query.agent.findFirst({
            where: tenantIdentifier.startsWith("client:")
                ? eq(agentTable.clientId, tenantIdentifier)
                : eq(agentTable.phoneNumber, tenantIdentifier),
        });

        const twiml = new VoiceResponse();

        if (!currentAgent || !currentAgent.isActive) {
            console.log(`❌ No active agent found for identity: ${tenantIdentifier}`);
            twiml.say("We are sorry, this service is currently unavailable. Goodbye.");
            return new NextResponse(twiml.toString(), {
                headers: { "Content-Type": "text/xml" },
            });
        }

        console.log(`✅ Agent found: ${currentAgent.name}. Initiating AI session...`);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Define booking tool
        const bookingTool = {
            type: "function",
            function: {
                name: "book_appointment",
                description: "Book an appointment for the customer.",
                parameters: {
                    type: "object",
                    properties: {
                        customer_name: { type: "string", description: "Customer's full name" },
                        customer_email: { type: "string", description: "Customer's email" },
                        customer_phone: { type: "string", description: "Customer's phone" },
                        booking_date: { type: "string", description: "Appointment date/time" },
                        service_details: { type: "string", description: "Service description" }
                    },
                    required: ["customer_name", "booking_date"]
                }
            },
            server: { url: `${baseUrl}/api/vapi/tool-calls` }
        };

        const vapiAssistant = {
            name: currentAgent.name,
            firstMessage: currentAgent.welcomeMessage || "Hello! How can I help you today?",
            voice: {
                provider: "11labs",
                voiceId: currentAgent.voice === "male" ? "bIHbv24MWmeRgasZH58o" : "EXAVITQu4vr4xnSDxMaL",
                stability: 0.5,
                similarityBoost: 0.75,
            },
            serverUrl: `${baseUrl}/api/vapi/webhook`,
            silenceTimeoutSeconds: 30,
            maxDurationSeconds: 600,
            model: {
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                tools: [bookingTool],
                messages: [{
                    role: "system",
                    content: `You are a professional AI Voice Assistant for ${currentAgent.name}.

## About the Business
${currentAgent.businessContext || "We provide professional services."}

## Availability
${currentAgent.availabilityContext || "Standard business hours."}

## Your Capabilities
- Answer questions about services
- Book appointments (use the book_appointment tool)
- Provide business information

## Communication Guidelines
- Be warm, professional, and helpful
- Keep responses concise for voice
- Confirm important details back to the caller`
                }],
            },
            analysisPlan: {
                summaryPrompt: "Summarize the call including any bookings made and outcomes.",
                structuredDataPrompt: "Extract booking information if discussed.",
                structuredDataSchema: {
                    type: "object",
                    properties: {
                        booking_date: { type: "string" },
                        customer_name: { type: "string" },
                        customer_email: { type: "string" },
                        customer_phone: { type: "string" },
                        service_details: { type: "string" },
                    },
                },
            },
        };

        const validCustomerNumber = from && from.startsWith("+") ? from : "+15005550006";

        try {
            console.log(`Calling Vapi for agent ${currentAgent.id}...`);
            const vapiResponse = await fetch("https://api.vapi.ai/call", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assistant: vapiAssistant,
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
                console.error("Vapi API Error:", JSON.stringify(errorData, null, 2));
                throw new Error(`Vapi failed with status ${vapiResponse.status}`);
            }

            console.log(`🎙️ Vapi session successfully triggered for ${currentAgent.name}`);

            twiml.say({ voice: "alice" }, "Connecting you to the AI assistant...");
            twiml.pause({ length: 60 });
        } catch (vapiError) {
            console.error("❌ Vapi Initialization Failure:", vapiError);
            twiml.say("I'm sorry, I'm having trouble connecting. Please try again later.");
        }

        return new NextResponse(twiml.toString(), {
            headers: { "Content-Type": "text/xml" },
        });
    } catch (error) {
        console.error("🔥 Error in Twilio inbound route:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
