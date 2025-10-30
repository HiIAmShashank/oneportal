import { PublicClientApplication } from "@azure/msal-browser";
import {
  loadAuthConfig,
  createMsalConfig,
  validateMsalConfig,
} from "../config";

/**
 * Creates a PublicClientApplication instance and returns it along with the auth config.
 *
 * This factory function encapsulates the common pattern of loading configuration,
 * creating MSAL config, validating it, and instantiating the PublicClientApplication.
 * Returns both the instance and the auth configuration for use in components.
 *
 * @param appName - The name of the application (e.g., 'shell', 'domino',)
 * @returns Object containing the MSAL instance and auth config
 *
 * @example
 * ```typescript
 * // In apps/shell/src/auth/msalInstance.ts
 * const { instance, authConfig } = createMsalInstanceWithConfig('shell');
 * export const msalInstance = instance;
 * export const getAuthConfig = () => authConfig;
 * ```
 *
 * @throws {Error} If required environment variables are missing
 * @throws {Error} If configuration validation fails
 */
export function createMsalInstanceWithConfig(appName: string) {
  const authConfig = loadAuthConfig(appName);
  const msalConfig = createMsalConfig(authConfig);
  validateMsalConfig(msalConfig);
  const instance = new PublicClientApplication(msalConfig);

  return {
    instance,
    authConfig,
  };
}
