/**
 * Shared React Query Client Configuration
 *
 * Provides consistent QueryClient setup across all apps with:
 * - Configurable error handling
 * - Sensible stale time defaults
 * - Optimized refetch behavior
 */

import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

/**
 * Error checker function type for custom retry logic
 */
export type ErrorChecker = (error: unknown) => boolean;

/**
 * Configuration options for creating a QueryClient
 */
export interface QueryClientConfig {
  /**
   * Custom error checker function that returns true if the error
   * should skip retry (e.g., auth errors)
   */
  shouldSkipRetry?: ErrorChecker;

  /**
   * Override default query/mutation options
   */
  overrides?: DefaultOptions;
}

/**
 * Creates default query options with optional error checker
 */
function createDefaultOptions(shouldSkipRetry?: ErrorChecker): DefaultOptions {
  return {
    queries: {
      // Cache queries for 5 minutes before considering them stale
      staleTime: 5 * 60 * 1000,

      // Retry failed queries up to 2 times, but skip certain errors
      retry: (failureCount, error) => {
        if (shouldSkipRetry?.(error)) {
          return false; // Skip retry for certain errors (e.g., auth)
        }
        return failureCount < 2;
      },

      // Disable automatic refetching to avoid unnecessary network requests
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Do refetch on reconnect (network recovery)
    },

    mutations: {
      // Retry mutations once, but skip certain errors
      retry: (failureCount, error) => {
        if (shouldSkipRetry?.(error)) {
          return false;
        }
        return failureCount < 1;
      },
    },
  };
}

/**
 * Creates a new QueryClient instance with shared configuration
 *
 * @example Basic usage
 * ```tsx
 * import { createQueryClient } from '@one-portal/config/query-client';
 *
 * const queryClient = createQueryClient();
 * ```
 *
 * @example With auth error handling
 * ```tsx
 * import { createQueryClient } from '@one-portal/config/query-client';
 * import { isAuthError } from '@one-portal/auth/utils';
 *
 * const queryClient = createQueryClient({
 *   shouldSkipRetry: isAuthError,
 * });
 * ```
 */
export function createQueryClient(config?: QueryClientConfig): QueryClient {
  const defaultOptions = createDefaultOptions(config?.shouldSkipRetry);

  return new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultOptions.queries,
        ...config?.overrides?.queries,
      },
      mutations: {
        ...defaultOptions.mutations,
        ...config?.overrides?.mutations,
      },
    },
  });
}
