import type { RemoteApp, RemoteAppMenuItem } from "@one-portal/types";
import type { ApiApplicationsResponse } from "../api/types";

/**
 * Transform API applications response to RemoteApp array
 *
 * Filters out inactive applications and features, then maps API fields
 * to the internal RemoteApp format.
 *
 * Transformations:
 * - applicationIdentifier → id
 * - applicationName → name
 * - applicationUrl → remoteEntryUrl
 * - module → moduleName
 * - iconName → icon
 * - features → menuItems (filtered for active only)
 *
 * @param data - API response from GET /applications
 * @returns Array of active RemoteApp with active menuItems
 *
 * @example
 * ```typescript
 * const response = await fetchApplicationsApi(token);
 * const apps = transformApiApplications(response);
 * // Only returns active apps with active features
 * ```
 */
export function transformApiApplications(
  data: ApiApplicationsResponse,
): RemoteApp[] {
  return data.applications
    .filter((app) => app.isActive) // Filter inactive applications
    .map((app) => ({
      id: app.applicationIdentifier,
      name: app.applicationName,
      applicationDescription: app.applicationDescription,
      remoteEntryUrl: app.applicationUrl,
      moduleName: app.module,
      scope: app.scope,
      icon: app.iconName, // Map iconName → icon
      landingPage: app.landingPage,
      enabled: true, // Already filtered by isActive
      order: undefined, // Using API order instead
      isFavorite: app.isFavorite,
      menuItems: app.features
        .filter((feature) => feature.isActive) // Filter inactive features
        .map(
          (feature): RemoteAppMenuItem => ({
            id: feature.featureIdentifier,
            label: feature.featureName,
            path: feature.featureUrl,
            icon: feature.iconName, // Map iconName → icon
            description: feature.featureDescription,
            isFavorite: feature.isFavorite,
          }),
        ),
    }));
}
