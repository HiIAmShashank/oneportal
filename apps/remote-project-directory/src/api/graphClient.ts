import { Client } from "@microsoft/microsoft-graph-client";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";

/**
 * Custom Authentication Provider for Microsoft Graph Client
 * Handles token acquisition and refresh automatically
 */
export class GraphAuthProvider {
  public async getAccessToken(): Promise<string> {
    const accounts = msalInstance.getAllAccounts();
    const account = accounts[0];

    if (!account) {
      throw new Error("No active account found for Graph API access");
    }

    // Use the same logic as other API calls, but request User.Read.All
    // We combine with existing scopes to ensure we have a valid token for the session
    // but specifically we need User.Read.All for reading photos
    const authConfig = getAuthConfig();

    // Ensure User.Read.All is included
    const scopes = [...new Set([...authConfig.scopes, "User.Read.All"])];

    const result = await acquireToken({
      msalInstance,
      account,
      scopes,
      // Force interactive only if absolutely necessary, handled by acquireToken
    });

    return result.accessToken;
  }
}

/**
 * Initialize Microsoft Graph Client
 */
export const graphClient = Client.initWithMiddleware({
  authProvider: new GraphAuthProvider(),
});
