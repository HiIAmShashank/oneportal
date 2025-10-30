/**
 * Silent-first pattern for acquiring access tokens.
 * Tries acquireTokenSilent first, falls back to interactive methods when necessary.
 */

import type {
  IPublicClientApplication,
  AccountInfo,
  SilentRequest,
  PopupRequest,
} from "@azure/msal-browser";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export interface AcquireTokenOptions {
  msalInstance: IPublicClientApplication;
  account: AccountInfo;
  scopes: string[];
  redirectUri?: string;
  forceInteractive?: boolean;
}

export interface TokenResult {
  accessToken: string;
  expiresOn: Date | null;
  scopes: string[];
  account: AccountInfo;
  tokenType: string;
}

/**
 * Flow: Try silent acquisition (cache/refresh), fallback to popup if forceInteractive=true
 */
export async function acquireToken(
  options: AcquireTokenOptions,
): Promise<TokenResult> {
  const {
    msalInstance,
    account,
    scopes,
    redirectUri,
    forceInteractive = false,
  } = options;

  const silentRequest: SilentRequest = {
    scopes,
    account,
    forceRefresh: false,
    redirectUri: redirectUri || window.location.origin + "/auth/callback",
  };

  try {
    const response = await msalInstance.acquireTokenSilent(silentRequest);

    return {
      accessToken: response.accessToken,
      expiresOn: response.expiresOn,
      scopes: response.scopes,
      account: response.account as AccountInfo,
      tokenType: response.tokenType,
    };
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      if (import.meta.env.DEV) {
        console.warn("[acquireToken] Interaction required", {
          error: error.message,
          errorCode: error.errorCode,
          forceInteractive,
        });
      }

      // STEP 2: Fallback to interactive if allowed
      if (forceInteractive) {
        return await acquireTokenInteractive(msalInstance, scopes, account);
      }

      // Re-throw for caller to handle (e.g., redirect to sign-in)
      throw new Error(
        `Token acquisition requires user interaction. ${error.message}. ` +
          `Error code: ${error.errorCode}`,
      );
    }

    if (import.meta.env.DEV) {
      console.error("[acquireToken] Token acquisition failed", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }

    throw error instanceof Error
      ? error
      : new Error("Unknown error during token acquisition");
  }
}

async function acquireTokenInteractive(
  msalInstance: IPublicClientApplication,
  scopes: string[],
  account: AccountInfo,
): Promise<TokenResult> {
  const popupRequest: PopupRequest = {
    scopes,
    account,
    prompt: "select_account", // Let user confirm account
  };

  try {
    const response = await msalInstance.acquireTokenPopup(popupRequest);

    return {
      accessToken: response.accessToken,
      expiresOn: response.expiresOn,
      scopes: response.scopes,
      account: response.account as AccountInfo,
      tokenType: response.tokenType,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[acquireToken] Interactive token acquisition failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    throw new Error(
      `Interactive token acquisition failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Validates token with configurable buffer period before expiry
 */
export function isTokenValid(
  expiresOn: Date | null,
  bufferMinutes: number = 5,
): boolean {
  if (!expiresOn) return false;

  const now = new Date();
  const bufferMs = bufferMinutes * 60 * 1000;
  const expiryWithBuffer = new Date(expiresOn.getTime() - bufferMs);

  return now < expiryWithBuffer;
}

export function getTokenLifetimeMinutes(expiresOn: Date | null): number {
  if (!expiresOn) return -1;

  const now = new Date();
  const diffMs = expiresOn.getTime() - now.getTime();
  return Math.floor(diffMs / (60 * 1000));
}
