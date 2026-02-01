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
                smartFormat: true,
            },
            voice: {
                provider: "vapi",
                voiceId: (currentAgent.voice?.toLowerCase() === "male") ? "Elliot" : "Lily",
            },
            model: {
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                tools: [bookingTool, endCallTool],
                messages: [
                    {
                        role: "system",
                        content: `You are a professional and friendly AI Voice Assistant for ${currentAgent.name}. Your primary goal is to assist callers efficiently while providing an excellent customer experience.

## OPERATIONAL RULES (CRITICAL)
- **Treat every caller as a new customer.**
- **Do NOT assume you know their name, email, or details.**
- **You MUST ask for and verify their Name and Email explicitly before booking.**
- **DO NOT GUESS NUMBERS.** If you are unsure, ask again. Never say "minus 2" or random numbers.

## About the Business
${currentAgent.businessContext || "We provide professional services to our valued customers."}

## Business Type
${currentAgent.businessType || "General Services"}

## Availability
${currentAgent.availabilityContext || "Standard business hours."}

## Current Date and Time
Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 
The current local time is ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}. 
Use this information to accurately handle relative dates like "tomorrow", "next week", or specific times.

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
3. Ask for their email address for confirmation (required)
4. **VERBAL CONFIRMATION (CRITICAL):**
   - Read back ALL details: "Just to check, I have [Name], email [Email], for [Service] on [Date]. Is that correct?"
   - **WAIT** for the customer to say "Yes".
5. ONLY after they confirm, use the 'book_appointment' tool to save it.
6. Finally, confirm the success message returned by the tool.
7. **Important**: If the tool returns an error saying the email is invalid, you MUST ask the user to spell it again carefully.

## IMPORTANT: Handling Email Addresses
Email addresses are difficult to capture accurately over voice. Follow these rules:
- Ask them to **spell it out letter by letter slowly**
- **Always repeat the full email back** character by character before confirming
- If unsure about any letter, ASK for clarification
- Common confusions to check: M/N, B/D, E/I, S/F, A/E, T/D
- Example: spell their email like for example mahmud.hasan.amaan848@gmail.com you should spell it like M A H M U D dot H A S A N dot A M A A N 8 4 8 (just spell @gmail.com normally)

## Ending Calls
- **Wait for the customer to finish.** Do not end the call unless they explicitly say they are done or say "goodbye".
- If the customer says "bye", "goodbye", "that's all", "I'm done", or similar, then use the end_call tool.
- After completing a booking, ask: "Is there anything else I can help you with today?"
- **ONLY** use the end_call tool after the customer confirms they have no more questions.
- Always be polite: "Thank you for calling! Have a great day. Goodbye."

## Communication Guidelines
- Speak naturally and conversationally
- Be warm, professional, and helpful
- Keep responses concise - this is a phone call
- Confirm important details by repeating them back`
                    }
                ],
            },
            serverUrl: `${baseUrl}/api/vapi/webhook`,
            interruptionsEnabled: true,
            numWordsToInterruptAssistant: 1,
            fillerExpressionsEnabled: false,
            silenceTimeoutSeconds: 60,
            maxDurationSeconds: 600,
            // Message spoken before ending the call
            endCallMessage: "Thank you for calling! Have a wonderful day. Goodbye!",
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
