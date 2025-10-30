/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables (One Portal Admin)
 *
 * Provides type safety for environment variables used in the One Portal Admin application.
 * Uses app-specific prefix: VITE_ONEPORTAL_ADMIN_AUTH_*
 */
interface ImportMetaEnv {
  // One Portal Admin Authentication Configuration
  readonly VITE_ONEPORTAL_ADMIN_AUTH_CLIENT_ID: string;
  readonly VITE_ONEPORTAL_ADMIN_AUTH_AUTHORITY: string;
  readonly VITE_ONEPORTAL_ADMIN_AUTH_REDIRECT_URI: string;
  readonly VITE_ONEPORTAL_ADMIN_AUTH_POST_LOGOUT_REDIRECT_URI?: string;
  readonly VITE_ONEPORTAL_ADMIN_AUTH_SCOPES: string;

  // App Mode (shared across all apps)
  readonly VITE_APP_MODE?: "auto" | "standalone" | "embedded";

  // API Configuration (app-specific)
  readonly VITE_ONEPORTAL_ADMIN_API_BASE_URL?: string;

  // Feature Flags (shared across all apps)
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_DEBUG?: string;

  // Vite Standard Variables
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
