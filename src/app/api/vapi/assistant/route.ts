import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBaseUrl } from "@/lib/utils";
import { createBookingTool, endCallTool } from "@/lib/vapi-tools";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { agentId } = body;

        if (!agentId) {
            return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
        }

        // Get the agent details
        const currentAgent = await db.query.agent.findFirst({
            where: eq(agent.id, agentId),
            with: {
                user: true
            }
        });

        if (!currentAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const baseUrl = getBaseUrl(req);

        // Define booking tool for this tenant
        const bookingTool = createBookingTool(baseUrl, currentAgent.id);

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
