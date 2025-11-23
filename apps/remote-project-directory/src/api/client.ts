import { API_ENDPOINTS } from "./constants";
import {
  type UpdateFavouriteRequest,
  type ApiUser,
  type GetProjectsRequest,
  type GetProjectsResponse,
} from "./types";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  timeout?: number;
}

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

async function apiRequest<T>(
  endpoint: string,
  token: string,
  username: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_PROJECT_DIRECTORY_API_BASE_URL;
  const subscriptionKey = import.meta.env
    .VITE_PROJECT_DIRECTORY_API_SUBSCRIPTION_KEY;

  if (!baseUrl) {
    throw new Error("VITE_PROJECT_DIRECTORY_API_BASE_URL is not configured");
  }

  if (!subscriptionKey) {
    throw new Error(
      "VITE_PROJECT_DIRECTORY_API_SUBSCRIPTION_KEY is not configured",
    );
  }

  const url = `${baseUrl}${endpoint}`;
  const { method = "GET", body, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        Username: username,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentLength = response.headers.get("Content-Length");
    if (contentLength === "0") {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

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

export async function fetchUser(
  token: string,
  username: string,
): Promise<ApiUser> {
  return await apiRequest<ApiUser>(API_ENDPOINTS.USER, token, username);
}
export async function fetchProjects(
  token: string,
  username: string,
  request: GetProjectsRequest,
): Promise<GetProjectsResponse> {
  return apiRequest<GetProjectsResponse>(
    API_ENDPOINTS.PROJECTS,
    token,
    username,
    {
      method: "POST",
      body: request,
    },
  );
}

export async function updateFavouriteProject(
  token: string,
  username: string,
  request: UpdateFavouriteRequest,
): Promise<void> {
  return apiRequest<void>(API_ENDPOINTS.UPDATE_FAVOURITE, token, username, {
    method: "POST",
    body: request,
  });
}
