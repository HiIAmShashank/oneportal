import { createQueryClient } from "@one-portal/config";
import { isAuthError } from "@one-portal/auth";

/**
 * Shared QueryClient instance for the shell application
 * Configured with auth-aware retry logic
 */
export const queryClient = createQueryClient({ shouldSkipRetry: isAuthError });
