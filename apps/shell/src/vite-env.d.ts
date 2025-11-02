/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables (Shell App)
 *
 * Provides type safety for environment variables used in the Shell application.
 */
interface ImportMetaEnv {
  // Shell Authentication Configuration
  readonly VITE_SHELL_AUTH_CLIENT_ID: string;
  readonly VITE_SHELL_AUTH_AUTHORITY: string;
  readonly VITE_SHELL_AUTH_REDIRECT_URI: string;
  readonly VITE_SHELL_AUTH_POST_LOGOUT_REDIRECT_URI?: string;
  readonly VITE_SHELL_AUTH_SCOPES: string;

  // App Mode (shared across all apps)
  readonly VITE_APP_MODE?: "auto" | "standalone" | "embedded";

  // API Configuration (app-specific)
  readonly VITE_SHELL_API_BASE_URL?: string;
  readonly VITE_SHELL_FUNCTIONAPP_API_BASE_URL?: string;

  // Vite Standard Variables
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
