/**
 * OnePortal Admin Backend API Client
 *
 * Provides authenticated API calls to the OnePortal Function App.
 * Base URL: VITE_ONEPORTAL_ADMIN_FUNCTIONAPP_API_BASE_URL
 */

import type {
  CheckSuperUserResponse,
  ApiUser,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ApiApplication,
  CreateApplicationRequest,
  CreateApplicationResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  ApiFeature,
  CreateFeatureRequest,
  CreateFeatureResponse,
  UpdateFeatureRequest,
  UpdateFeatureResponse,
  ApiRole,
  UserApplicationRole,
  UserFeatureRole,
  GrantApplicationRoleRequest,
  GrantFeatureRoleRequest,
} from "./types";
import { API_ENDPOINTS } from "./constants";

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
  const baseUrl = import.meta.env.VITE_ONEPORTAL_ADMIN_FUNCTIONAPP_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "VITE_ONEPORTAL_ADMIN_FUNCTIONAPP_API_BASE_URL is not configured",
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
 * Fetch all users from the system
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to array of users
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const users = await fetchUsers(token);
 * ```
 */
export async function fetchUsers(token: string): Promise<ApiUser[]> {
  return await apiRequest<ApiUser[]>(API_ENDPOINTS.USERS.LIST, token);
}

/**
 * Create a new user in the system
 *
 * @param token - Access token from MSAL
 * @param data - User data (email and displayName)
 * @returns Promise resolving to created user
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const newUser = await createUser(token, {
 *   email: 'user@example.com',
 *   displayName: 'John Doe'
 * });
 * ```
 */
