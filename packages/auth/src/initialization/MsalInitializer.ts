/**
 * @module @one-portal/auth/initialization
 * @description Handles MSAL initialization for both host and remote applications
 */

import {
  EventType,
  InteractionStatus,
  EventMessageUtils,
  type EventMessage,
} from "@azure/msal-browser";
import { AuthErrorHandler } from "../errors";
import { publishAuthEvent } from "../events";
import {
  getLoginHint,
  safeRedirect,
  getAndClearReturnUrl,
  setReturnUrl,
} from "../utils";
import { isEmbeddedMode } from "../utils/environment";
import type {
  InitConfig,
  InitializationMode,
  InitializationState,
  InitializationResult,
  InitializationCallback,
  RouteType,
} from "./types";

/**
 * Create a route type detector based on public routes configuration
 */
function createDetectRouteType(
  publicRoutes: readonly string[],
): () => RouteType {
  return (): RouteType => {
    const path = window.location.pathname;

    // Check if path is in public routes
    if (publicRoutes.includes(path)) {
      // Determine if it's a callback route or general public route
      if (path.includes("/callback")) return "callback";
      return "public";
    }

    return "protected";
  };
}

/**
 * Manages MSAL initialization for host and remote applications.
 *
 * This class extracts initialization logic from UnifiedAuthProvider to:
 * - Separate concerns (initialization vs rendering)
 * - Improve testability
 * - Provide reusable initialization patterns
 *
 * ## Host Mode (Shell)
 * - Performs quick cache check for protected routes
 * - Handles OAuth redirect flow
 * - Detects existing sessions
 * - Publishes auth events for remote apps
 *
 * ## Remote Mode (Domino)
 * - Attempts SSO silent authentication
 * - Falls back to token acquisition if account exists
 * - Redirects to Shell if SSO fails (with visibility check)
 * - Optimized for lazy-loading (doesn't block render)
 *
 * @example
 * ```typescript
 * const initializer = new MsalInitializer({
 *   msalInstance,
 *   appName: 'Shell',
 *   getAuthConfig: () => authConfig,
 *   debug: true,
 * });
 *
 * // Subscribe to state changes
 * initializer.onStateChange((state) => {
 *   console.log('Initialization state:', state);
 * });
 *
 * // Initialize in host mode
 * const result = await initializer.initialize('host');
 * if (result.success) {
 *   console.log('Initialization complete');
 * }
 * ```
 */
export class MsalInitializer {
  private config: InitConfig;
  private state: InitializationState;
  private callbacks: Set<InitializationCallback>;
  private interactionStatus: InteractionStatus;
  private eventCallbackId: string | null;
  private publicRoutes: readonly string[];

  constructor(config: InitConfig) {
    this.config = config;
    this.publicRoutes = config.publicRoutes ?? ["/sign-in", "/auth/callback"];
    this.state = {
      isInitializing: false,
      isInitialized: false,
      initError: null,
      hasQuickCheck: false,
    };
    this.callbacks = new Set();
    this.interactionStatus = InteractionStatus.None;
    this.eventCallbackId = null;

    // Subscribe to MSAL events to track interaction status
    this.subscribeToMsalEvents();
  }

  /**
   * Get current initialization state
   */
  public getState(): Readonly<InitializationState> {
    return { ...this.state };
  }

