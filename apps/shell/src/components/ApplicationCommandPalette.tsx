/**
 * Application Command Palette
 *
 * Renders the list of applications and features for the command palette search.
 * Now contains the full Command component structure for proper cmdk filtering.
 *
 * Features:
 * - Search across application names and feature names
 * - Keyboard navigation with arrow keys
 * - Navigate to app landing pages or specific features
 * - Controlled search state synced with Header input
 * - Proper cmdk filtering with all Command components in same tree
 * - Favorites section with bookmark toggle functionality
 */

import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { ApplicationGroupItem } from "./ApplicationGroupItem";
import { useApplications } from "../hooks/useApplications";
import { useToggleApplicationFavorite } from "../hooks/useToggleApplicationFavorite";
import { useToggleFeatureFavorite } from "../hooks/useToggleFeatureFavorite";
import { TooltipProvider, Skeleton } from "@one-portal/ui";
import { AlertCircle, Search } from "lucide-react";

interface ApplicationCommandPaletteProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: () => void;
}

export function ApplicationCommandPalette({
  search,
  onSearchChange,
  onSelect,
}: ApplicationCommandPaletteProps) {
  const navigate = useNavigate();
  const { data: apps = [], isLoading, error } = useApplications();
  const toggleAppFavorite = useToggleApplicationFavorite();
  const toggleFeatureFavorite = useToggleFeatureFavorite();

  const handleSelect = (path: string) => {
    navigate({ to: path });
    onSelect();
  };

  const handleToggleAppFavorite = (
    e: React.MouseEvent,
    appId: string,
    isFavorite: boolean,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    toggleAppFavorite.mutate({ applicationId: appId, isFavorite });
  };

  const handleToggleFeatureFavorite = (
    e: React.MouseEvent,
    featureId: string,
    isFavorite: boolean,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFeatureFavorite.mutate({ featureId, isFavorite });
  };

  // Check if any feature in an app matches the search
  const appHasMatchingFeature = (
    app: (typeof apps)[number],
    searchTerm: string,
  ): boolean => {
    if (!searchTerm || !app.menuItems) return false;
    const searchLower = searchTerm.toLowerCase();
    return app.menuItems.some(
      (item) =>
        item.label.toLowerCase().includes(searchLower) ||
        (item.description &&
          item.description.toLowerCase().includes(searchLower)),
    );
  };

  // Separate favorites from non-favorites
  const favoriteApps = apps.filter((app) => app.isFavorite === true);
  const nonFavoriteApps = apps.filter((app) => app.isFavorite !== true);

  return (
    <Command
      label="Global Command Menu"
      shouldFilter={true}
      filter={(_value: string, search: string, keywords?: string[]) => {
        const searchLower = search.toLowerCase();

        // If no search, show everything
        if (!search) return 1;

        // Check if this is an app home item (value ends with -home)
        const isAppHome = _value.endsWith("-home");
        if (isAppHome) {
          // Show app home if it matches OR if any of its features match
          const appId = _value.replace("-home", "");
          const app = apps.find((a) => a.id === appId);
          if (app && appHasMatchingFeature(app, search)) {
            return 1;
          }
        }

        // Search in keywords (name, moduleName, description, label)
        if (
          keywords &&
          keywords.some((k: string) => k.toLowerCase().includes(searchLower))
        ) {
          return 1;
        }
        return 0;
      }}
    >
      {/* Controlled input synced with Header */}
      <Command.Input
        value={search}
        onValueChange={onSearchChange}
        className="sr-only"
        aria-hidden="true"
      />

      <Command.List className="p-1">
        <TooltipProvider>
          {/* Loading state */}
          {isLoading && (
            <Command.Loading>
              <div className="space-y-2 p-1">
                {/* Section header skeleton */}
                <div className="px-2 py-1.5">
                  <Skeleton className="h-3 w-24" />
                </div>

                {/* Application item skeletons */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-center px-2 py-2 rounded-sm animate-in fade-in-0 duration-300"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <Skeleton className="h-5 w-5 rounded shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-4 rounded shrink-0" />
                  </div>
                ))}
              </div>
            </Command.Loading>
          )}

          {/* Empty state - shows when no results found or error occurred */}
          <Command.Empty>
            <div className="flex flex-col items-center justify-center gap-3 py-12 animate-in fade-in-50 duration-300">
              {error ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="text-center space-y-1 max-w-60">
                    <p className="text-sm font-medium">
                      Unable to load applications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please check your connection and try again
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-1 max-w-60">
                    <p className="text-sm font-medium">No applications found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search terms
                    </p>
                  </div>
                </>
              )}
            </div>
          </Command.Empty>

          {/* Favorites Section */}
          {favoriteApps.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Favorites
              </div>
              {favoriteApps.map((app) => (
                <ApplicationGroupItem
                  key={app.id}
                  app={app}
                  onAppSelect={handleSelect}
                  onFeatureSelect={handleSelect}
                  onToggleAppFavorite={handleToggleAppFavorite}
                  onToggleFeatureFavorite={handleToggleFeatureFavorite}
                />
              ))}
              <Command.Separator className="my-2 h-px bg-border" />
            </div>
          )}

          {/* All Applications Section */}
          {nonFavoriteApps.length > 0 && (
            <div>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                All Applications
              </div>
              {nonFavoriteApps.map((app) => (
                <ApplicationGroupItem
                  key={app.id}
                  app={app}
                  onAppSelect={handleSelect}
                  onFeatureSelect={handleSelect}
                  onToggleAppFavorite={handleToggleAppFavorite}
                  onToggleFeatureFavorite={handleToggleFeatureFavorite}
                />
              ))}
            </div>
          )}
        </TooltipProvider>
      </Command.List>
    </Command>
  );
}
