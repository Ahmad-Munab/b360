// Stripe configuration
export const STRIPE_CONFIG = {
    // Default fallback price ID - should be set in environment variables
    DEFAULT_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1234567890', // Fallback

    // Currency
    CURRENCY: 'usd',

    // Price in cents for fallback
    DEFAULT_PRICE_CENTS: 900, // $9.00

    // Success/Cancel URLs
    SUCCESS_URL: '/dashboard/settings?success=true',
    CANCEL_URL: '/dashboard/settings?canceled=true',

    // Billing portal return URL
    PORTAL_RETURN_URL: '/dashboard/settings',
} as const;

// Helper to get the price ID with validation
export function getStripePriceId(): string {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!priceId) {
        console.warn('NEXT_PUBLIC_STRIPE_PRICE_ID is not set. Using fallback.');
        return STRIPE_CONFIG.DEFAULT_PRICE_ID;
    }

    return priceId;
}

// Validate stripe configuration
export function validateStripeConfig(): boolean {
    const requiredEnvVars = [
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_WEBHOOK_SECRET'
    ];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        console.error('Missing required Stripe environment variables:', missing);
        return false;
    }

    return true;
}
