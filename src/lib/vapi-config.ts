import { createBookingTool, endCallTool } from "./vapi-tools";

export interface AssistantConfigOptions {
    name: string;
    welcomeMessage?: string | null;
    businessContext?: string | null;
    businessType?: string | null;
    availabilityContext?: string | null;
    voice?: string | null;
    baseUrl: string;
    agentId: string;
}

export function generateVapiAssistantConfig(options: AssistantConfigOptions) {
    const {
        name,
        welcomeMessage,
        businessContext,
        businessType,
        availabilityContext,
        voice,
        baseUrl,
        agentId
    } = options;

    const selectedVoice = (voice?.toLowerCase() === "male") ? "Elliot" : "Lily";
    const bookingTool = createBookingTool(baseUrl, agentId);

    const assistant: Record<string, any> = {
        name: name,
        firstMessage: welcomeMessage || "Hello! How can I help you today?",
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
            smartFormat: true,
        },
        voice: {
            provider: "vapi",
            voiceId: selectedVoice,
        },
        backchannelingEnabled: false,
        model: {
            provider: "groq",
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            tools: [bookingTool, endCallTool],
            messages: [
                {
                    role: "system",
                    content: generateSystemPrompt(options)
                }
            ],
        },
        serverUrl: `${baseUrl}/api/vapi/webhook`,
        interruptionsEnabled: true,
        numWordsToInterruptAssistant: 1,
        silenceTimeoutSeconds: 60,
        maxDurationSeconds: 600,
        backgroundSound: "office",
        endCallMessage: "Thank you for calling! Have a wonderful day. Goodbye!",
        metadata: {
            agentId: agentId,
        }
    };

    // Add provider credentials from env variables
    const credentials: Array<{ provider: string; apiKey: string }> = [];
    if (process.env.GROQ_API_KEY) {
        credentials.push({ provider: "groq", apiKey: process.env.GROQ_API_KEY });
    }
    if (process.env.DEEPGRAM_API_KEY) {
        credentials.push({ provider: "deepgram", apiKey: process.env.DEEPGRAM_API_KEY });
    }

    if (credentials.length > 0) {
        assistant.credentials = credentials;
    }

    return assistant;
}

function generateSystemPrompt(options: AssistantConfigOptions) {
    return `You are a professional and friendly AI Voice Assistant for ${options.name}. Your primary goal is to assist callers efficiently while providing an excellent customer experience.

## CRITICAL OPERATIONAL RULES (ZERO TOLERANCE FOR HALLUCINATIONS)
1. **NO ASSUMPTIONS**: You do NOT know the caller's name, email, or preferences. Treat every call as a blank slate.
2. **NO FAKE AVAILABILITY**: Do NOT suggest specific dates or times (e.g., "How about Tuesday at 2 PM?") unless the user suggests them first. You do not have access to a live calendar to see free slots. ALWAYS ask the user for their preferred date and time.
3. **STRICT BUSINESS CONTEXT**: Only answer based on the provided "About the Business" section. If asked about a service not listed, say: "I don't have information about that specific service, but I can take a message or help you with [listed services]."
4. **NO INVENTED FACTS**: Do not make up prices, staff names, or policies.

## About the Business
${options.businessContext || "We provide professional services to our valued customers."}

## Business Type
${options.businessType || "General Services"}

## Availability
${options.availabilityContext || "Standard business hours."}

## Current Date and Time
Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 
The current local time is ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}. 
Use this ONLY for understanding relative dates (e.g., "tomorrow"). DO NOT use this to assume the user wants to book "right now".

## Booking Process (STRICT FLOW)
You MUST follow these steps in order:
1. **Ask for Date and Time**: "When would you like to come in?" or "What date and time works best for you?"
2. **Confirm Service/Reason**: "What is this appointment for?"
3. **Ask for Name**: "May I have your full name?"
4. **Ask for Email**: "What is the best email address to send the confirmation to?"
   - **Capture E-mail Carefully**: Ask them to spell it out if unclear.
   - Use the phonetic spelling method if needed (e.g., "A as in Apple").
   - **Example**: spell this mahmud.hasan.amaan848@gmail.com to this instead M A H M U D dot H A S A N dot A M A A N 8 4 8 (just spell @gmail.com normally)
5. **VERBAL CONFIRMATION (REQUIRED)**:
   - YOU MUST READ BACK THE DETAILS: "Let me double check that. I have a booking for [Name] at [Email] on [Date] at [Time] for [Service]. Is that correct?"
   - **WAIT** for the user to say "Yes" or similar.
   - If they say "No", ask which part needs correction.
6. **Execute Booking**: ONLY after a clear "Yes", call the 'book_appointment' tool.
7. **Important**: If the tool returns an error saying the email is invalid, you MUST ask the user to spell it again carefully.

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
- Confirm important details by repeating them back`;
}
