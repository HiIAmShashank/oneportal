/**
 * OnePortal Backend API Client
 *
 * Provides authenticated API calls to the OnePortal Function App.
 * Base URL: VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL
 */

import type { CheckSuperUserResponse, ApiApplicationsResponse } from "./types";
import { API_ENDPOINTS } from "./constants";
import type { RemoteApp } from "@one-portal/types";
import { transformApiApplications } from "../adapters/applicationAdapter";

/**
 * API Request Options
 */
interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * API Error with status code
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Generic API request wrapper with authentication and timeout
 *
 * @param endpoint - API endpoint path (e.g., '/users/me/is-superuser')
 * @param token - Bearer token for authentication
 * @param options - Request options (method, body, timeout)
 * @returns Parsed JSON response
 * @throws ApiError if request fails or returns non-2xx status
 * @throws Error if request times out
 */
async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL is not configured",
    );
  }

  const url = `${baseUrl}${endpoint}`;
  const { method = "GET", body, timeout = 30000 } = options;

  // Set up AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timeout after ${timeout / 1000} seconds: ${endpoint}`,
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error(`API request failed: ${String(error)}`);
  }
}

/**
 * Check if the current user has SuperUser (admin) privileges
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to true if user is superuser, false otherwise
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const isAdmin = await checkSuperUser(token);
 * if (isAdmin) {
 *   // Show admin panel
 * }
 * ```
 */
export async function checkSuperUser(token: string): Promise<boolean> {
  const data = await apiRequest<CheckSuperUserResponse>(
    API_ENDPOINTS.USERS.IS_SUPERUSER,
    token,
  );
  return data.isSuperUser;
}

/**
 * Fetch all applications with features
 *
 * Returns only active applications with active features.
 * Inactive applications and features are filtered out automatically.
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to array of active RemoteApp with active menuItems
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const apps = await fetchApplications(token);
 * console.log(apps[0].menuItems); // Active features for first app
 * ```
 */
export async function fetchApplications(token: string): Promise<RemoteApp[]> {
  const data = await apiRequest<ApiApplicationsResponse>(
    API_ENDPOINTS.APPLICATIONS.LIST,
    token,
  );

  return transformApiApplications(data);
}

/**
 * Add an application to favorites
 *
 * @param token - Access token from MSAL
 * @param applicationId - GUID of the application
 * @returns Promise resolving to success message
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await addApplicationFavorite(token, 'app-guid-123');
 * ```
 */
export async function addApplicationFavorite(
  token: string,
  applicationId: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.FAVORITES.ADD_APPLICATION,
    token,
    {
      method: "POST",
      body: { applicationIdentifier: applicationId },
    },
  );
}

/**
 * Remove an application from favorites
 *
 * @param token - Access token from MSAL
 * @param applicationId - GUID of the application
 * @returns Promise resolving to success message
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await removeApplicationFavorite(token, 'app-guid-123');
 * ```
 */
export async function removeApplicationFavorite(
  token: string,
  applicationId: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    `${API_ENDPOINTS.FAVORITES.REMOVE_APPLICATION}/${applicationId}`,
    token,
    {
      method: "DELETE",
    },
  );
}

/**
 * Add a feature to favorites
 *
 * @param token - Access token from MSAL
 * @param featureId - GUID of the feature
 * @returns Promise resolving to success message
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await addFeatureFavorite(token, 'feature-guid-456');
 * ```
 */
export async function addFeatureFavorite(
  token: string,
  featureId: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.FAVORITES.ADD_FEATURE,
    token,
    {
      method: "POST",
      body: { featureIdentifier: featureId },
    },
  );
}

/**
 * Remove a feature from favorites
 *
 * @param token - Access token from MSAL
 * @param featureId - GUID of the feature
 * @returns Promise resolving to success message
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await removeFeatureFavorite(token, 'feature-guid-456');
 * ```
 */
export async function removeFeatureFavorite(
  token: string,
  featureId: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    `${API_ENDPOINTS.FAVORITES.REMOVE_FEATURE}/${featureId}`,
    token,
    {
      method: "DELETE",
    },
  );
}
