import type { Configuration } from "@azure/msal-browser";
import type { AuthConfig } from "../types/auth";
import type { AppMode } from "../utils/environment";

/**
 * Generate app-specific environment variable prefix from app name.
 *
 * Converts app name to uppercase constant-case for environment variables:
 * - 'shell' → 'VITE_SHELL_AUTH_'
 * - 'domino' → 'VITE_DOMINO_AUTH_'
 *
 * This enables app-specific environment variables for CI/CD pipelines where
 * multiple apps build in the same environment.
 *
 * @param appName - Application name (e.g., 'shell', 'domino')
 * @returns Environment variable prefix (e.g., 'VITE_SHELL_AUTH_')
 */
function getEnvPrefix(appName: string): string {
  const normalized = appName
    .toUpperCase()
    .replace(/^REMOTE-/, "") // Remove 'remote-' prefix if present
    .replace(/-/g, "_"); // Convert kebab-case to snake_case

  return `VITE_${normalized}_AUTH_`;
}

export function loadAuthConfig(appName: string): AuthConfig {
  const ENV_PREFIX = getEnvPrefix(appName);

  const clientId = (import.meta.env as Record<string, unknown>)[`${ENV_PREFIX}CLIENT_ID`] as
    | string
    | undefined;
  const authority = (import.meta.env as Record<string, unknown>)[`${ENV_PREFIX}AUTHORITY`] as
    | string
    | undefined;
  const redirectUri = (import.meta.env as Record<string, unknown>)[`${ENV_PREFIX}REDIRECT_URI`] as
    | string
    | undefined;
  const postLogoutRedirectUri = (import.meta.env as Record<string, unknown>)[
    `${ENV_PREFIX}POST_LOGOUT_REDIRECT_URI`
  ] as string | undefined;
  const scopesStr = (import.meta.env as Record<string, unknown>)[`${ENV_PREFIX}SCOPES`] as
    | string
    | undefined;
  const mode = (import.meta.env as Record<string, unknown>).VITE_APP_MODE as AppMode | undefined;

  // Strict validation - no fallbacks
  if (!clientId) {
    throw new Error(
      `${ENV_PREFIX}CLIENT_ID is required but not defined. ` +
      `Please configure this environment variable for the '${appName}' app.`,
    );
  }
  if (!authority) {
    throw new Error(
      `${ENV_PREFIX}AUTHORITY is required but not defined. ` +
      `Please configure this environment variable for the '${appName}' app.`,
    );
  }
  if (!redirectUri) {
    throw new Error(
      `${ENV_PREFIX}REDIRECT_URI is required but not defined. ` +
      `Please configure this environment variable for the '${appName}' app.`,
    );
  }
  if (!scopesStr) {
    throw new Error(
      `${ENV_PREFIX}SCOPES is required but not defined. ` +
      `Please configure this environment variable for the '${appName}' app. ` +
      `Example: SCOPES=User.Read,Mail.Read`,
    );
  }

  const scopes = scopesStr.split(",").map((s) => s.trim());

  return {
    clientId,
    authority,
    redirectUri,
    postLogoutRedirectUri: postLogoutRedirectUri || window.location.origin,
    scopes,
    appName,
    mode: mode ?? "auto",
  };
}

export function createMsalConfig(authConfig: AuthConfig): Configuration {
  const isDev = import.meta.env.DEV;

  return {
    auth: {
      clientId: authConfig.clientId,
      authority: authConfig.authority,
      redirectUri: authConfig.redirectUri,
      postLogoutRedirectUri: authConfig.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: number, message: string, containsPii: boolean) => {
          if (containsPii) return;

          switch (level) {
            case 0: // Error
              console.error(`[MSAL:${authConfig.appName}]`, message);
              break;
            case 1: // Warning
              console.warn(`[MSAL:${authConfig.appName}]`, message);
              break;
            case 2: // Info
            case 3: // Verbose
              if (isDev) {
                console.info(`[MSAL:${authConfig.appName}]`, message);
              }
              break;
          }
        },
        logLevel: 1, // Verbose in dev, Warning in prod
        piiLoggingEnabled: false,
      },
      allowNativeBroker: false,
    },
    telemetry: {
      application: {
        appName: authConfig.appName,
        appVersion: "1.0.0",
      },
    },
  };
}

export function validateMsalConfig(config: Configuration): boolean {
  // if (!config.auth.clientId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.auth.clientId)) {
  //   throw new Error('Invalid clientId: must be a valid GUID');
  // }

  if (
    !config.auth.authority ||
    !config.auth.authority.startsWith("https://login.microsoftonline.com/")
  ) {
    throw new Error(
      "Invalid authority: must start with https://login.microsoftonline.com/",
    );
  }

  if (
    !config.auth.redirectUri ||
    !/^https?:\/\/.+/.test(config.auth.redirectUri)
  ) {
    throw new Error("Invalid redirectUri: must be a valid HTTP(S) URL");
  }

  return true;
}
