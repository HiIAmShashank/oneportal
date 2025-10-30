import { AuthError, InteractionRequiredAuthError } from '@azure/msal-browser';

/**
 * Auth errors (401/403) should not be retried - user needs to sign in.
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;

  // Check for HTTP 401 Unauthorized or 403 Forbidden
  if (error instanceof Error && 'status' in error) {
    const status = (error as Error & { status: number }).status;
    return status === 401 || status === 403;
  }

  // Check for MSAL authentication errors
  if (error instanceof AuthError || error instanceof InteractionRequiredAuthError) {
    return true;
  }

  // Check for response objects with status codes
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { response?: { status?: number } };
    if (errorObj.response?.status === 401 || errorObj.response?.status === 403) {
      return true;
    }
  }

  return false;
}
