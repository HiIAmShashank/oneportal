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
import { TooltipProvider, Spinner } from "@one-portal/ui";
import { AlertCircle } from "lucide-react";

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
              <div className="flex items-center justify-center gap-2 py-8">
                <Spinner size="sm" />
                <span className="text-sm text-muted-foreground">
                  Loading applications...
                </span>
              </div>
            </Command.Loading>
          )}

          {/* Empty state - shows when no results found or error occurred */}
          <Command.Empty>
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              {error && (
                <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
              )}
              <p className="text-sm text-muted-foreground">
                {error
                  ? "Failed to load applications. Please try again."
                  : !isLoading
                    ? "No results found."
                    : ""}
              </p>
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