  /**
   * Subscribe to initialization state changes
   * @returns Unsubscribe function
   */
  public onStateChange(callback: InitializationCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Clean up resources when component unmounts
   * Unsubscribes from MSAL events to prevent memory leaks
   */
  public unmount(): void {
    // Unsubscribe from MSAL events
    if (this.eventCallbackId) {
      this.config.msalInstance.removeEventCallback(this.eventCallbackId);
      this.eventCallbackId = null;
    }
  }

  /**
   * Subscribe to MSAL events to track interaction status
   * This replaces the sessionStorage check with official MSAL API
   */
  private subscribeToMsalEvents(): void {
    const { msalInstance, debug, appName } = this.config;

    this.eventCallbackId = msalInstance.addEventCallback(
      (message: EventMessage) => {
        // Update interaction status from event
        const status = EventMessageUtils.getInteractionStatusFromEvent(
          message,
          this.interactionStatus,
        );

        if (status !== null && status !== this.interactionStatus) {
          this.interactionStatus = status;

          if (debug) {
            console.info(
              `[${appName}] Interaction status changed:`,
              this.interactionStatus,
            );
          }
        }

        // Log significant auth events in debug mode
        if (debug) {
          if (
            message.eventType === EventType.LOGIN_START ||
            message.eventType === EventType.LOGIN_SUCCESS ||
            message.eventType === EventType.LOGIN_FAILURE ||
            message.eventType === EventType.ACQUIRE_TOKEN_START ||
            message.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            message.eventType === EventType.ACQUIRE_TOKEN_FAILURE
          ) {
            console.info(`[${appName}] MSAL Event:`, message.eventType);
          }
        }
      },
    );
  }

  /**
   * Initialize MSAL based on application mode
   *
   * This method is idempotent - it can be safely called multiple times.
   * Subsequent calls while initialization is in progress or after completion
   * will return immediately without starting a new initialization.
   *
   * This handles React Strict Mode's double-mounting behavior without
   * requiring workarounds like resetting the mounted flag.
   *
   * @param mode - 'host' for Shell, 'remote' for Domino
   * @param routeType - Optional route type (defaults to detected value)
   * @returns Initialization result
   */
  public async initialize(
    mode: InitializationMode,
    routeType?: RouteType,
  ): Promise<InitializationResult> {
    // Idempotent check: If already initialized or currently initializing, return early
    if (this.state.isInitialized) {
      const { debug, appName } = this.config;
      if (debug) {
        console.info(
          `[${appName}] Already initialized, skipping duplicate initialization`,
        );
      }
      return {
        success: !this.state.initError,
        error: this.state.initError ?? undefined,
      };
    }

    if (this.state.isInitializing) {
      const { debug, appName } = this.config;
      if (debug) {
        console.info(
          `[${appName}] Initialization already in progress, skipping duplicate call`,
        );
      }
      // Return a promise that will wait for the current initialization to complete
      // by checking state in a loop (this handles React Strict Mode double-mounting)
      return new Promise((resolve) => {
        let iterations = 0;
        const maxIterations = 200; // 10 seconds timeout (200 * 50ms)

        const checkInterval = setInterval(() => {
          if (!this.state.isInitializing) {
            clearInterval(checkInterval);
            resolve({
              success: !this.state.initError,
              error: this.state.initError ?? undefined,
            });
          } else if (++iterations >= maxIterations) {
            clearInterval(checkInterval);
            console.error(
              `[${appName}] Initialization timeout after 10 seconds`,
            );
            resolve({
              success: false,
              error: new Error("Initialization timeout after 10 seconds"),
            });
          }
        }, 50); // Check every 50ms
      });
    }

    // Perform quick cache check for host mode
    if (mode === "host") {
      const quickCheckResult = this.performQuickCacheCheck(routeType);
      if (quickCheckResult) {
        return quickCheckResult;
      }
    } else {
      // Remote mode doesn't need quick check
      this.updateState({ hasQuickCheck: true });
    }

    // Start initialization
    this.updateState({ isInitializing: true, initError: null });

    try {
      if (mode === "host") {
        await this.initializeHost();
      } else {
        await this.initializeRemote();
      }

      this.updateState({ isInitializing: false, isInitialized: true });
      return { success: true };
    } catch (error) {
      const initError =
        error instanceof Error ? error : new Error(String(error));
      this.updateState({
        isInitializing: false,
        isInitialized: true,
        initError,
      });
      return { success: false, error: initError };
    }
  }

  /**
   * Perform quick cache check for host mode on protected routes
   *
   * This optimization prevents unnecessary MSAL initialization if:
   * - App is in host mode
   * - Current route is protected
   * - No MSAL cache exists (user not logged in)
   *
   * @returns Result if quick check completed, null if full initialization needed
   */
  private performQuickCacheCheck(
    routeType?: RouteType,
  ): InitializationResult | null {
    const detectRouteType =
      this.config.detectRouteType || createDetectRouteType(this.publicRoutes);
    const detectedRouteType = routeType || detectRouteType();

    if (detectedRouteType === "protected") {
      // Check if MSAL cache exists
      const hasMsalCache = Object.keys(localStorage).some((key) =>
        key.startsWith("msal."),
      );

      if (!hasMsalCache) {
        // No cache, user needs to sign in - skip full initialization
        this.updateState({
          hasQuickCheck: true,
          isInitialized: true,
        });
        return { success: true, quickCheckFailed: true };
      }
    }

    this.updateState({ hasQuickCheck: true });
    return null; // Proceed with full initialization
  }

  /**
   * Initialize authentication for host app (Shell)
   *
   * Handles:
   * - OAuth redirect flow
   * - Existing session detection
   * - Auth event publishing
   * - Return URL navigation
   */
  private async initializeHost(): Promise<void> {
    const { msalInstance, appName, getAuthConfig, debug } = this.config;

    console.info(`[${appName}] initializeHost START`);

    try {
      await msalInstance.initialize();
      console.info(
        `[${appName}] MSAL initialized, calling handleRedirectPromise...`,
      );

      const response = await msalInstance.handleRedirectPromise();
      console.info(
        `[${appName}] handleRedirectPromise completed, response:`,
        response ? "HAS RESPONSE" : "NO RESPONSE",
      );

      if (response) {
        // User just completed OAuth redirect
        if (debug) {
          console.info(
            `[${appName}] Login successful:`,
            response.account.username,
          );
        }

        // CRITICAL: Set the active account BEFORE any redirects
        // This ensures route guards can see the authenticated state
        msalInstance.setActiveAccount(response.account);

        const loginHint = getLoginHint(response.account);
        const accountId = response.account.homeAccountId;

        publishAuthEvent("auth:signed-in", {
          loginHint,
          accountId,
          appName,
          clientId: getAuthConfig().clientId,
        });

        // Handle return URL redirect after successful authentication
        const returnUrl = getAndClearReturnUrl();
        if (returnUrl) {
          if (debug) {
            console.info(`[${appName}] Redirecting to returnUrl:`, returnUrl);
          }
          safeRedirect(returnUrl, "/");
        } else {
          if (debug) {
            console.info(
              `[${appName}] No returnUrl found, staying on current page`,
            );
          }
        }
        return;
      } else {
        // Check for existing session
        const accounts = msalInstance.getAllAccounts();

        if (accounts.length === 0) {
          if (debug) {
            console.info(
              `[${appName}] No accounts found, user needs to sign in`,
            );
          }
        } else {
          const account = accounts[0];
          if (!account) return; // Type guard

          msalInstance.setActiveAccount(account);

          publishAuthEvent("auth:signed-in", {
            loginHint: getLoginHint(account),
            accountId: account.homeAccountId,
            appName,
            clientId: getAuthConfig().clientId,
          });

          if (debug) {
            console.info(
              `[${appName}] Existing session found:`,
              account.username,
            );
          }
        }
      }
    } catch (error) {
      console.error(`[${appName}] Initialization failed:`, error);

      const processed = AuthErrorHandler.process(
        error,
        `${appName} initialization`,
      );
      AuthErrorHandler.show(processed);

      publishAuthEvent("auth:error", {
        error: {
          code: processed.code,
          message: processed.message,
          timestamp: Date.now(),
          appName,
        },
      });

      throw error;
    }
  }

  /**
   * Initialize authentication for remote app (Domino)
   *
   * Determines if app is embedded or standalone, then delegates to appropriate method.
   *
   * **Embedded Mode**: App runs inside Shell via Module Federation
   * - Uses SSO silent authentication only
   * - Redirects to Shell sign-in on failure
   *
   * **Standalone Mode**: App runs independently
   * - Tries SSO first, then falls back to interactive redirect
   * - Requires Azure AD OAuth redirect URI configuration
   */
  private async initializeRemote(): Promise<void> {
    const { getAuthConfig } = this.config;
    const embedded = isEmbeddedMode({ mode: getAuthConfig().mode });

    if (embedded) {
      await this.initializeRemoteEmbedded();
    } else {
      await this.initializeRemoteStandalone();
    }
  }

  /**
   * Initialize authentication for remote app in embedded mode
   *
   * **Embedded Mode Strategy: HYBRID (Proactive + Reactive)**
   *
   * Since Shell guards `/apps/*` routes, remotes are ALWAYS loaded after Shell
   * authentication completes. Therefore, this initialization uses a hybrid approach:
   *
   * **1. Proactive Token Acquisition (Primary Path)**
   * - Check if account exists in MSAL cache (it always will in embedded mode)
   * - Immediately attempt silent token acquisition for remote's scopes
   * - This handles the common case: Shell authenticated → user navigates to remote
   * - No waiting, no events needed for initial authentication
   *
   * **2. Reactive Event System (Secondary Path)**
   * - Listen for `auth:signed-in` events via BroadcastChannel
   * - Handles cross-app state synchronization (e.g., sign-out in one tab)
   * - Fallback if proactive token acquisition fails
   * - UnifiedAuthProvider's event handler performs SSO with loginHint from Shell
   *
   * **Why Both Are Needed:**
   * - Proactive: Optimizes the 99% case (remote loads after auth completes)
   * - Reactive: Ensures state consistency across multiple browser tabs/windows
   * - Reactive: Handles sign-out synchronization across Shell and remotes
   *
   * **What This DOES NOT Do:**
   * - Does NOT trigger interactive OAuth redirects (Shell handles that)
   * - Does NOT use iframes (avoids sandboxing issues)
   * - Does NOT wait for events before attempting authentication
   *
   * This hybrid approach provides optimal performance while maintaining robust
   * cross-app state synchronization.
   */
  private async initializeRemoteEmbedded(): Promise<void> {
    const { msalInstance, appName, debug } = this.config;

    try {
      // Initialize MSAL and handle any pending redirects
      await msalInstance.initialize();
      await msalInstance.handleRedirectPromise();

      if (debug) {
        console.info(
          `[${appName}] Embedded mode initialized. Checking for existing account...`,
        );
      }

      // PROACTIVE PATH: Check if we already have an account from Shell's authentication
      // In embedded mode, this will ALWAYS be true since Shell guards /apps/* routes
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        if (account) {
          msalInstance.setActiveAccount(account);
          if (debug) {
            console.info(
              `[${appName}] Found existing account:`,
              account.username,
            );
          }

          // Proactively acquire tokens for this remote app's specific scopes
          // This is the PRIMARY authentication path for embedded remotes
          try {
            const { getAuthConfig } = this.config;
            await msalInstance.acquireTokenSilent({
              scopes: getAuthConfig().scopes,
              account,
              redirectUri: getAuthConfig().redirectUri,
            });

            if (debug) {
              console.info(
                `[${appName}] Proactively acquired tokens for remote scopes`,
              );
            }
          } catch (error) {
            // If token acquisition fails, the reactive path will handle it
            // when Shell re-publishes events or user interacts
            if (debug) {
              console.warn(
                `[${appName}] Proactive token acquisition failed, will rely on event system:`,
                error,
              );
            }
          }
        }
      }

      // REACTIVE PATH: Event system for cross-app state synchronization
      // Authentication will also be triggered by:
      // 1. Shell publishing auth:signed-in event (for initial sign-in in other tabs)
      // 2. Shell publishing auth:signed-out event (for sign-out synchronization)
      // 3. UnifiedAuthProvider's event subscription handler (calls ssoSilent with loginHint)
    } catch (error) {
      console.error(`[${appName}] Embedded initialization failed:`, error);
      // Don't throw - allow initialization to complete
    }
  }

