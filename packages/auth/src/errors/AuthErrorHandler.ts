import {
  AuthError,
  InteractionRequiredAuthError,
  BrowserAuthError,
} from "@azure/msal-browser";
import { toast } from "@one-portal/ui";
import type { AuthError as AuthErrorType } from "../types/auth";

/**
 * Comprehensive processed error containing all error details and UI guidance
 */
export interface ProcessedAuthError extends AuthErrorType {
  // UI Display properties (from FormattedAuthError)
  title: string;
  description: string;
  severity: "error" | "warning" | "info";
  duration?: number;

  // Action properties
  isRetryable: boolean;
  actionLabel?: string;

  // Classification properties
  isTransient: boolean;
}

/**
 * Unified authentication error handler
 *
 * Consolidates all error processing logic:
 * - MSAL error type detection
 * - Error code mapping and classification
 * - User-friendly message generation
 * - Retry action determination
 * - Toast display with proper severity
 *
 * Replaces the previous 3-layer error handling:
 * - formatAuthError() [DEPRECATED]
 * - parseAuthError() [DEPRECATED]
 * - getUserFriendlyErrorMessage() [DEPRECATED]
 *
 * @example
 * ```typescript
 * try {
 *   await msalInstance.loginPopup();
 * } catch (error) {
 *   const processed = AuthErrorHandler.process(error, 'Login');
 *   AuthErrorHandler.show(processed);
 * }
 * ```
 */
export class AuthErrorHandler {
  /**
   * Error codes that indicate user should retry with interactive login
   */
  private static readonly INTERACTION_REQUIRED_CODES = [
    "interaction_required",
    "consent_required",
    "login_required",
    "claims_challenge",
  ];

  /**
   * Error codes that are transient and may succeed on retry
   */
  private static readonly TRANSIENT_ERROR_CODES = [
    "network_error",
    "timeout",
    "service_unavailable",
    "temporarily_unavailable",
  ];

  /**
   * Process any error into a comprehensive error object with UI guidance
   *
   * @param error - The error to process (MSAL error, Error, or unknown)
   * @param context - Optional context string to prepend to error message
   * @returns Processed error with all display and action properties
   */
  static process(error: unknown, context?: string): ProcessedAuthError {
    const timestamp = new Date();

    // Handle InteractionRequiredAuthError (most specific MSAL error type)
    if (error instanceof InteractionRequiredAuthError) {
      return {
        code: error.errorCode,
        message: context
          ? `${context}: ${error.errorMessage}`
          : error.errorMessage,
        subError: error.subError,
        isActionable: true,
        retryAction: "login",
        timestamp,
        title: "Authentication Required",
        description:
          "Your session has expired. Please sign in again to continue.",
        severity: "warning",
        duration: 5000,
        isRetryable: false, // User must sign in, can't just retry
        isTransient: false,
      };
    }

    // Handle BrowserAuthError (user interaction errors)
    if (error instanceof BrowserAuthError) {
      return this.processBrowserAuthError(error, context, timestamp);
    }

    // Handle generic MSAL AuthError
    if (error instanceof AuthError) {
      return {
        code: error.errorCode,
        message: context
          ? `${context}: ${error.errorMessage}`
          : error.errorMessage,
        subError: error.subError,
        isActionable: this.INTERACTION_REQUIRED_CODES.includes(error.errorCode),
        retryAction: this.getRetryAction(error.errorCode),
        timestamp,
        title: "Authentication Error",
        description:
          error.errorMessage ||
          "An authentication error occurred. Please try again.",
        severity: "error",
        duration: 6000,
        isRetryable: true,
        actionLabel: "Retry",
        isTransient: this.TRANSIENT_ERROR_CODES.includes(error.errorCode),
      };
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return this.processGenericError(error, context, timestamp);
    }

    // Handle completely unknown error types
    return {
      code: "unknown_error",
      message: context || "An unknown error occurred",
      isActionable: false,
      timestamp,
      title: "Unexpected Error",
      description:
        "An unexpected error occurred during authentication. Please try again or contact support if the issue persists.",
      severity: "error",
      duration: 6000,
      isRetryable: true,
      actionLabel: "Retry",
      isTransient: false,
    };
  }

