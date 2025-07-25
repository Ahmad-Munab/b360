import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { analytics, widget } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { withUsageLimits, trackUsage } from '@/lib/middleware/usage';

// POST - Send message (with usage checking)
export const POST = withUsageLimits({ action: 'message' })(
    async function sendMessage(request: NextRequest) {
        try {
            const session = await getServerSession(authOptions);
            const userId = session!.user!.id; // Safe because of middleware check

            const body = await request.json();
            const { widgetId, message, sessionId } = body;

            // Validate required fields
            if (!widgetId || !message) {
                return NextResponse.json(
                    { error: 'Widget ID and message are required' },
                    { status: 400 }
                );
            }

            // Verify widget belongs to user
            const userWidget = await db
                .select({ id: widget.id })
                .from(widget)
                .where(eq(widget.id, widgetId))
                .limit(1);

            if (userWidget.length === 0) {
                return NextResponse.json(
                    { error: 'Widget not found' },
                    { status: 404 }
                );
            }

            // Simulate AI response (replace with your actual AI logic)
            const aiResponse = await generateAIResponse(message);

            // Log the interaction in analytics
            await db.insert(analytics).values({
                widgetId,
                eventType: 'message_sent',
                eventData: {
                    message,
                    response: aiResponse,
                    timestamp: new Date().toISOString(),
                },
                sessionId,
            });

            // Track the message usage
            await trackUsage(userId, 'message', 1);

            return NextResponse.json({
                response: aiResponse,
                message: 'Message processed successfully',
            });

        } catch (error) {
            console.error('Error processing message:', error);
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    }
);

// Mock AI response function - replace with your actual AI integration
async function generateAIResponse(message: string): Promise<string> {
    // This is a mock function. Replace with your actual AI service integration
    // For example: OpenAI, Claude, or your custom AI service

    const responses = [
        "Thank you for your message! How can I help you today?",
        "I understand your question. Let me provide you with some information.",
        "That's a great question! Here's what I can tell you about that.",
        "I'm here to help! Let me assist you with that.",
        "Thanks for reaching out! I'd be happy to help you with that.",
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a random response (replace with actual AI logic)
    return responses[Math.floor(Math.random() * responses.length)];
} 