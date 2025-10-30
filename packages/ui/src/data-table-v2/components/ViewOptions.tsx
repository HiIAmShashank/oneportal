/**
 * ViewOptions - Toolbar button for view customization
 *
 * Provides dropdown menu for:
 * - Column visibility toggle
 * - Filter visibility toggle
 * - Density options
 */

import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../components/ui/dropdown-menu";

interface ViewOptionsProps<TData> {
  table: Table<TData>;
  showFilterToggle?: boolean;
  showColumnToggle?: boolean;
  showDensityToggle?: boolean;
  showFilterModeToggle?: boolean;
  density?: "compact" | "default" | "comfortable";
  onDensityChange?: (density: "compact" | "default" | "comfortable") => void;
  filterMode?: "toolbar" | "inline";
  onFilterModeChange?: (mode: "toolbar" | "inline") => void;
  showFilters?: boolean;
  onFiltersToggle?: (show: boolean) => void;
}

export function ViewOptions<TData>({
  table,
  showFilterToggle = true,
  showColumnToggle = true,
  showDensityToggle = false,
  showFilterModeToggle = false,
  density = "default",
  onDensityChange,
  filterMode = "toolbar",
  onFilterModeChange,
  showFilters = true,
  onFiltersToggle,
}: ViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {/* Filter visibility toggle */}
        {showFilterToggle && (
          <>
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showFilters}
              onCheckedChange={(checked) => onFiltersToggle?.(checked)}
            >
              Show Filters
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Column visibility toggles */}
        {showColumnToggle && (
          <>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Density options */}
        {showDensityToggle && onDensityChange && (
          <>
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={density}
              onValueChange={(value) =>
                onDensityChange(value as "compact" | "default" | "comfortable")
              }
            >
              <DropdownMenuRadioItem value="compact">
                Compact
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="default">
                Default
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfortable">
                Comfortable
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Filter mode options */}
        {showFilterModeToggle && onFilterModeChange && (
          <>
            <DropdownMenuLabel>Filter Mode</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filterMode}
              onValueChange={(value) =>
                onFilterModeChange(value as "toolbar" | "inline")
              }
            >
              <DropdownMenuRadioItem value="toolbar">
                Toolbar
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inline">
                Inline
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
