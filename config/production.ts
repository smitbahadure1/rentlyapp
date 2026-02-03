// Production configuration
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Logging configuration
export const LOG_LEVEL = IS_PRODUCTION ? 'error' : 'debug';

// Feature flags
export const FEATURES = {
    // Use fallback cars instead of RapidAPI (more reliable)
    USE_FALLBACK_CARS: true,

    // Enable detailed error logging (disable in production)
    DETAILED_ERROR_LOGS: !IS_PRODUCTION,

    // Show console logs (disable in production)
    SHOW_CONSOLE_LOGS: !IS_PRODUCTION,
};

// Error handling
export function logError(message: string, error?: any) {
    if (FEATURES.DETAILED_ERROR_LOGS) {
        console.error(message, error);
    } else {
        // In production, send to error tracking service (e.g., Sentry)
        // For now, just log silently
        if (__DEV__) {
            console.error(message, error);
        }
    }
}

export function logInfo(message: string, ...args: any[]) {
    if (FEATURES.SHOW_CONSOLE_LOGS) {
        console.log(message, ...args);
    }
}

export function logWarn(message: string, ...args: any[]) {
    if (FEATURES.SHOW_CONSOLE_LOGS) {
        console.warn(message, ...args);
    }
}
