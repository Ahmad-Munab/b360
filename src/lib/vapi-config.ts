import { createBookingTool } from "./vapi-tools";

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

/**
 * DIAGNOSTIC: Ultra-minimal config matching the official Vapi docs exactly.
 * See: https://docs.vapi.ai/server-url/events#retrieving-assistants
 * 
 * Once this works, we will add features (voice, tools, etc.) back one by one.
 */
export function generateVapiAssistantConfig(options: AssistantConfigOptions) {
    return {
        firstMessage: options.welcomeMessage || "Hello! How can I help you today?",
        model: {
            provider: "openai",
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI assistant for ${options.name}. ${options.businessContext || "Help callers with their questions."}`
                }
            ]
        }
    };
}
