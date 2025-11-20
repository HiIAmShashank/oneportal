/**
 * Domino Event System API Endpoints
 */

export const API_ENDPOINTS = {
  EVENTS: {
    LIST: "/events",
  },
  EVENT_TYPES: {
    LIST: "/eventTypes",
  },
  APPLICATIONS: {
    LIST: "/applications",
  },
} as const;

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 100;
