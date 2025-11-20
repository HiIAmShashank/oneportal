/**
 * Domino Event System API Client
 *
 * Provides authenticated API calls to the Domino Function App.
 * Base URL: VITE_DOMINO_FUNCTIONAPP_API_BASE_URL
 */

import type {
  PaginatedEventsResponse,
  PaginatedEventTypesResponse,
  PaginatedApplicationsResponse,
  FetchEventsParams,
  FetchEventTypesParams,
  FetchApplicationsParams,
} from "./types";
import {
  API_ENDPOINTS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "./constants";

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
 * @param endpoint - API endpoint path (e.g., '/api/events')
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
  const baseUrl = import.meta.env.VITE_DOMINO_FUNCTIONAPP_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_DOMINO_FUNCTIONAPP_API_BASE_URL is not configured");
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
 * Build query string from params object, filtering out undefined values
 */
function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  return filteredParams ? `?${filteredParams}` : "";
}

/**
 * Fetch events with optional pagination and filtering
 *
 * @param token - Access token from MSAL
 * @param params - Optional filters and pagination parameters
 * @returns Promise resolving to paginated events response
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const events = await fetchEvents(token, {
 *   pageNumber: 1,
 *   pageSize: 10,
 *   applicationId: 'app-123'
 * });
 * ```
 */
export async function fetchEvents(
  token: string,
  params?: FetchEventsParams,
): Promise<PaginatedEventsResponse> {
  const queryString = buildQueryString({
    pageNumber: params?.pageNumber ?? DEFAULT_PAGE_NUMBER,
    pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
    eventTypeId: params?.eventTypeId,
    applicationId: params?.applicationId,
    correlationId: params?.correlationId,
  });

  return await apiRequest<PaginatedEventsResponse>(
    `${API_ENDPOINTS.EVENTS.LIST}${queryString}`,
    token,
  );
}

/**
 * Fetch event types with optional pagination
 *
 * @param token - Access token from MSAL
 * @param params - Optional pagination parameters
 * @returns Promise resolving to paginated event types response
 * @throws ApiError if API call fails
 */
export async function fetchEventTypes(
  token: string,
  params?: FetchEventTypesParams,
): Promise<PaginatedEventTypesResponse> {
  const queryString = buildQueryString({
    pageNumber: params?.pageNumber ?? DEFAULT_PAGE_NUMBER,
    pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
  });

  return await apiRequest<PaginatedEventTypesResponse>(
    `${API_ENDPOINTS.EVENT_TYPES.LIST}${queryString}`,
    token,
  );
}

/**
 * Fetch applications with optional pagination
 *
 * @param token - Access token from MSAL
 * @param params - Optional pagination parameters
 * @returns Promise resolving to paginated applications response
 * @throws ApiError if API call fails
 */
export async function fetchApplications(
  token: string,
  params?: FetchApplicationsParams,
): Promise<PaginatedApplicationsResponse> {
  const queryString = buildQueryString({
    pageNumber: params?.pageNumber ?? DEFAULT_PAGE_NUMBER,
    pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
  });

  return await apiRequest<PaginatedApplicationsResponse>(
    `${API_ENDPOINTS.APPLICATIONS.LIST}${queryString}`,
    token,
  );
}
