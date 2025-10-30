# @one-portal/auth

Unified authentication package for One Portal applications, providing SSO, event-based communication, and flicker-free authentication for both host and remote Module Federation apps.

## Features

**Unified Authentication Provider**

- Single `UnifiedAuthProvider` for host and remote apps
- Supports both OAuth redirect (host) and SSO silent (remote) flows
- Flicker-free initialization with MSAL cache detection
- Lazy-load optimized for Module Federation

**MSAL Instance Factory**

- Factory pattern for MSAL instance creation
- Eliminates duplicate initialization code
- Environment-based configuration

**Unified Error Handling**

- `AuthErrorHandler` class consolidates error processing
- User-friendly error messages
- Toast notifications with retry actions
- Transient vs permanent error detection

**Type-Safe Event System**

- BroadcastChannel-based cross-app communication
- Discriminated unions for compile-time type safety
- Event replay for lazy-loaded remotes

**Route Guards**

- Protect routes with authentication requirements
- OAuth redirect for unauthenticated users
- Return URL handling

## Installation

This package is part of the One Portal monorepo and is already installed. Import from:

```tsx
import { UnifiedAuthProvider } from "@one-portal/auth/providers";
import { AuthErrorHandler } from "@one-portal/auth";
import { createMsalInstanceWithConfig } from "@one-portal/auth";
import {
  publishAuthEvent,
  subscribeToAuthEvents,
} from "@one-portal/auth/events";
```

## Quick Start

### For Host Apps (Shell)

```tsx
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UnifiedAuthProvider } from "@one-portal/auth/providers";
import { msalInstance, getAuthConfig } from "./auth/msalInstance";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UnifiedAuthProvider
      msalInstance={msalInstance}
      getAuthConfig={getAuthConfig}
      mode="host"
      appName="shell"
      debug={import.meta.env.DEV}
    >
      <RouterProvider router={router} />
    </UnifiedAuthProvider>
  </StrictMode>,
);
```

```tsx
// auth/msalInstance.ts
import { createMsalInstanceWithConfig } from "@one-portal/auth";

const { instance, authConfig } = createMsalInstanceWithConfig("shell");

export const msalInstance = instance;
export const getAuthConfig = () => authConfig;
```

### For Remote Apps (Module Federation)

```tsx
// bootstrap.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UnifiedAuthProvider } from "@one-portal/auth/providers";
import { msalInstance, getAuthConfig } from "./auth/msalInstance";
import App from "./App";

export const mount = (container: HTMLElement) => {
  createRoot(container).render(
    <StrictMode>
      <UnifiedAuthProvider
        msalInstance={msalInstance}
        getAuthConfig={getAuthConfig}
        mode="remote"
        appName="domino"
        debug={import.meta.env.DEV}
      >
        <App />
      </UnifiedAuthProvider>
    </StrictMode>,
  );
};
```

```tsx
// auth/msalInstance.ts
import { createMsalInstanceWithConfig } from "@one-portal/auth";

const { instance, authConfig } = createMsalInstanceWithConfig("domino");

export const msalInstance = instance;
export const getAuthConfig = () => authConfig;
```

## Core Concepts

### Authentication Modes

#### Host Mode

Used by the Shell app (main host application):

- Handles OAuth redirect flow
- Publishes authentication events
- Manages OAuth callbacks
- Shows full loading spinner during initial auth

#### Remote Mode

Used by lazy-loaded remote apps (Domino, etc.):

- Performs SSO silent authentication
- Subscribes to Shell's auth events
- Detects embedded vs standalone mode
- Optimized for lazy-loading (no blocking)

### Flicker Prevention

The `UnifiedAuthProvider` prevents UI flickering during authentication:

```tsx
// Quick MSAL cache check before showing spinner
const hasMsalCache = Object.keys(localStorage).some((key) =>
  key.startsWith("msal."),
);

if (hasMsalCache) {
  // User likely has session - render immediately
  setHasQuickCheck(true);
  setIsInitialized(true);
} else {
  // No cache - show spinner during initialization
  await initializeAuth();
}
```

**Result:** Users with existing sessions see instant rendering, while new users see a loading spinner.

### Event System

Authentication events enable cross-app communication:

```tsx
// Publishing (Host app)
import { publishAuthEvent } from "@one-portal/auth/events";

publishAuthEvent("auth:signed-in", {
  loginHint: "user@example.com",
  accountId: "account-123",
  appName: "shell",
  clientId: "client-id",
});
```

```tsx
// Subscribing (Remote app)
import { subscribeToAuthEvents, type AuthEvent } from "@one-portal/auth/events";

const unsubscribe = subscribeToAuthEvents((event) => {
  if (event.type === "auth:signed-in") {
    const signInEvent = event as AuthEvent<"auth:signed-in">;
    console.log("User signed in:", signInEvent.payload.loginHint);
  }
});

// Cleanup
return unsubscribe;
```

