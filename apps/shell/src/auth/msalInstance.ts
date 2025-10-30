import { createMsalInstanceWithConfig } from '@one-portal/auth';

// Create MSAL instance using the factory function
const { instance, authConfig } = createMsalInstanceWithConfig('shell');

export const msalInstance = instance;

export function getAuthConfig() {
  return authConfig;
}
