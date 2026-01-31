// app/api/vapi/assistant-request/route.ts
//
// This endpoint handles Vapi's "assistant-request" webhook for inbound calls.
// When a call comes in to a Vapi-configured phone number without a pre-assigned assistant,
// Vapi calls this endpoint to get a transient assistant configuration.
//
// For multi-tenant support:
// 1. Import your Twilio numbers to Vapi (one-time setup per number)
// 2. Configure the "Server URL" in Vapi to point to your webhook endpoint
// 3. Leave the assistant unassigned on the phone number (or configure server URL for assistant request)
// 4. Vapi will call this endpoint with the phone number info
// 5. This endpoint returns a transient assistant based on which number was called

import { db } from "@/lib/db";
import { agent as agentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Log the full request for debugging
        console.log("Assistant request received:", JSON.stringify(body, null, 2));

        // Vapi sends the message type at the top level
        const messageType = body.message?.type || body.type;

        // This is called by Vapi when looking for an assistant for an inbound call
        if (messageType !== "assistant-request") {
            console.log(`Received non-assistant-request: ${messageType}`);
            // Not an assistant request, might be other webhook types
            return NextResponse.json({ received: true });
        }

        // Extract the phone number being called - try multiple locations
        const phoneNumber =
            body.message?.phoneNumber?.number ||
            body.phoneNumber?.number ||
            body.message?.call?.phoneNumber?.number ||
            body.call?.phoneNumber?.number ||
            body.message?.to ||
            body.to;

        const callerNumber =
            body.message?.customer?.number ||
            body.customer?.number ||
            body.message?.call?.customer?.number ||
            body.call?.customer?.number ||
            body.message?.from ||
            body.from;

        console.log(`Assistant request for number: ${phoneNumber}, caller: ${callerNumber}`);

        if (!phoneNumber) {
            console.error("No phone number in assistant request. Body:", JSON.stringify(body));
            return NextResponse.json({
                error: "Phone number not found"
            }, { status: 400 });
        }

        // Find the agent/tenant for this phone number
        const currentAgent = await db.query.agent.findFirst({
            where: eq(agentTable.phoneNumber, phoneNumber),
        });

        if (!currentAgent || !currentAgent.isActive) {
            console.log(`No active agent found for number: ${phoneNumber}`);
            // Return a basic fallback assistant
            return NextResponse.json({
                assistant: {
                    name: "Fallback Assistant",
                    firstMessage: "We're sorry, this number is currently unavailable. Please try again later. Goodbye.",
                    model: {
                        provider: "groq",
                        model: "llama-3.3-70b-versatile",
                        messages: [{
                            role: "system",
                            content: "You are a fallback assistant. Politely tell the caller the service is unavailable and end the call."
                        }]
                    },
                    voice: {
                        provider: "vapi",
                        voiceId: "Lily"
                    }
                }
            });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Define booking tool for this tenant
        const bookingTool = {
            type: "function",
            function: {
                name: "book_appointment",
                description: "Book an appointment or schedule a meeting for the customer. Use this when the customer wants to make a reservation or schedule a service.",
                parameters: {
                    type: "object",
                    properties: {
                        customer_name: {
                            type: "string",
                            description: "The customer's full name"
                        },
                        customer_email: {
                            type: "string",
                            description: "The customer's email address for confirmation"
                        },
                        customer_phone: {
                            type: "string",
                            description: "The customer's phone number"
                        },
                        booking_date: {
                            type: "string",
                            description: "The date and time for the appointment (e.g., 'tomorrow at 2pm', 'next Monday at 10am', '2024-01-15 14:00')"
                        },
                        service_details: {
                            type: "string",
                            description: "Description of the service or reason for the appointment"
                        }
                    },
                    required: ["customer_name", "booking_date"]
                }
            },
            server: {
                url: `${baseUrl}/api/vapi/tool-calls`,
                timeoutSeconds: 30,
                secret: currentAgent.id // Used for agentId extraction
            }
        };

        // Build the transient assistant configuration for this tenant
        const assistant = {
            name: currentAgent.name,
            firstMessage: currentAgent.welcomeMessage || "Hello! How can I help you today?",
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            voice: {
                provider: "vapi",
                voiceId: currentAgent.voice === "male" ? "Elliot" : "Lily",
            },
            model: {
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                tools: [bookingTool],
                messages: [{
                    role: "system",
                    content: `You are a professional and friendly AI Voice Assistant for ${currentAgent.name}. Your primary goal is to assist callers efficiently while providing an excellent customer experience.

## About the Business
${currentAgent.businessContext || "We provide professional services to our valued customers."}

## Business Type
${currentAgent.businessType || "General Services"}

## Availability
${currentAgent.availabilityContext || "Standard business hours."}

## Your Capabilities
You can help callers with:
- Answering questions about our services
- **Booking appointments** - Use the book_appointment tool when customers want to schedule
- Providing business information
- Taking messages for follow-up

## Booking Appointments
When a customer wants to book an appointment:
1. Ask for their preferred date and time
2. Confirm what service or purpose they need
3. Get their full name (required)
4. Ask for their email address for confirmation (required)
5. Optionally ask for their phone number
6. Use the book_appointment tool to save the booking
7. Confirm the booking details back to them

## IMPORTANT: Handling Email Addresses
Email addresses are difficult to capture accurately over voice. Follow these rules:
- Ask them to **spell it out letter by letter slowly**
- Use phonetic clarification: "Is that M as in Mike, or N as in November?"
- **Always repeat the full email back** character by character before confirming
- If unsure about any letter, ASK for clarification
- Common confusions to check: M/N, B/D, E/I, S/F, A/E, T/D

Example email confirmation:
"Let me confirm your email. That's M-A-H-M-U-D dot H-A-S-A-N 8-4-8 at gmail dot com. Is that correct?"

## Communication Guidelines
- Speak naturally and conversationally
- Be warm, professional, and helpful
- Keep responses concise - this is a phone call
- Confirm important details by repeating them back
- For emails, ALWAYS spell it back letter by letter before booking`
                }],
            },
            serverUrl: `${baseUrl}/api/vapi/webhook`,
            silenceTimeoutSeconds: 30,
            maxDurationSeconds: 600,
            metadata: {
                agentId: currentAgent.id,
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

        // Add provider credentials
        const credentials: Array<{ provider: string; apiKey: string }> = [];
        if (process.env.GROQ_API_KEY) {
            credentials.push({ provider: "groq", apiKey: process.env.GROQ_API_KEY });
        }
        if (process.env.DEEPGRAM_API_KEY) {
            credentials.push({ provider: "deepgram", apiKey: process.env.DEEPGRAM_API_KEY });
        }

        console.log(`Returning assistant for agent: ${currentAgent.name} (${currentAgent.id})`);

        return NextResponse.json({
            assistant: {
                ...assistant,
                ...(credentials.length > 0 ? { credentials } : {}),
            }
        });

    } catch (error) {
        console.error("Error in assistant-request webhook:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
