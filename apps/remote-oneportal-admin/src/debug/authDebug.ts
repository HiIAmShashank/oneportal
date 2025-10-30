/**
 * Development-only authentication debugging utilities
 *
 * This file is automatically loaded in development mode by bootstrap.tsx.
 * It provides console logging helpers for debugging authentication issues.
 */

if (import.meta.env.DEV) {
  console.info("[One Portal Admin] Auth debug utilities loaded");

  // Add window helper for manual auth testing
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__ONEPORTAL_ADMIN_AUTH_DEBUG__ = {
    getMsalAccounts: async () => {
      const { msalInstance } = await import("../auth/msalInstance");
      const accounts = msalInstance.getAllAccounts();
      //eslint-disable-next-line no-console
      console.table(accounts);
      return accounts;
    },
    getActiveAccount: async () => {
      const { msalInstance } = await import("../auth/msalInstance");
      const account = msalInstance.getActiveAccount();
      console.info("Active account:", account);
      return account;
    },
    acquireToken: async (scopes?: string[]) => {
      const { msalInstance, getAuthConfig } = await import(
        "../auth/msalInstance"
      );
      // Use configured scopes as default
      const scopesToUse = scopes || getAuthConfig().scopes;
      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: scopesToUse,
          account: msalInstance.getActiveAccount() || undefined,
        });
        console.info("Token acquired:", response);
        return response;
      } catch (error) {
        console.error("Token acquisition failed:", error);
        throw error;
      }
    },
    logout: async () => {
      const { msalInstance } = await import("../auth/msalInstance");
      await msalInstance.logoutPopup();
      console.info("Logged out");
    },
  };

  console.info(
    "[One Portal Admin] Auth debug helpers available at window.__ONEPORTAL_ADMIN_AUTH_DEBUG__",
  );
  console.info("Available methods:");
  console.info("  - getMsalAccounts(): Get all MSAL accounts");
  console.info("  - getActiveAccount(): Get the active MSAL account");
  console.info("  - acquireToken(scopes?): Acquire an access token");
  console.info("  - logout(): Sign out");
}

export {};
