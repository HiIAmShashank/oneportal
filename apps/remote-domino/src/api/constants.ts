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
  SUBSCRIPTIONS: {
    LIST: "/subscriptions",
  },
  JOB_TYPES: {
    LIST: "/jobTypes",
  },
  WORKFLOW_STEPS: {
    LIST: "/workflowTypes/false",
  },
  WORKFLOW_STEP_TYPES: {
    LIST: "/workflowStepTypes/false",
  },
} as const;

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 100;
