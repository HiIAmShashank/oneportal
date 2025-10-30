/**
 * Application Group Item Component
 *
 * Renders a single application with its features in the command palette.
 * Extracted from ApplicationCommandPalette to eliminate code duplication.
 */

import { Command } from "cmdk";
import { DynamicIcon } from "./DynamicIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@one-portal/ui";
import { Bookmark } from "lucide-react";
import type { RemoteApp } from "@one-portal/types";

interface ApplicationGroupItemProps {
  app: RemoteApp;
  onAppSelect: (path: string) => void;
  onFeatureSelect: (path: string) => void;
  onToggleAppFavorite: (
    e: React.MouseEvent,
    appId: string,
    isFavorite: boolean,
  ) => void;
  onToggleFeatureFavorite: (
    e: React.MouseEvent,
    featureId: string,
    isFavorite: boolean,
  ) => void;
}

export function ApplicationGroupItem({
  app,
  onAppSelect,
  onFeatureSelect,
  onToggleAppFavorite,
  onToggleFeatureFavorite,
}: ApplicationGroupItemProps) {
  return (
    <Command.Group
      key={app.id}
      heading={app.name}
      className="overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
    >
      {/* Application landing page */}
      <Command.Item
        value={`${app.id}-home`}
        keywords={
          [app.name, app.moduleName, app.applicationDescription] as string[]
        }
        onSelect={() =>
          onAppSelect(app.landingPage || `/apps/${app.moduleName}`)
        }
        className="relative flex cursor-pointer gap-3 select-none items-center rounded-sm px-2 py-2 text-sm outline-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <DynamicIcon name={app.icon} className="h-5 w-5 shrink-0 self-center" />
        <div className="flex flex-col flex-1 gap-0.5 min-w-0">
          <span className="text-sm font-medium">{app.name}</span>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground truncate">
                {app.applicationDescription}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{app.applicationDescription}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <button
          onClick={(e) =>
            onToggleAppFavorite(e, app.id, app.isFavorite || false)
          }
          className="shrink-0 p-1 hover:bg-accent rounded transition-colors"
          aria-label={
            app.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Bookmark
            className={`h-4 w-4 ${app.isFavorite ? "fill-current text-primary" : "text-muted-foreground"}`}
          />
        </button>
      </Command.Item>

      {/* Features */}
      {app.menuItems && app.menuItems.length > 0 && (
        <>
          <Command.Separator className="-mx-1 my-1 h-px bg-border" />
          {app.menuItems.map((item) => (
            <Command.Item
              key={item.id}
              value={`${app.id}-${item.id}`}
              keywords={[app.name, item.label, item.description] as string[]}
              onSelect={() =>
                onFeatureSelect(`/apps/${app.moduleName}${item.path}`)
              }
              className="relative flex cursor-pointer gap-3 select-none items-center rounded-sm pl-10 pr-2 py-1.5 text-sm outline-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <DynamicIcon
                name={item.icon}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
              <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                <span className="text-sm">{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </span>
                )}
              </div>
              <button
                onClick={(e) =>
                  onToggleFeatureFavorite(e, item.id, item.isFavorite || false)
                }
                className="shrink-0 p-1 hover:bg-accent rounded transition-colors"
                aria-label={
                  item.isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Bookmark
                  className={`h-4 w-4 ${item.isFavorite ? "fill-current text-primary" : "text-muted-foreground"}`}
                />
              </button>
            </Command.Item>
          ))}
        </>
      )}
    </Command.Group>
  );
}
