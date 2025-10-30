import type { AccountInfo } from "@azure/msal-browser";
import type { AppMode } from "../utils/environment";

export interface AuthConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri?: string;
  scopes: string[];
  appName: string;
  /**
   * Application mode for embedded vs standalone detection
   *
   * - `embedded`: Force embedded mode (app runs within Shell)
   * - `standalone`: Force standalone mode (app runs independently)
   * - `auto`: Auto-detect based on URL path (default)
   *
   * @default 'auto'
   */
  mode?: AppMode;
}

/**
 * User profile information extracted from ID token claims
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  groups?: string[];
  tenantId: string;
}

/**
 * Authentication state exposed via React context/hooks
 */
export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  account: AccountInfo | null;
  userProfile: UserProfile | null;
  error: AuthError | null;
}

/**
 * Authentication error with categorization for user-facing messages and retry logic
 */
export interface AuthError {
  code: string;
  message: string;
  subError?: string;
  isActionable: boolean;
  retryAction?: "login" | "refresh" | "contact-admin";
  timestamp: Date;
}

/**
 * Auth hook return type - consistent interface for useAuth() across all apps
 */
export interface UseAuthReturn {
  state: AuthState;
  login: (scopes: string[]) => Promise<void>; // Required - pass getAuthConfig().scopes
  logout: (postLogoutRedirectUri?: string) => Promise<void>;
  acquireToken: (scopes: string[]) => Promise<string | null>;
  clearError: () => void;
}

export interface TokenRequest {
  scopes: string[];
  forceRefresh?: boolean;
  account?: AccountInfo;
  claims?: string;
}

export interface RouteGuardConfig {
  requiresAuth: boolean;
  requiredScopes?: string[];
  redirectTo?: string;
  authorize?: (account: AccountInfo) => boolean | Promise<boolean>;
}

export interface AuthTelemetryEvent {
  type:
    | "login"
    | "logout"
    | "token-acquired"
    | "token-refresh"
    | "error"
    | "silent-sso";
  appName: string;
  clientId: string;
  success: boolean;
  durationMs?: number;
  error?: Pick<AuthError, "code" | "message">;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type MsalInteractionType = "redirect" | "popup" | "silent" | "none";

export interface AuthProviderProps {
  config: AuthConfig;
  children: React.ReactNode;
  onTelemetry?: (event: AuthTelemetryEvent) => void;
}

/**
 * Type guard for MSAL errors
 */
export function isMsalError(
  error: unknown,
): error is { errorCode: string; errorMessage: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "errorCode" in error &&
    "errorMessage" in error
  );
}

/**
 * Type guard for interaction required errors
 */
export function isInteractionRequiredError(error: unknown): boolean {
  if (!isMsalError(error)) return false;
  return [
    "interaction_required",
    "consent_required",
    "login_required",
  ].includes(error.errorCode);
}
