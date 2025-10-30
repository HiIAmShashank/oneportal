/**
 * DataTableToolbar - Filter toolbar with global search and column filters
 *
 * Displays filter controls above the table
 * Uses shadcn Input and Button components
 */

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FacetedFilter } from "./FacetedFilter";
import { ViewOptions } from "./ViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalSearch?: boolean;
  columnFilters?: boolean;
  globalSearchPlaceholder?: string;
  showViewOptions?: boolean;
  density?: "compact" | "default" | "comfortable";
  onDensityChange?: (density: "compact" | "default" | "comfortable") => void;
  filterMode?: "toolbar" | "inline";
  onFilterModeChange?: (mode: "toolbar" | "inline") => void;
}

export function DataTableToolbar<TData>({
  table,
  globalSearch = true,
  columnFilters = true,
  globalSearchPlaceholder = "Search all columns...",
  showViewOptions = true,
  density = "default",
  onDensityChange,
  filterMode = "toolbar",
  onFilterModeChange,
}: DataTableToolbarProps<TData>) {
  const [showColumnFilters, setShowColumnFilters] = React.useState(true);
  const globalFilterValue = table.getState().globalFilter;
  const hasFilters =
    table.getState().columnFilters.length > 0 || globalFilterValue;

  return (
    <div className="space-y-4 border-b border-border dark:border-border bg-background dark:bg-background px-4 py-3">
      {/* Global Search */}
      {globalSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={(globalFilterValue as string) ?? ""}
              onChange={(e) =>
                table.setGlobalFilter(e.target.value || undefined)
              }
              placeholder={globalSearchPlaceholder}
              className="pl-10"
            />
          </div>

          {/* Clear All Filters Button */}
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                table.setGlobalFilter(undefined);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}

          {/* View Options Button */}
          {showViewOptions && (
            <ViewOptions
              table={table}
              showFilterToggle={columnFilters}
              showFilters={showColumnFilters}
              onFiltersToggle={setShowColumnFilters}
              showDensityToggle={true}
              density={density}
              onDensityChange={onDensityChange}
              showFilterModeToggle={columnFilters}
              filterMode={filterMode}
              onFilterModeChange={onFilterModeChange}
            />
          )}
        </div>
      )}

      {/* Column Filters */}
      {columnFilters && showColumnFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                column.getCanFilter() &&
                column.columnDef.enableColumnFilter !== false,
            )
            .map((column) => (
              <FacetedFilter
                key={column.id}
                column={column}
                title={
                  typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id
                }
              />
            ))}
        </div>
      )}
    </div>
  );
}
