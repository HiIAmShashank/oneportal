/**
 * @module @one-portal/auth/utils/environment
 * @description Environment detection utilities for embedded vs standalone mode
 */

/**
 * Application mode determines how authentication redirects behave
 * 
 * - `embedded`: App is embedded in Shell (e.g., `/apps/domino`)
 *   - SSO failures redirect to Shell sign-in page
 *   - Assumes Shell handles primary authentication
 * 
 * - `standalone`: App runs independently (e.g., dev server at `localhost:5173`)
 *   - SSO failures show error messages (no redirect)
 *   - Used for local development and testing
 * 
 * - `auto`: Automatically detect based on URL path (default)
 *   - If path starts with `/apps/`, consider embedded
 *   - Otherwise, consider standalone
 */
export type AppMode = 'embedded' | 'standalone' | 'auto';

/**
 * Configuration for embedded mode detection
 */
export interface EmbeddedModeConfig {
    /**
     * Application mode override
     * 
     * - `embedded`: Force embedded mode (always redirect on SSO failure)
     * - `standalone`: Force standalone mode (never redirect on SSO failure)
     * - `auto`: Auto-detect based on URL path (default)
     * 
     * @default 'auto'
     */
    mode?: AppMode;

    /**
     * URL path prefix that indicates embedded mode
     * Used when mode is 'auto'
     * 
     * @default '/apps/'
     */
    embeddedPathPrefix?: string;
}

/**
 * Determines if the application is running in embedded mode (hosted within Shell)
 * 
 * This function uses a multi-tier detection strategy:
 * 1. **Config-based**: If `config.mode` is explicitly set, use that value
 * 2. **Path-based**: If mode is 'auto', check if URL path starts with configured prefix
 * 3. **Default**: Fall back to path-based detection with `/apps/` prefix
 * 
 * ## Embedded Mode
 * When the app is embedded in Shell (Module Federation):
 * - URL format: `https://shell.example.com/apps/domino/...`
 * - SSO failures redirect to Shell sign-in page
 * - Shell manages primary authentication
 * - Remote app performs SSO silent for seamless experience
 * 
 * ## Standalone Mode
 * When the app runs independently (local dev, separate deployment):
 * - URL format: `http://localhost:5173/...` or `https://domino.example.com/...`
 * - SSO failures show error messages (no redirect)
 * - User must sign in directly to the app
 * - Useful for development and testing
 * 
 * @param config - Optional configuration for detection behavior
 * @returns `true` if app is embedded in Shell, `false` if standalone
 * 
 * @example Config-based detection (explicit mode)
 * ```typescript
 * // Production: Force embedded mode
 * const isEmbedded = isEmbeddedMode({ mode: 'embedded' });
 * // Result: true
 * 
 * // Development: Force standalone mode
 * const isEmbedded = isEmbeddedMode({ mode: 'standalone' });
 * // Result: false
 * ```
 * 
 * @example Path-based detection (auto mode)
 * ```typescript
 * // URL: https://shell.example.com/apps/domino/dashboard
 * const isEmbedded = isEmbeddedMode({ mode: 'auto' });
 * // Result: true (path starts with /apps/)
 * 
 * // URL: http://localhost:5173/dashboard
 * const isEmbedded = isEmbeddedMode({ mode: 'auto' });
 * // Result: false (path doesn't start with /apps/)
 * ```
 * 
 * @example Custom path prefix
 * ```typescript
 * // URL: https://portal.example.com/remote/domino/dashboard
 * const isEmbedded = isEmbeddedMode({
 *   mode: 'auto',
 *   embeddedPathPrefix: '/remote/',
 * });
 * // Result: true
 * ```
 * 
 * @example Environment variable integration
 * ```typescript
 * // Read from environment variable (recommended)
 * const mode = import.meta.env.VITE_APP_MODE as AppMode;
 * const isEmbedded = isEmbeddedMode({ mode });
 * 
 * // .env.production
 * // VITE_APP_MODE=embedded
 * 
 * // .env.development
 * // VITE_APP_MODE=standalone
 * ```
 */
export function isEmbeddedMode(config?: EmbeddedModeConfig): boolean {
    const mode = config?.mode ?? 'auto';

    // 1. Config-based detection (explicit mode)
    if (mode === 'embedded') {
        return true;
    }

    if (mode === 'standalone') {
        return false;
    }

    // 2. Path-based detection (auto mode)
    const pathPrefix = config?.embeddedPathPrefix ?? '/apps/';
    return window.location.pathname.startsWith(pathPrefix);
}

/**
 * Gets the current application mode
 * 
 * Useful for logging and debugging
 * 
 * @param config - Optional configuration for detection behavior
 * @returns Current detected mode ('embedded' or 'standalone')
 * 
 * @example
 * ```typescript
 * const mode = getAppMode();
 * console.log(`Running in ${mode} mode`);
 * // Output: "Running in embedded mode"
 * ```
 */
export function getAppMode(config?: EmbeddedModeConfig): 'embedded' | 'standalone' {
    return isEmbeddedMode(config) ? 'embedded' : 'standalone';
}

/**
 * Creates an embedded mode config from environment variables
 * 
 * Reads `VITE_APP_MODE` environment variable and creates config
 * 
 * @returns Configuration based on environment variables
 * 
 * @example
 * ```typescript
 * // .env.production
 * // VITE_APP_MODE=embedded
 * 
 * const config = getEmbeddedModeConfig();
 * // Result: { mode: 'embedded' }
 * 
 * const isEmbedded = isEmbeddedMode(config);
 * // Result: true
 * ```
 */
export function getEmbeddedModeConfig(): EmbeddedModeConfig {
    const envMode = import.meta.env.VITE_APP_MODE as AppMode | undefined;

    return {
        mode: envMode ?? 'auto',
    };
}
