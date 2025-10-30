/**
 * @module @one-portal/auth/initialization
 * @description Type definitions for MSAL initialization
 */

import type { PublicClientApplication } from "@azure/msal-browser";
import type { AuthConfig } from "../types/auth";

/**
 * Mode for authentication initialization
 * - `host`: Host application (Shell) - handles OAuth redirects and publishes auth events
 * - `remote`: Remote application (Domino) - consumes auth events and performs SSO
 */
export type InitializationMode = "host" | "remote";

/**
 * Route type detection for quick cache checks
 * - `public`: Routes that don't require authentication (e.g., `/sign-in`)
 * - `protected`: Routes that require authentication
 * - `callback`: OAuth callback routes (e.g., `/auth/callback`)
 */
export type RouteType = "public" | "protected" | "callback";

/**
 * Configuration for MSAL initialization
 */
export interface InitConfig {
  /** MSAL instance to initialize */
  msalInstance: PublicClientApplication;

  /** Application name for logging and event publishing */
  appName: string;

  /** Function to get current auth configuration */
  getAuthConfig: () => AuthConfig;

  /** Enable debug logging */
  debug?: boolean;

  /** Custom route type detector (defaults to pathname-based detection) */
  detectRouteType?: () => RouteType;

  /**
   * Array of public route paths that don't require authentication
   * @default ['/sign-in', '/auth/callback']
   * @example
   * import { PUBLIC_ROUTES } from '@/config/routes';
   * { publicRoutes: PUBLIC_ROUTES }
   */
  publicRoutes?: readonly string[];
}

/**
 * State of the initialization process
 */
export interface InitializationState {
  /** Whether initialization is currently in progress */
  isInitializing: boolean;

  /** Whether initialization has completed (successfully or with error) */
  isInitialized: boolean;

  /** Error that occurred during initialization, if any */
  initError: Error | null;

  /** Whether quick cache check was performed (host mode only) */
  hasQuickCheck: boolean;
}

/**
 * Result of initialization process
 */
export interface InitializationResult {
  /** Whether initialization completed successfully */
  success: boolean;

  /** Error that occurred, if initialization failed */
  error?: Error;

  /** Whether quick cache check indicated no MSAL cache */
  quickCheckFailed?: boolean;
}

/**
 * Callback for initialization state changes
 */
export type InitializationCallback = (state: InitializationState) => void;
