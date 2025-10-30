/**
 * API Endpoint Constants
 *
 * Centralized API endpoint definitions for type-safe URL construction.
 * Use factory functions for dynamic endpoints that require parameters.
 */

export const API_ENDPOINTS = {
  USERS: {
    ME: "/users/me",
    IS_SUPERUSER: "/users/me/is-superuser",
    LIST: "/users?activeOnly=false",
    BY_ID: (id: string) => `/users/${id}`,
    BY_EMAIL: (email: string) => `/users/email/${email}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },
  APPLICATIONS: {
    LIST: "/applications",
    BY_ID: (id: string) => `/applications/${id}`,
    LIST_ADMIN: "/adm/applications",
    BY_ID_ADMIN: (id: string) => `/applications/${id}`,
    CREATE: "/applications",
    UPDATE: (id: string) => `/applications/${id}`,
    ACTIVATE: (id: string) => `/applications/${id}/activate`,
    DEACTIVATE: (id: string) => `/applications/${id}/deactivate`,
  },
  FEATURES: {
    LIST: "/features",
    BY_ID: (id: string) => `/features/${id}`,
    BY_APPLICATION: (applicationId: string) =>
      `/applications/${applicationId}/features`,
    CREATE: "/features",
    UPDATE: (id: string) => `/features/${id}`,
    ACTIVATE: (id: string) => `/features/${id}/activate`,
    DEACTIVATE: (id: string) => `/features/${id}/deactivate`,
  },
  ROLES: {
    LIST: "/roles",
    GRANT_APPLICATION: "/roles/applications",
    GRANT_FEATURE: "/roles/features",
    REVOKE_APPLICATION: (userId: string, appId: string) =>
      `/roles/applications/${userId}/${appId}`,
    REVOKE_FEATURE: (userId: string, featureId: string) =>
      `/roles/features/${userId}/${featureId}`,
    USER_APPLICATIONS: (userId: string) =>
      `/roles/users/${userId}/applications`,
    USER_FEATURES: (userId: string) => `/roles/users/${userId}/features`,
  },
} as const;