export async function createUser(
  token: string,
  data: CreateUserRequest,
): Promise<CreateUserResponse> {
  return await apiRequest<CreateUserResponse>(
    API_ENDPOINTS.USERS.CREATE,
    token,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * Fetch a single user by identifier
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @returns Promise resolving to user data
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const user = await fetchUser(token, 'user-123');
 * ```
 */
export async function fetchUser(
  token: string,
  userIdentifier: string,
): Promise<ApiUser> {
  return await apiRequest<ApiUser>(
    API_ENDPOINTS.USERS.BY_ID(userIdentifier),
    token,
  );
}

/**
 * Update an existing user's information
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @param data - Updated user data (displayName)
 * @returns Promise resolving to updated user
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const updatedUser = await updateUser(token, 'user-123', {
 *   displayName: 'Jane Smith'
 * });
 * ```
 */
export async function updateUser(
  token: string,
  userIdentifier: string,
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  return await apiRequest<UpdateUserResponse>(
    API_ENDPOINTS.USERS.UPDATE(userIdentifier),
    token,
    {
      method: "PUT",
      body: data,
    },
  );
}

/**
 * Activate a user account (idempotent)
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @returns Promise resolving to updated user
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const activatedUser = await activateUser(token, 'user-123');
 * ```
 */
export async function activateUser(
  token: string,
  userIdentifier: string,
): Promise<ApiUser> {
  return await apiRequest<ApiUser>(
    API_ENDPOINTS.USERS.ACTIVATE(userIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Deactivate a user account (idempotent)
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @returns Promise resolving to updated user
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const deactivatedUser = await deactivateUser(token, 'user-123');
 * ```
 */
export async function deactivateUser(
  token: string,
  userIdentifier: string,
): Promise<ApiUser> {
  return await apiRequest<ApiUser>(
    API_ENDPOINTS.USERS.DEACTIVATE(userIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Fetch all applications (admin endpoint)
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to array of applications
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const applications = await fetchApplications(token);
 * ```
 */
export async function fetchApplications(
  token: string,
): Promise<ApiApplication[]> {
  return await apiRequest<ApiApplication[]>(
    API_ENDPOINTS.APPLICATIONS.LIST_ADMIN,
    token,
  );
}

/**
 * Fetch a single application by identifier
 *
 * @param token - Access token from MSAL
 * @param applicationIdentifier - Application's unique identifier
 * @returns Promise resolving to application data
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const application = await fetchApplication(token, 'app-123');
 * ```
 */
export async function fetchApplication(
  token: string,
  applicationIdentifier: string,
): Promise<ApiApplication> {
  return await apiRequest<ApiApplication>(
    API_ENDPOINTS.APPLICATIONS.BY_ID_ADMIN(applicationIdentifier),
    token,
  );
}

/**
 * Create a new application
 *
 * @param token - Access token from MSAL
 * @param data - Application creation data
 * @returns Promise resolving to created application
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const newApp = await createApplication(token, {
 *   applicationName: 'My App',
 *   applicationDescription: 'Description',
 *   applicationUrl: 'https://app.com',
 *   landingPage: '/home',
 *   module: 'my-app',
 *   scope: 'portal.my-app',
 *   iconName: 'app-icon',
 *   ownerUserIdentifier: 'user-123'
 * });
 * ```
 */
export async function createApplication(
  token: string,
  data: CreateApplicationRequest,
): Promise<CreateApplicationResponse> {
  return await apiRequest<CreateApplicationResponse>(
    API_ENDPOINTS.APPLICATIONS.CREATE,
    token,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * Update an existing application
 *
 * @param token - Access token from MSAL
 * @param applicationIdentifier - Application's unique identifier
 * @param data - Updated application data
 * @returns Promise resolving to updated application
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const updated = await updateApplication(token, 'app-123', {
 *   applicationName: 'Updated App',
 *   applicationDescription: 'New description',
 *   applicationUrl: 'https://updated.com',
 *   landingPage: '/new-home',
 *   module: 'updated-app',
 *   scope: 'portal.updated',
 *   iconName: 'new-icon',
 *   ownerUserIdentifier: 'user-456'
 * });
 * ```
 */
export async function updateApplication(
  token: string,
  applicationIdentifier: string,
  data: UpdateApplicationRequest,
): Promise<UpdateApplicationResponse> {
  return await apiRequest<UpdateApplicationResponse>(
    API_ENDPOINTS.APPLICATIONS.UPDATE(applicationIdentifier),
    token,
    {
      method: "PUT",
      body: data,
    },
  );
}

/**
 * Activate an application account (idempotent)
 *
 * @param token - Access token from MSAL
 * @param applicationIdentifier - Application's unique identifier
 * @returns Promise resolving to updated application
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const activated = await activateApplication(token, 'app-123');
 * ```
 */
export async function activateApplication(
  token: string,
  applicationIdentifier: string,
): Promise<ApiApplication> {
  return await apiRequest<ApiApplication>(
    API_ENDPOINTS.APPLICATIONS.ACTIVATE(applicationIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Deactivate an application account (idempotent)
 *
 * @param token - Access token from MSAL
 * @param applicationIdentifier - Application's unique identifier
 * @returns Promise resolving to updated application
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const deactivated = await deactivateApplication(token, 'app-123');
 * ```
 */
export async function deactivateApplication(
  token: string,
  applicationIdentifier: string,
): Promise<ApiApplication> {
  return await apiRequest<ApiApplication>(
    API_ENDPOINTS.APPLICATIONS.DEACTIVATE(applicationIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Get all features (SuperUser only, returns all active and inactive)
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to array of features
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const features = await getFeatures(token);
 * ```
 */
export async function getFeatures(token: string): Promise<ApiFeature[]> {
  return await apiRequest<ApiFeature[]>(API_ENDPOINTS.FEATURES.LIST, token);
}

/**
 * Get a specific feature by ID (SuperUser only)
 *
 * @param token - Access token from MSAL
 * @param featureIdentifier - Feature's unique identifier
 * @returns Promise resolving to feature details
 * @throws ApiError if API call fails (404 if not found)
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const feature = await getFeatureById(token, 'feature-123');
 * ```
 */
export async function getFeatureById(
  token: string,
  featureIdentifier: string,
): Promise<ApiFeature> {
  return await apiRequest<ApiFeature>(
    API_ENDPOINTS.FEATURES.BY_ID(featureIdentifier),
    token,
  );
}

/**
 * Create a new feature (SuperUser only)
 *
 * @param token - Access token from MSAL
 * @param data - Feature creation data
 * @returns Promise resolving to created feature
 * @throws ApiError if API call fails (400, 404, 409)
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const newFeature = await createFeature(token, {
 *   applicationIdentifier: 'app-123',
 *   featureName: 'Analytics Dashboard',
 *   featureDescription: 'View analytics and metrics',
 *   featureUrl: '/analytics',
 *   iconName: 'BarChart',
 * });
 * ```
 */
export async function createFeature(
  token: string,
  data: CreateFeatureRequest,
): Promise<CreateFeatureResponse> {
  return await apiRequest<CreateFeatureResponse>(
    API_ENDPOINTS.FEATURES.CREATE,
    token,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * Update an existing feature (SuperUser only)
 *
 * @param token - Access token from MSAL
 * @param featureIdentifier - Feature's unique identifier
 * @param data - Feature update data
 * @returns Promise resolving to updated feature
 * @throws ApiError if API call fails (400, 404)
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const updated = await updateFeature(token, 'feature-123', {
 *   featureName: 'Advanced Analytics',
 *   featureDescription: 'Updated description',
 *   featureUrl: '/analytics/advanced',
 *   iconName: 'BarChart2',
 * });
 * ```
 */
export async function updateFeature(
  token: string,
  featureIdentifier: string,
  data: UpdateFeatureRequest,
): Promise<UpdateFeatureResponse> {
  return await apiRequest<UpdateFeatureResponse>(
    API_ENDPOINTS.FEATURES.UPDATE(featureIdentifier),
    token,
    {
      method: "PUT",
      body: data,
    },
  );
}

/**
 * Activate a feature (idempotent)
 *
 * @param token - Access token from MSAL
 * @param featureIdentifier - Feature's unique identifier
 * @returns Promise resolving to updated feature
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const activated = await activateFeature(token, 'feature-123');
 * ```
 */
export async function activateFeature(
  token: string,
  featureIdentifier: string,
): Promise<ApiFeature> {
  return await apiRequest<ApiFeature>(
    API_ENDPOINTS.FEATURES.ACTIVATE(featureIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Deactivate a feature (idempotent)
 *
 * @param token - Access token from MSAL
 * @param featureIdentifier - Feature's unique identifier
 * @returns Promise resolving to updated feature
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const deactivated = await deactivateFeature(token, 'feature-123');
 * ```
 */
export async function deactivateFeature(
  token: string,
  featureIdentifier: string,
): Promise<ApiFeature> {
  return await apiRequest<ApiFeature>(
    API_ENDPOINTS.FEATURES.DEACTIVATE(featureIdentifier),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Fetch all available roles in the system
 *
 * @param token - Access token from MSAL
 * @returns Promise resolving to array of roles
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const roles = await fetchRoles(token);
 * ```
 */
export async function fetchRoles(token: string): Promise<ApiRole[]> {
  return await apiRequest<ApiRole[]>(API_ENDPOINTS.ROLES.LIST, token);
}

/**
 * Fetch application-level roles for a specific user
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @returns Promise resolving to array of user's application roles
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const appRoles = await fetchUserApplicationRoles(token, 'user-123');
 * ```
 */
export async function fetchUserApplicationRoles(
  token: string,
  userIdentifier: string,
): Promise<UserApplicationRole[]> {
  return await apiRequest<UserApplicationRole[]>(
    API_ENDPOINTS.ROLES.USER_APPLICATIONS(userIdentifier),
    token,
  );
}

/**
 * Fetch feature-level roles for a specific user
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @returns Promise resolving to array of user's feature roles
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * const featureRoles = await fetchUserFeatureRoles(token, 'user-123');
 * ```
 */
export async function fetchUserFeatureRoles(
  token: string,
  userIdentifier: string,
): Promise<UserFeatureRole[]> {
  return await apiRequest<UserFeatureRole[]>(
    API_ENDPOINTS.ROLES.USER_FEATURES(userIdentifier),
    token,
  );
}

/**
 * Grant an application-level role to a user (idempotent, replaces existing role)
 *
 * @param token - Access token from MSAL
 * @param data - Grant application role request data
 * @returns Promise resolving when role is granted
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await grantApplicationRole(token, {
 *   userIdentifier: 'user-123',
 *   applicationIdentifier: 'app-456',
 *   roleIdentifier: 'role-789'
 * });
 * ```
 */
export async function grantApplicationRole(
  token: string,
  data: GrantApplicationRoleRequest,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.ROLES.GRANT_APPLICATION,
    token,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * Grant a feature-level role to a user (idempotent, replaces existing role)
 * User must have an application-level role before being granted feature-level role
 *
 * @param token - Access token from MSAL
 * @param data - Grant feature role request data
 * @returns Promise resolving when role is granted
 * @throws ApiError if API call fails (400 if user doesn't have app role)
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await grantFeatureRole(token, {
 *   userIdentifier: 'user-123',
 *   featureIdentifier: 'feature-456',
 *   roleIdentifier: 'role-789'
 * });
 * ```
 */
export async function grantFeatureRole(
  token: string,
  data: GrantFeatureRoleRequest,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.ROLES.GRANT_FEATURE,
    token,
    {
      method: "POST",
      body: data,
    },
  );
}

/**
 * Revoke a user's application-level role (also revokes all feature roles for that app)
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @param applicationIdentifier - Application's unique identifier
 * @returns Promise resolving when role is revoked
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await revokeApplicationRole(token, 'user-123', 'app-456');
 * ```
 */
export async function revokeApplicationRole(
  token: string,
  userIdentifier: string,
  applicationIdentifier: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.ROLES.REVOKE_APPLICATION(
      userIdentifier,
      applicationIdentifier,
    ),
    token,
    {
      method: "DELETE",
    },
  );
}

/**
 * Revoke a user's feature-level role
 *
 * @param token - Access token from MSAL
 * @param userIdentifier - User's unique identifier
 * @param featureIdentifier - Feature's unique identifier
 * @returns Promise resolving when role is revoked
 * @throws ApiError if API call fails
 *
 * @example
 * ```typescript
 * const token = await acquireToken(['User.Read']);
 * await revokeFeatureRole(token, 'user-123', 'feature-456');
 * ```
 */
export async function revokeFeatureRole(
  token: string,
  userIdentifier: string,
  featureIdentifier: string,
): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(
    API_ENDPOINTS.ROLES.REVOKE_FEATURE(userIdentifier, featureIdentifier),
    token,
    {
      method: "DELETE",
    },
  );
}
