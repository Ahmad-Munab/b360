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
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/utils";
import { createBookingTool, endCallTool } from "@/lib/vapi-tools";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) {
            return NextResponse.json({ message: "Empty body" }, { status: 200 });
        }
        const body = JSON.parse(text);

        // Log the full request for debugging
        // Log the full request for debugging (disabled for production)
        // console.log("Assistant request received:", JSON.stringify(body, null, 2));

        // Vapi sends the message type at the top level
        const messageType = body.message?.type || body.type;

        // This is called by Vapi when looking for an assistant for an inbound call
        if (messageType !== "assistant-request") {
            console.log(`Received ${messageType} message:`, JSON.stringify(body, null, 2));
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

        // Find the agent associated with this phone number
        // We look for agents where:
        // 1. phoneNumber matches (direct match)
        // 2. phoneSid matches (Twilio SID match)
        // 3. vapiPhoneNumberId matches (Vapi imported ID match)
        const currentAgent = await db.query.agent.findFirst({
            where: (agentTable, { eq, or }) => or(
                eq(agentTable.phoneNumber, phoneNumber),
                // Handle cases where number might have formatting differences
                eq(agentTable.phoneNumber, phoneNumber.replace(/^\+/, "")),
                eq(agentTable.phoneNumber, `+${phoneNumber.replace(/^\+/, "")}`),
                agentTable.vapiPhoneNumberId ? eq(agentTable.vapiPhoneNumberId, body.message?.phoneNumber?.id || "unknown") : undefined
            ),
            with: {
                user: true
            }
        });

        if (!currentAgent) {
            console.error(`No agent found for phone number: ${phoneNumber}`);
            // Return a default assistant or error
            // For now, return error so we know it's missing
            return NextResponse.json({
                error: "No agent configured for this number"
            }, { status: 404 });
        }

        const baseUrl = getBaseUrl(req);
        console.log("Using base URL for tools:", baseUrl);

        // Define booking tool for this tenant
        const bookingTool = createBookingTool(baseUrl, currentAgent.id);

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
                voiceId: (currentAgent.voice?.toLowerCase() === "male") ? "Elliot" : "Lily",
            },
            model: {
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                messages: [{
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
                }],
                // Correct location for tools in many Vapi transient contexts
                tools: [bookingTool, endCallTool],
            },
            interruptionsEnabled: true,
            numWordsToInterruptAssistant: 1,
            backgroundSound: "office",
            silenceTimeoutSeconds: 60,
            maxDurationSeconds: 600,
            endCallMessage: "Thank you for calling! Have a wonderful day. Goodbye!",
            metadata: {
                agentId: currentAgent.id,
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

        // Create the final response payload
        const assistantResponse = {
            assistant: {
                ...assistant,
                ...(credentials.length > 0 ? { credentials } : {}),
            },
            server: {
                url: `${baseUrl}/api/vapi/webhook`,
                timeoutSeconds: 30,
            }
        };

        console.log(`✅ Transient assistant delivered for: ${currentAgent.name}`);
        // Log the final JSON for debugging - this helps confirm the 'wrapped' structure
        // console.log("FINAL JSON TO VAPI:", JSON.stringify(assistantResponse, null, 2));

        return NextResponse.json(assistantResponse);
    } catch (error) {
        console.error("❌ Error in assistant-request webhook:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
