/**
 * API Response Types for OnePortal Admin Backend
 *
 * Types are added incrementally as endpoints are integrated.
 */

/**
 * Response from GET /users/me/is-superuser
 */
export interface CheckSuperUserResponse {
  isSuperUser: boolean;
}

/**
 * User entity from backend
 */
export interface ApiUser {
  userIdentifier: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Request body for POST /users
 */
export interface CreateUserRequest {
  email: string;
  displayName: string;
}

/**
 * Response from POST /users
 */
export interface CreateUserResponse {
  userIdentifier: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Request body for PUT /users/{userIdentifier}
 */
export interface UpdateUserRequest {
  displayName: string;
}

/**
 * Response from PUT /users/{userIdentifier}
 */
export interface UpdateUserResponse {
  userIdentifier: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Owner information from backend
 */
export interface OwnerDto {
  userIdentifier: string;
  email: string;
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
  owner: OwnerDto | null;
}

/**
 * Request body for POST /adm/applications
 */
export interface CreateApplicationRequest {
  applicationName: string;
  applicationDescription: string;
  applicationUrl: string;
  landingPage: string;
  module: string;
  scope: string;
  iconName: string;
  ownerUserIdentifier: string;
}

/**
 * Response from POST /adm/applications
 */
export interface CreateApplicationResponse {
  applicationIdentifier: string;
  applicationName: string;
  applicationDescription: string;
  applicationUrl: string;
  landingPage: string;
  module: string;
  scope: string;
  iconName: string;
  isActive: boolean;
  owner: OwnerDto | null;
}

/**
 * Request body for PUT /adm/applications/{id}
 */
export interface UpdateApplicationRequest {
  applicationName: string;
  applicationDescription: string;
  applicationUrl: string;
  landingPage: string;
  module: string;
  scope: string;
  iconName: string;
  ownerUserIdentifier: string;
}

/**
 * Response from PUT /adm/applications/{id}
 */
export interface UpdateApplicationResponse {
  applicationIdentifier: string;
  applicationName: string;
  applicationDescription: string;
  applicationUrl: string;
  landingPage: string;
  module: string;
  scope: string;
  iconName: string;
  isActive: boolean;
  owner: OwnerDto | null;
}

/**
 * Response from GET /applications
 */
export interface ApiApplicationsResponse {
  applications: ApiApplication[];
  totalCount: number;
}

/**
 * Feature entity from backend (ApplicationFeatureDto)
 */
export interface ApiFeature {
  featureIdentifier: string;
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
  applicationIdentifier: string;
  isActive: boolean;
  applicationName: string;
}

/**
 * Request body for POST /features
 */
export interface CreateFeatureRequest {
  applicationIdentifier: string;
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
}

/**
 * Response from POST /features
 */
export interface CreateFeatureResponse {
  featureIdentifier: string;
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
  applicationIdentifier: string;
  isActive: boolean;
  applicationName: string;
}

/**
 * Request body for PUT /features/{featureIdentifier}
 */
export interface UpdateFeatureRequest {
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
}

/**
 * Response from PUT /features/{featureIdentifier}
 */
export interface UpdateFeatureResponse {
  featureIdentifier: string;
  featureName: string;
  featureDescription: string;
  featureUrl: string;
  iconName: string;
  applicationIdentifier: string;
  isActive: boolean;
  applicationName: string;
}

/**
 * Role entity from backend
 */
export interface ApiRole {
  roleIdentifier: string;
  roleName: string;
  roleLevel: number;
}

/**
 * User application role from backend
 */
export interface UserApplicationRole {
  userIdentifier: string;
  userEmail: string;
  userDisplayName: string;
  applicationIdentifier: string;
  applicationName: string;
  role: ApiRole;
  grantedAt: string;
  grantedByUserIdentifier: string;
}

/**
 * User feature role from backend
 */
export interface UserFeatureRole {
  userIdentifier: string;
  userEmail: string;
  userDisplayName: string;
  featureIdentifier: string;
  featureName: string;
  role: ApiRole;
  grantedAt: string;
  grantedByUserIdentifier: string;
}

/**
 * Request body for POST /roles/applications
 */
export interface GrantApplicationRoleRequest {
  userIdentifier: string;
  applicationIdentifier: string;
  roleIdentifier: string;
}

/**
 * Request body for POST /roles/features
 */
export interface GrantFeatureRoleRequest {
  userIdentifier: string;
  featureIdentifier: string;
  roleIdentifier: string;
}