  /**
   * Process BrowserAuthError with specific error code handling
   */
  private static processBrowserAuthError(
    error: BrowserAuthError,
    context: string | undefined,
    timestamp: Date,
  ): ProcessedAuthError {
    const message = context
      ? `${context}: ${error.errorMessage}`
      : error.errorMessage;
    const baseError = {
      code: error.errorCode,
      message,
      subError: error.subError,
      timestamp,
    };

    switch (error.errorCode) {
      case "user_cancelled":
        return {
          ...baseError,
          isActionable: false,
          retryAction: undefined,
          title: "Sign-In Cancelled",
          description: "You can try signing in again when ready.",
          severity: "info",
          duration: 4000,
          isRetryable: true,
          actionLabel: "Try Again",
          isTransient: false,
        };

      case "interaction_in_progress":
        return {
          ...baseError,
          isActionable: false,
          retryAction: undefined,
          title: "Sign-In In Progress",
          description: "Please complete the current sign-in process.",
          severity: "info",
          duration: 3000,
          isRetryable: false,
          isTransient: false,
        };

      case "popup_window_error":
        return {
          ...baseError,
          isActionable: false,
          retryAction: undefined,
          title: "Sign-In Window Closed",
          description: "The sign-in window was closed. Please try again.",
          severity: "warning",
          duration: 4000,
          isRetryable: true,
          actionLabel: "Try Again",
          isTransient: false,
        };

      default:
        return {
          ...baseError,
          isActionable: this.INTERACTION_REQUIRED_CODES.includes(
            error.errorCode,
          ),
          retryAction: this.getRetryAction(error.errorCode),
          title: "Authentication Error",
          description:
            error.errorMessage ||
            "Unable to complete authentication. Please try again.",
          severity: "error",
          duration: 6000,
          isRetryable: true,
          actionLabel: "Retry",
          isTransient: this.TRANSIENT_ERROR_CODES.includes(error.errorCode),
        };
    }
  }

  /**
   * Process generic Error objects with pattern matching
   */
  private static processGenericError(
    error: Error,
    context: string | undefined,
    timestamp: Date,
  ): ProcessedAuthError {
    const message = context ? `${context}: ${error.message}` : error.message;
    const errorMessage = error.message.toLowerCase();
    const baseError = {
      message,
      timestamp,
    };

    // Network-related errors
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("connection")
    ) {
      return {
        ...baseError,
        code: "network_error",
        isActionable: false,
        retryAction: "refresh",
        title: "Network Error",
        description:
          "Unable to connect to authentication service. Please check your internet connection and try again.",
        severity: "error",
        duration: 6000,
        isRetryable: true,
        actionLabel: "Retry",
        isTransient: true,
      };
    }

    // CORS configuration errors
    if (errorMessage.includes("cors")) {
      return {
        ...baseError,
        code: "cors_error",
        isActionable: false,
        retryAction: "contact-admin",
        title: "Configuration Error",
        description:
          "Authentication service configuration issue. Please contact support.",
        severity: "error",
        duration: 8000,
        isRetryable: false,
        isTransient: false,
      };
    }

