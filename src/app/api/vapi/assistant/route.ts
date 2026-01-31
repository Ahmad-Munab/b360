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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Define booking tool for real-time appointment scheduling
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
                // Include agentId in server metadata so tool-calls endpoint receives it
                secret: currentAgent.id // Use secret field to pass agentId
            }
        };

        // End call tool - allows AI to end the call gracefully
        const endCallTool = {
            type: "endCall",
            messages: [
                {
                    type: "request-start",
                    content: "Thank you for calling! Have a wonderful day. Goodbye!"
                }
            ]
        };

        console.log("🔧 Booking tool URL:", `${baseUrl}/api/vapi/tool-calls`);

        // Construct Vapi Assistant Config
        const assistant: Record<string, unknown> = {
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
                tools: [bookingTool, endCallTool],
                messages: [
                    {
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
"Let me confirm your email. That's M-A-H-M-U-D dot H-A-S-A-N dot A-M-A-A-N 8-4-8 at gmail dot com. Is that correct?"

## Communication Guidelines
- Speak naturally and conversationally
- Be warm, professional, and helpful
- Keep responses concise - this is a phone call
- Confirm important details by repeating them back
- For emails, ALWAYS spell it back letter by letter before booking`
                    }
                ],
            },
            serverUrl: `${baseUrl}/api/vapi/webhook`,
            silenceTimeoutSeconds: 30,
            maxDurationSeconds: 600,
            // Message spoken before ending the call
            endCallMessage: "Thank you for calling! Have a wonderful day. Goodbye!",
            // Phrases that trigger call end when spoken by assistant
            endCallPhrases: ["goodbye", "have a great day", "bye bye", "talk to you later"],
            metadata: {
                agentId: currentAgent.id,
            }
        };

        // Add provider credentials from env variables
        const credentials: Array<{ provider: string; apiKey: string }> = [];

        if (process.env.GROQ_API_KEY) {
            credentials.push({
                provider: "groq",
                apiKey: process.env.GROQ_API_KEY
            });
        }

        if (process.env.DEEPGRAM_API_KEY) {
            credentials.push({
                provider: "deepgram",
                apiKey: process.env.DEEPGRAM_API_KEY
            });
        }

        if (credentials.length > 0) {
            assistant.credentials = credentials;
        }

        console.log("🚀 Generated Assistant Config:", JSON.stringify({
            ...assistant,
            credentials: credentials.length > 0 ? `[${credentials.length} credentials]` : undefined
        }, null, 2));

        return NextResponse.json(assistant);
    } catch (error) {
        console.error("Error generating assistant config:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
