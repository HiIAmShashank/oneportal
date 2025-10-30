import { useEffect, useState, useRef, type ReactNode } from "react";
import { MsalProvider } from "@azure/msal-react";
import type { EventMessage } from "@azure/msal-browser";
import { EventType as MsalEventType } from "@azure/msal-browser";
import { AuthLoadingSpinner } from "@one-portal/ui";
import {
  publishAuthEvent,
  subscribeToAuthEvents,
  type AuthEvent,
} from "../events";
import { AuthErrorHandler } from "../errors";
import { MsalInitializer } from "../initialization";
import { isEmbeddedMode } from "../utils/environment";
import { safeRedirect, clearAuthStorage } from "../utils";
import type { UnifiedAuthProviderProps, RouteType } from "./types";

/**
 * Unified authentication provider for One Portal
 *
 * Replaces ShellMSALProvider and DominoMSALProvider with a single,
 * mode-aware provider that handles both host and remote scenarios.
 *
 * **Key Features:**
 * - **Flicker-free initialization**: Quick cache check before showing spinner
 * - **Lazy-load compatible**: Works with Module Federation preloading
 * - **Visibility-aware**: Prevents redirects when route is preloaded
 * - **Event-driven**: Publishes/subscribes to cross-app auth events
 * - **Type-safe**: Uses strict event typing with discriminated unions
 *
 * @example Host mode (Shell app)
 * ```tsx
 * <UnifiedAuthProvider
 *   msalInstance={msalInstance}
 *   mode="host"
 *   appName="shell"
 *   getAuthConfig={getAuthConfig}
 * >
 *   <App />
 * </UnifiedAuthProvider>
 * ```
 *
 * @example Remote mode (Domino app)
 * ```tsx
 * <UnifiedAuthProvider
 *   msalInstance={msalInstance}
 *   mode="remote"
 *   appName="domino"
 *   getAuthConfig={getAuthConfig}
 * >
 *   <App />
 * </UnifiedAuthProvider>
 * ```
 */
export function UnifiedAuthProvider({
  children,
  msalInstance,
  mode = "host",
  appName,
  routeType,
  detectRouteType,
  getAuthConfig,
  debug = false,
  publicRoutes,
}: UnifiedAuthProviderProps): ReactNode {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializerRef = useRef<MsalInitializer | null>(null);

  // Determine app name
  const effectiveAppName = appName ?? (mode === "host" ? "shell" : "remote");

  // Detect route type
  const detectedRouteType: RouteType =
    routeType ?? detectRouteType?.() ?? defaultDetectRouteType();

  // Initialize MSAL using MsalInitializer
  useEffect(() => {
    // Create initializer if needed
    if (!initializerRef.current) {
      initializerRef.current = new MsalInitializer({
        msalInstance,
        appName: effectiveAppName,
        getAuthConfig,
        debug,
        detectRouteType,
        publicRoutes,
      });

      // Subscribe to initialization state changes
      initializerRef.current.onStateChange((state) => {
        if (state.isInitialized) {
          setIsInitialized(true);
        }
      });
    }

    // Run initialization
    const initializer = initializerRef.current;
    initializer.initialize(mode, detectedRouteType);

    return () => {
      initializer.unmount();
    };
  }, [
    mode,
    detectedRouteType,
    msalInstance,
    effectiveAppName,
    getAuthConfig,
    debug,
    detectRouteType,
    publicRoutes,
  ]);

  // Event subscription (remote mode only)
  useEffect(() => {
    if (mode !== "remote") return;

    const unsubscribe = subscribeToAuthEvents(async (event) => {
      if (event.type === "auth:signed-in") {
        const signInEvent = event as AuthEvent<"auth:signed-in">;
        const loginHint = signInEvent.payload.loginHint;

        if (debug)
          console.info(
            `[${effectiveAppName}] Received auth:signed-in event, attempting SSO`,
          );

        try {
          const ssoResult = await msalInstance.ssoSilent({
            scopes: getAuthConfig().scopes,
            loginHint,
            redirectUri: getAuthConfig().redirectUri,
          });
          msalInstance.setActiveAccount(ssoResult.account);

          if (debug) console.info(`[${effectiveAppName}] SSO successful`);
        } catch (error: unknown) {
          if (AuthErrorHandler.isInteractionRequired(error)) {
            const embedded = isEmbeddedMode({ mode: getAuthConfig().mode });

            if (embedded) {
              if (debug)
                console.info(
                  `[${effectiveAppName}] Interaction required, redirecting to Shell`,
                );
              const returnUrl = encodeURIComponent(window.location.href);
              safeRedirect(`/?returnUrl=${returnUrl}`, "/");
            } else if (import.meta.env.DEV) {
              console.info(
                `[${effectiveAppName}] Interaction required in standalone mode, skipping redirect`,
              );
              const processed = AuthErrorHandler.process(error, "SSO sign-in");
              AuthErrorHandler.show(processed);
            }
          } else {
            console.error(`[${effectiveAppName}] SSO failed:`, error);
            const processed = AuthErrorHandler.process(error, "SSO sign-in");
            AuthErrorHandler.show(processed);
          }
        }
      } else if (event.type === "auth:signed-out") {
        if (debug)
          console.info(
            `[${effectiveAppName}] Received auth:signed-out event, clearing cache`,
          );

        msalInstance.setActiveAccount(null);
        clearAuthStorage();
      }
    });

    return unsubscribe;
  }, [mode, msalInstance, getAuthConfig, effectiveAppName, debug]);

  // MSAL event callbacks (logout handling)
  useEffect(() => {
    const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === MsalEventType.LOGOUT_SUCCESS) {
        if (debug) console.info(`[${effectiveAppName}] Logout success`);

        if (mode === "host") {
          publishAuthEvent("auth:signed-out", {
            appName: effectiveAppName,
            clientId: getAuthConfig().clientId,
          });
        }
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, [msalInstance, mode, effectiveAppName, getAuthConfig, debug]);

  // Render loading spinner or children
  if (!isInitialized && detectedRouteType !== "public") {
    return (
      <AuthLoadingSpinner
        title="Initializing authentication..."
        description="Please wait while we set up your session."
      />
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

/**
 * Default route type detection based on pathname
 */
function defaultDetectRouteType(): RouteType {
  const path = window.location.pathname;
  if (path === "/sign-in") return "public";
  if (path === "/auth/callback") return "callback";
  return "protected";
}
