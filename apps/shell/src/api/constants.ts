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
    LIST: "/users",
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
  },
  FAVORITES: {
    ADD_APPLICATION: "/favorites/applications",
    REMOVE_APPLICATION: "/favorites/applications",
    ADD_FEATURE: "/favorites/features",
    REMOVE_FEATURE: "/favorites/features",
  },
} as const;