    // Generic error fallback
    return {
      ...baseError,
      code: "unknown_error",
      isActionable: false,
      retryAction: undefined,
      title: "Unexpected Error",
      description:
        error.message || "An unexpected error occurred. Please try again.",
      severity: "error",
      duration: 6000,
      isRetryable: true,
      actionLabel: "Retry",
      isTransient: false,
    };
  }

  /**
   * Determine suggested retry action based on error code
   */
  private static getRetryAction(code: string): AuthErrorType["retryAction"] {
    if (this.INTERACTION_REQUIRED_CODES.includes(code)) {
      return "login";
    }
    if (this.TRANSIENT_ERROR_CODES.includes(code)) {
      return "refresh";
    }
    if (code.includes("admin") || code.includes("consent")) {
      return "contact-admin";
    }
    return undefined;
  }

  /**
   * Display error using toast notification
   *
   * @param error - Processed error or raw error (will be processed automatically)
   * @param options - Display and interaction options
   */
  static show(
    error: ProcessedAuthError | unknown,
    options?: {
      onRetry?: () => void;
      announceToScreenReader?: (message: string) => void;
    },
  ): void {
    // Process error if it's not already processed
    const processed = this.isProcessedError(error)
      ? error
      : this.process(error);

    const toastOptions = {
      description: processed.description,
      duration: processed.duration,
      ...(processed.isRetryable &&
        options?.onRetry && {
          action: {
            label: processed.actionLabel || "Retry",
            onClick: options.onRetry,
          },
        }),
    };

    // Display toast based on severity level
    switch (processed.severity) {
      case "error":
        toast.error(processed.title, toastOptions);
        break;
      case "warning":
        toast.warning(processed.title, toastOptions);
        break;
      case "info":
        toast.info(processed.title, toastOptions);
        break;
    }

    // Accessibility announcement
    if (options?.announceToScreenReader) {
      const announcement = `${processed.title}. ${processed.description}`;
      options.announceToScreenReader(announcement);
    }

    // Development logging
    if (import.meta.env.DEV) {
      console.error("[Auth Error]", {
        title: processed.title,
        description: processed.description,
        errorCode: processed.code,
        severity: processed.severity,
        isRetryable: processed.isRetryable,
        isTransient: processed.isTransient,
        retryAction: processed.retryAction,
        timestamp: processed.timestamp.toISOString(),
      });
    }
  }

  /**
   * Show promise-based auth operation with loading/success/error states
   *
   * @param promise - Authentication promise to track
   * @param messages - Custom messages for each state
   */
  static showPromise<T>(
    promise: Promise<T>,
    messages?: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    },
  ): void {
    toast.promise(promise, {
      loading: messages?.loading || "Authenticating...",
      success: messages?.success || "Authentication successful",
      error: (error: unknown) => {
        if (typeof messages?.error === "function") {
          return messages.error(error);
        }
        if (typeof messages?.error === "string") {
          return messages.error;
        }
        const processed = this.process(error);
        return processed.title;
      },
    });
  }

  /**
   * Type guard to check if error is already processed
   */
  private static isProcessedError(error: unknown): error is ProcessedAuthError {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "title" in error &&
      "description" in error &&
      "severity" in error
    );
  }

  /**
   * Check if error requires user interaction (sign-in)
   */
  static isInteractionRequired(error: unknown): boolean {
    if (error instanceof InteractionRequiredAuthError) {
      return true;
    }
    if (error instanceof AuthError) {
      return this.INTERACTION_REQUIRED_CODES.includes(error.errorCode);
    }
    const processed = this.process(error);
    return processed.isActionable && processed.retryAction === "login";
  }

  /**
   * Check if error is transient (safe to retry automatically)
   */
  static isTransient(error: unknown): boolean {
    if (error instanceof AuthError) {
      return this.TRANSIENT_ERROR_CODES.includes(error.errorCode);
    }
    const processed = this.process(error);
    return processed.isTransient;
  }

  /**
   * Get user-friendly message for error
   * Convenience method for cases where only message is needed
   */
  static getMessage(error: unknown): string {
    const processed = this.process(error);
    return processed.description;
  }
}

/**
 * MSAL error codes reference:
 *
 * InteractionRequiredAuthError:
 * - interaction_required: User interaction needed
 * - login_required: User needs to sign in
 * - consent_required: User needs to consent to permissions
 * - claims_challenge: Additional claims required
 *
 * BrowserAuthError:
 * - user_cancelled: User closed sign-in window/cancelled
 * - interaction_in_progress: Another auth operation is running
 * - popup_window_error: Popup window failed to open or was closed
 * - empty_window_error: Redirect window returned empty
 * - monitor_window_timeout: Window monitoring timed out
 *
 * Network/Client Errors:
 * - network_error: Network request failed
 * - timeout: Request timed out
 * - cors: CORS policy blocked request
 * - invalid_grant: Invalid token/credentials
 * - service_unavailable: Auth service temporarily down
 */
