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

        console.log("Twilio params:", { from: params.get("From"), to: params.get("To"), toClient: params.get("ToClient") });

        const callSid = params.get("CallSid");
        const from = params.get("From"); // caller identity (phone or client)
        const to = params.get("To"); // Twilio number
        const toClient = params.get("ToClient"); // Twilio Client target

        console.log("Twilio Params:", { callSid, from, to, toClient });

        // Determine tenant/agent identifier
        let tenantIdentifier: string | null = null;

        if (to) tenantIdentifier = to; // phone call to Twilio number
        else if (toClient) tenantIdentifier = toClient; // browser client → client call
        else tenantIdentifier = from; // fallback to caller identity

        if (!tenantIdentifier) {
            return new NextResponse("Missing destination identifier", { status: 400 });
        }

        // Lookup agent/tenant in DB
        const currentAgent = await db.query.agent.findFirst({
            where: tenantIdentifier.startsWith("client:")
                ? eq(agentTable.clientId, tenantIdentifier) // match browser client identity
                : eq(agentTable.phoneNumber, tenantIdentifier), // match Twilio number
        });

        const twiml = new VoiceResponse();

        if (!currentAgent || !currentAgent.isActive) {
            console.log(`No active agent found for: ${tenantIdentifier}`);
            twiml.say(
                "We are sorry, this service is currently unavailable for this number. Goodbye."
            );
            return new NextResponse(twiml.toString(), {
                headers: { "Content-Type": "text/xml" },
            });
        }

        console.log(`Agent found: ${currentAgent.name}. Initiating AI session...`);

        // Prepare Vapi assistant configuration
        const vapiAssistant = {
            name: currentAgent.name,
            firstMessage: currentAgent.welcomeMessage || "Hello, how can I help you?",
            model: {
                provider: "groq",
                model: "llama-3.1-70b-versatile",
                apiKey: process.env.GROQ_API_KEY,
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
            },
            voice: {
                provider: "playht",
                voiceId: currentAgent.voice === "male" ? "will" : "jennifer",
            },
        };

        // Trigger Vapi to join this call
        try {
            const vapiResponse = await fetch("https://api.vapi.ai/call", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.VAPI_PRIVATE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assistant: vapiAssistant,
                    type: "phone",
                    customer: { number: from },
                    twilioCallSid: callSid,
                    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
                    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
                }),
            });

            if (!vapiResponse.ok) {
                const errorData = await vapiResponse.json();
                console.error("Vapi API Error:", errorData);
                throw new Error("Failed to start Vapi session");
            }

            console.log(`Vapi session started for ${currentAgent.name}`);

            // Keep call alive while Vapi takes over
            twiml.say({ voice: "alice" }, "Connecting you to the AI assistant...");
            twiml.pause({ length: 60 }); // enough time for AI session
        } catch (vapiError) {
            console.error("Vapi Initialization Error:", vapiError);
            twiml.say(
                "We're currently experiencing a connection issue. Please try again later."
            );
        }

        return new NextResponse(twiml.toString(), {
            headers: { "Content-Type": "text/xml" },
        });
    } catch (error) {
        console.error("Error in inbound webhook:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
