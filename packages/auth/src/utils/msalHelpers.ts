import type { AccountInfo } from "@azure/msal-browser";
import type { UserProfile } from "../types/auth";

export function accountToUserProfile(account: AccountInfo): UserProfile {
  return {
    id: account.homeAccountId,
    email: account.username,
    name: account.name || account.username,
    roles: (account.idTokenClaims?.roles as string[]) || undefined,
    groups: (account.idTokenClaims?.groups as string[]) || undefined,
    tenantId: account.tenantId,
  };
}

export function getLoginHint(account: AccountInfo): string {
  // Prefer username (from preferred_username claim)
  if (account.username) {
    return account.username;
  }

  // Fallback to email from idTokenClaims
  if (account.idTokenClaims?.email) {
    return account.idTokenClaims.email as string;
  }

  // Fallback to UPN from idTokenClaims
  if (account.idTokenClaims?.upn) {
    return account.idTokenClaims.upn as string;
  }

  // Last resort: use homeAccountId (not ideal but prevents empty string)
  console.warn(
    "[getLoginHint] No username/email/upn found in account, using homeAccountId. Check Azure AD optional claims configuration.",
  );
  return account.homeAccountId;
}

/**
 * Check if account has all required roles
 */
export function hasRole(
  account: AccountInfo | null,
  roles: string | string[],
): boolean {
  if (!account?.idTokenClaims) return false;

  const accountRoles = (account.idTokenClaims.roles as string[]) || [];
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return requiredRoles.every((role) => accountRoles.includes(role));
}

/**
 * Check if account has at least one required role
 */
export function hasAnyRole(
  account: AccountInfo | null,
  roles: string | string[],
): boolean {
  if (!account?.idTokenClaims) return false;

  const accountRoles = (account.idTokenClaims.roles as string[]) || [];
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return requiredRoles.some((role) => accountRoles.includes(role));
}
