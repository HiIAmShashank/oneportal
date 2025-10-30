/**
 * API Response Types for OnePortal Backend
 *
 * Types are added incrementally as endpoints are integrated.
 * Full API documentation: docs/API_REFERENCE.md
 */

/**
 * Response from GET /users/me/is-superuser
 */
export interface CheckSuperUserResponse {
  isSuperUser: boolean;
}

/**
 * Feature/menu item within an application
 *
 * Note: applicationIdentifier and applicationName are included for context
 * but may not always be accurate (see API v1.0.1 notes)
 */
export interface ApiFeature {
  featureIdentifier: string;
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
  isActive: boolean;
  isFavorite: boolean;
  applicationIdentifier: string;
  applicationName: string;
}

/**
 * Application entity from backend
 */
export interface ApiApplication {
  applicationIdentifier: string;
  applicationName: string;
  applicationDescription: string;
  applicationUrl: string;
  landingPage: string;
  module: string;
  scope: string;
  iconName: string;
  isActive: boolean;
  isFavorite: boolean;
  features: ApiFeature[];
}

/**
 * Response from GET /applications
 */
export interface ApiApplicationsResponse {
  applications: ApiApplication[];
  totalCount: number;
}