**Event Types:**

- `auth:signed-in` - User authenticated successfully
- `auth:signed-out` - User signed out
- `auth:token-acquired` - Access token acquired
- `auth:account-changed` - Active account changed
- `auth:error` - Authentication error occurred

### Error Handling

```tsx
import { AuthErrorHandler } from "@one-portal/auth";

// Process error
const processed = AuthErrorHandler.process(error, "Sign-in");

// Show toast notification
AuthErrorHandler.show(processed, {
  severity: "error",
  showRetry: true,
  onRetry: () => handleRetry(),
});

// Or use promise wrapper for automatic handling
const token = await AuthErrorHandler.showPromise(
  acquireToken(instance, ["User.Read"]),
  { loadingMessage: "Acquiring token..." },
);

// Check error types
if (AuthErrorHandler.isInteractionRequired(error)) {
  // User needs to sign in
}

if (AuthErrorHandler.isTransient(error)) {
  // Retry transient errors
}
```

### Route Guards

```tsx
import { createRouteGuard } from "@one-portal/auth";
import { msalInstance } from "./auth/msalInstance";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: createRouteGuard(msalInstance, {
    scopes: ["openid", "profile", "email"],
    redirectPath: "/sign-in",
  }),
});
```

## API Reference

### UnifiedAuthProvider

```tsx
interface UnifiedAuthProviderProps {
  /** MSAL instance */
  msalInstance: PublicClientApplication;

  /** Function to get auth config */
  getAuthConfig: () => AuthConfig;

  /** App mode: 'host' for Shell, 'remote' for lazy-loaded apps */
  mode: "host" | "remote";

  /** App name for logging and events */
  appName?: string;

  /** Route type override */
  routeType?: "public" | "protected" | "callback";

  /** Custom route type detection */
  detectRouteType?: () => RouteType;

  /** Enable debug logging */
  debug?: boolean;

  /** Children to render */
  children: ReactNode;
}
```

**Key Behaviors:**

**Host Mode:**

- Handles OAuth redirect promise
- Publishes `auth:signed-in` event on successful auth
- Shows loading spinner during initial authentication
- Handles return URL from query params

**Remote Mode:**

- Subscribes to `auth:signed-in` events from Shell
- Performs SSO silent authentication
- Checks document visibility (prevents redirects during preload)
- Detects embedded vs standalone mode
- Clears session on `auth:signed-out` event

### AuthErrorHandler

```tsx
class AuthErrorHandler {
  /** Process error and return comprehensive error object */
  static process(error: unknown, context?: string): ProcessedAuthError;

  /** Show error toast notification */
  static show(
    error: ProcessedAuthError | unknown,
    options?: ShowErrorOptions,
  ): void;

  /** Promise wrapper with loading state and error handling */
  static showPromise<T>(
    promise: Promise<T>,
    options?: ShowPromiseOptions,
  ): Promise<T>;

  /** Check if error requires user interaction */
  static isInteractionRequired(error: unknown): boolean;

  /** Check if error is transient (retry-able) */
  static isTransient(error: unknown): boolean;

  /** Get user-friendly error message */
  static getMessage(error: unknown): string;
}
```

### Factory Functions

```tsx
/** Create MSAL instance with app-specific config */
function createMsalInstance(appName: string): PublicClientApplication;

/** Create MSAL instance and return config */
function createMsalInstanceWithConfig(appName: string): {
  instance: PublicClientApplication;
  authConfig: AuthConfig;
};
```

### Event Functions

```tsx
/** Publish authentication event */
function publishAuthEvent<T extends AuthEventType>(
  type: T,
  payload: AuthEventData[T],
): void;

/** Subscribe to authentication events */
function subscribeToAuthEvents(
  handler: (event: AuthEvent<AuthEventType>) => void,
  eventTypes?: AuthEventType[],
): () => void;
```

## Configuration

### Environment Variables

```bash
# Required for all apps
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:4280/auth/callback

# App-specific scopes (optional)
VITE_AUTH_SCOPES=openid,profile,email,User.Read

# Event channel (optional, default: oneportal:auth)
VITE_AUTH_EVENT_CHANNEL=oneportal:auth

# App mode detection (optional, default: auto)
VITE_APP_MODE=embedded # or 'standalone'
```

### AuthConfig Interface

```tsx
interface AuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
  eventChannelName?: string;
  mode?: "embedded" | "standalone";
}
```

## Architecture

### Authentication Flow

#### Host App (Shell) - OAuth Redirect Flow

```
1. User visits Shell → No session found
2. Route guard redirects to /sign-in
3. User clicks "Sign In"
4. Redirect to Azure AD OAuth
5. Azure AD redirects back to Shell with auth code
6. UnifiedAuthProvider handles redirect promise
7. MSAL exchanges code for tokens
8. Shell publishes 'auth:signed-in' event
9. User authenticated
```

#### Remote App (Domino) - SSO Silent Flow

