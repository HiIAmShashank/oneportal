/// <reference types="vite/client" />

/**
 * Shared environment variable types
 * Note: App-specific variables (VITE_{APPNAME}_AUTH_*, VITE_{APPNAME}_API_BASE_URL)
 * are defined in each app's own vite-env.d.ts file
 */
interface ImportMetaEnv extends Record<string, unknown> {
  // Application Mode (shared across all apps)
  readonly VITE_APP_MODE?: "embedded" | "standalone" | "auto";

  // Feature Flags (shared across all apps)
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
