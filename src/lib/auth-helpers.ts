import { db } from "./db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createFreeSubscription } from "./subscription";

export interface UserData {
    id: string;
    email: string;
    name: string;
    image?: string | null;
}

/**
 * Ensures a user exists in the database and has a default subscription
 * This function is called during authentication to set up new users
 */
export async function ensureUserExists(userData: UserData): Promise<void> {
    try {
        // Check if user already exists
        const existingUser = await db.query.user.findFirst({
            where: eq(user.id, userData.id),
        });

        if (!existingUser) {
            // Create the user first
            await db
                .insert(user)
                .values({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    image: userData.image,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .onConflictDoNothing(); // In case of race condition

            // Create a default free subscription for the new user
            try {
                await createFreeSubscription(userData.id);
                console.log(`Created free subscription for new user: ${userData.id}`);
            } catch (subscriptionError) {
                console.error(`Failed to create subscription for user ${userData.id}:`, subscriptionError);
                // Don't throw here - user creation should still succeed even if subscription fails
            }
        }
    } catch (error) {
        console.error("Error ensuring user exists:", error);
        throw error;
    }
}

/**
 * Updates user information in the database
 */
export async function updateUserInfo(userId: string, updates: Partial<UserData>): Promise<void> {
    try {
        await db
            .update(user)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(user.id, userId));
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;
    }
}