```
1. User navigates to /apps/domino (lazy-loaded)
2. UnifiedAuthProvider mounts in remote mode
3. Subscribes to auth events
4. Receives 'auth:signed-in' event from Shell
5. Attempts SSO silent with loginHint
6. MSAL acquires tokens silently (no redirect)
7. Remote app authenticated
```

#### Sign-Out Flow

```
1. User clicks sign out in Shell
2. Shell publishes 'auth:signed-out' event
3. All remote apps receive event
4. Remote apps clear MSAL cache
5. Shell initiates logout redirect
6. Azure AD clears session
7. Redirect to /sign-in?signed-out=true
8. Toast: "You have been signed out"
```

### Lazy-Load Optimization

The `UnifiedAuthProvider` is optimized for Module Federation:

**Quick Cache Check (Host Mode):**

```tsx
// Before showing spinner, check if user likely has session
const hasMsalCache = Object.keys(localStorage).some((key) =>
  key.startsWith("msal."),
);

if (hasMsalCache) {
  // Render immediately - no spinner
} else {
  // Show spinner during initialization
}
```

**Visibility Check (Remote Mode):**

```tsx
// Don't redirect if route is being preloaded in background
if (document.visibilityState === "hidden") {
  console.log("Route preloaded, skipping redirect");
  return;
}
```

**Result:** Instant rendering for returning users, no flicker during lazy-load.

## Migration

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide from old authentication patterns.

## Troubleshooting

### Flickering on navigation

**Symptom:** Loading spinner flashes briefly when navigating

**Cause:** MSAL cache not detected or missing

**Fix:**

1. Ensure `UnifiedAuthProvider` receives `getAuthConfig` prop
2. Check that MSAL localStorage keys exist (`msal.*`)
3. Verify user has existing session

### Events not received in remote app

**Symptom:** Remote app doesn't authenticate when Shell signs in

**Cause:** Event subscription not working or wrong mode

**Fix:**

1. Ensure remote app uses `mode="remote"`
2. Check browser supports BroadcastChannel (all modern browsers)
3. Verify Shell is publishing events (check console in debug mode)
4. Check event channel name matches (`oneportal:auth`)

### Multiple redirects or redirect loops

**Symptom:** User redirected multiple times or stuck in loop

**Cause:** Route guard triggering on public routes or nested returnUrl

**Fix:**

1. Ensure `/sign-in` route has `routeType="public"`
2. Check sign-out redirects to `/sign-in?signed-out=true` (not home page)
3. Verify route guard only on protected routes

### "Interaction required" error in remote app

**Symptom:** SSO silent fails with interaction required

**Cause:** User needs to sign in, but remote app can't redirect

**Fix:**

1. Remote app should redirect to Shell for sign-in
2. Check embedded mode detection:
   ```tsx
   const isEmbedded = window.location.pathname.startsWith("/apps/");
   if (isEmbedded) {
     window.location.href = `/?returnUrl=${encodeURIComponent(currentUrl)}`;
   }
   ```

### TypeScript errors with event payloads

**Symptom:** "Property does not exist on type" errors

**Cause:** Discriminated union not narrowed

**Fix:** Use type assertion:

```tsx
subscribeToAuthEvents((event) => {
  if (event.type === "auth:signed-in") {
    const signInEvent = event as AuthEvent<"auth:signed-in">;
    // Now payload is correctly typed
  }
});
```

## Best Practices

### Do

- Use `UnifiedAuthProvider` for all new apps
- Enable debug mode during development: `debug={import.meta.env.DEV}`
- Use `AuthErrorHandler` for consistent error handling
- Publish events on authentication state changes (host mode)
- Subscribe to events in remote apps
- Use discriminated union type assertions for events
- Test lazy-load scenarios (Shell → Remote navigation)

### Don't

- Don't manually call `msalInstance.initialize()` (provider handles it)
- Don't use deprecated error utilities (`formatAuthError`, etc.)
- Don't redirect to home page after sign-out (use `/sign-in?signed-out=true`)
- Don't forget `mode` prop on `UnifiedAuthProvider`
- Don't block render on auth initialization in remote mode
- Don't use loose event typing (use type assertions)

## Examples

See [MIGRATION.md](./MIGRATION.md) for complete examples of:

- Host app setup
- Remote app setup
- Error handling patterns
- Event publishing/subscription
- Route guards

## Related Documentation

- [MIGRATION.md](./MIGRATION.md) - Migration guide from old patterns
- [LAZY_LOAD.md](./LAZY_LOAD.md) - Lazy-load architecture details
- [../../docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - Overall architecture
- [../../docs/TROUBLESHOOTING.md](../../docs/TROUBLESHOOTING.md) - General troubleshooting

## Support

For questions or issues:

- Check documentation above
- Review existing GitHub issues
- Create new issue with reproduction steps

## License

Internal Mott MacDonald project
