/**
 * Custom hook to fetch applications from the backend API
 *
 * Automatically handles:
 * - Token acquisition via MSAL
 * - Authentication state
 * - Caching (5 minutes stale time)
 * - Loading and error states
 * - Filtering inactive apps and features
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { data: apps = [], isLoading, error } = useApplications();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return (
 *     <nav>
 *       {apps.map(app => (
 *         <AppMenuItem key={app.id} app={app} />
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchApplications } from "../api/client";
import type { RemoteApp } from "@one-portal/types";

/**
 * Hook to fetch applications from /applications endpoint
 *
 * @returns React Query result with applications data
 */
export function useApplications() {
  return useAuthenticatedQuery<RemoteApp[]>(
    ["applications"],
    (token) => fetchApplications(token),
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 2, // Retry failed requests twice
    },
  );
}