  /**
   * Initialize authentication for remote app in standalone mode
   *
   * Handles:
   * - OAuth redirect promise (returning from Azure AD)
   * - SSO silent authentication attempt
   * - Interactive redirect on SSO failure
   *
   * **Security Note**: This method ensures standalone remotes always require authentication
   */
  private async initializeRemoteStandalone(): Promise<void> {
    const { msalInstance, appName, getAuthConfig, debug } = this.config;

    console.info(`[${appName}] Starting standalone mode initialization...`);

    try {
      console.info(`[${appName}] Initializing MSAL instance...`);
      await msalInstance.initialize();

      console.info(`[${appName}] Handling redirect promise...`);
      const response = await msalInstance.handleRedirectPromise();

      // Check if returning from OAuth redirect
      if (response) {
        console.info(
          `[${appName}] Standalone login successful:`,
          response.account.username,
        );
        msalInstance.setActiveAccount(response.account);

        const loginHint = getLoginHint(response.account);
        const accountId = response.account.homeAccountId;

        publishAuthEvent("auth:signed-in", {
          loginHint,
          accountId,
          appName,
          clientId: getAuthConfig().clientId,
        });

        // Handle return URL redirect after successful authentication
        const returnUrl = getAndClearReturnUrl();
        if (returnUrl) {
          if (debug) {
            console.info(`[${appName}] Redirecting to returnUrl:`, returnUrl);
          }
          safeRedirect(returnUrl, "/");
        } else {
          if (debug) {
            console.info(
              `[${appName}] No returnUrl found, staying on current page`,
            );
          }
        }
        return;
      }

      console.info(
        `[${appName}] No redirect response, checking for existing accounts...`,
      );

      // Try SSO silent authentication
      const accounts = msalInstance.getAllAccounts();
      console.info(`[${appName}] Found ${accounts.length} account(s) in cache`);

      if (accounts.length > 0) {
        const account = accounts[0];
        if (!account) return; // Type guard

        console.info(`[${appName}] Setting active account:`, account.username);
        msalInstance.setActiveAccount(account);

        console.info(`[${appName}] Attempting to acquire token silently...`);
        try {
          await msalInstance.acquireTokenSilent({
            scopes: getAuthConfig().scopes,
            account,
            redirectUri: getAuthConfig().redirectUri,
          });

          console.info(`[${appName}] Standalone token acquired silently`);
          return;
        } catch (_error: unknown) {
          console.warn(`[${appName}] Token acquisition failed, trying SSO...`);
          // Token refresh failed, try SSO
          try {
            const loginHint = getLoginHint(account);

            // Skip SSO if we don't have a valid loginHint
            if (!loginHint || loginHint === account.homeAccountId) {
              console.warn(
                `[${appName}] Cannot perform SSO without valid username/email. ` +
                  `Check Azure AD optional claims configuration.`,
              );
              throw new Error("SSO requires valid user hint");
            }

            const ssoResult = await msalInstance.ssoSilent({
              scopes: getAuthConfig().scopes,
              loginHint,
              redirectUri: getAuthConfig().redirectUri,
            });
            msalInstance.setActiveAccount(ssoResult.account);

            console.info(`[${appName}] Standalone SSO successful`);
            return;
          } catch (_ssoError) {
            console.warn(
              `[${appName}] SSO failed, will trigger interactive login`,
            );
            // Fall through to interactive login
          }
        }
      } else {
        console.info(`[${appName}] No cached accounts found`);
      }

      // No existing session or SSO failed - trigger interactive login
      // Check if interaction is already in progress (prevents duplicate redirects in React Strict Mode)
      if (
        this.interactionStatus !== InteractionStatus.None &&
        msalInstance.getActiveAccount() === null
      ) {
        console.warn(
          `[${appName}] Interaction already in progress (status: ${this.interactionStatus}), skipping loginRedirect()`,
        );
        return;
      }

      // Save current URL as returnUrl if it's not a public route
      // This handles direct navigation to protected routes (e.g., /dashboard/events?filter=active)
      const currentPath = window.location.pathname;
      const isPublicRoute = this.publicRoutes.includes(currentPath);

      if (!isPublicRoute) {
        // Preserve full URL including query params and hash
        const fullUrl =
          currentPath + window.location.search + window.location.hash;
        setReturnUrl(fullUrl);
        console.info(
          `[${appName}] Saved returnUrl for post-auth redirect:`,
          fullUrl,
        );
      }

      console.info(
        `[${appName}] Triggering interactive login redirect to Azure AD...`,
      );
      console.info(`[${appName}] Redirect URI:`, getAuthConfig().redirectUri);
      console.info(`[${appName}] Scopes:`, getAuthConfig().scopes);

      await msalInstance.loginRedirect({
        scopes: getAuthConfig().scopes,
        prompt: "select_account",
      });

      console.info(`[${appName}] loginRedirect() called successfully`);
    } catch (error) {
      console.error(`[${appName}] Standalone initialization failed:`, error);
      const processed = AuthErrorHandler.process(
        error,
        `${appName} initialization`,
      );
      AuthErrorHandler.show(processed);
      throw error;
    }
  }

  /**
   * Update internal state and notify subscribers
   */
  private updateState(updates: Partial<InitializationState>): void {
    this.state = { ...this.state, ...updates };
    this.callbacks.forEach((callback) => callback(this.state));
  }
}
