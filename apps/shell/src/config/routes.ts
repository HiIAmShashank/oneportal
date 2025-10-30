/**
 * Route configuration for Shell application
 *
 * PUBLIC_ROUTES: Routes that do not require authentication
 * - /sign-in: Sign-in page
 * - /auth/callback: OAuth callback handler
 */

export const PUBLIC_ROUTES = ["/sign-in", "/auth/callback"] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
