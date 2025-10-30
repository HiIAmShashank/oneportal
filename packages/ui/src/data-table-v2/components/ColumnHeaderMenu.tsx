/**
 * ColumnHeaderMenu - Dropdown menu for column-specific actions
 *
 * Provides a clean interface for:
 * - Sorting (asc/desc/clear)
 * - Pinning (left/right/unpin)
 * - Visibility (hide column)
 * - Filtering
 * - Grouping
 */

import type { Column, Table } from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Pin,
  PinOff,
  EyeOff,
  Eye,
  Filter,
  Layers,
  MoreVertical,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../../components/ui/dropdown-menu";

interface ColumnHeaderMenuProps<TData> {
  column: Column<TData, unknown>;
  table: Table<TData>;
  title: string;
  onFilterModeChange?: (mode: "toolbar" | "inline") => void;
}

export function ColumnHeaderMenu<TData>({
  column,
  table,
  title,
  onFilterModeChange,
}: ColumnHeaderMenuProps<TData>) {
  const canSort = column.getCanSort();
  const canFilter = column.getCanFilter();
  const canPin = column.getCanPin();
  const canHide = column.getCanHide();
  const canGroup = column.getCanGroup?.();

  const isSorted = column.getIsSorted();
  const isPinned = column.getIsPinned();

  // Check if any columns are currently hidden
  const hiddenColumns = table
    .getAllColumns()
    .filter((col) => !col.getIsVisible() && col.getCanHide());
  const hasHiddenColumns = hiddenColumns.length > 0;

  const handleFilterByColumn = () => {
    // Switch to inline filter mode
    if (onFilterModeChange) {
      onFilterModeChange("inline");
    }
    // Clear any existing filter value to show the filter UI fresh
    column.setFilterValue(undefined);
  };

  const handleShowAllColumns = () => {
    table.toggleAllColumnsVisible(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 data-[state=open]:bg-accent"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open column menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        {/* Sort Options */}
        {canSort && (
          <>
            <DropdownMenuLabel>Sort</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => column.toggleSorting(false)}
              disabled={isSorted === "asc"}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Sort ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.toggleSorting(true)}
              disabled={isSorted === "desc"}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Sort descending
            </DropdownMenuItem>
            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Clear sort
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Filter Options */}
        {canFilter && (
          <>
            <DropdownMenuItem onClick={handleFilterByColumn}>
              <Filter className="mr-2 h-4 w-4" />
              Filter by {title}
            </DropdownMenuItem>
            {column.getFilterValue() && (
              <DropdownMenuItem
                onClick={() => column.setFilterValue(undefined)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear filter
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Grouping Options */}
        {canGroup && (
          <>
            <DropdownMenuItem onClick={() => column.getToggleGroupingHandler()}>
              <Layers className="mr-2 h-4 w-4" />
              Group by {title}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Pin Options */}
        {canPin && (
          <>
            <DropdownMenuLabel>Pin</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => column.pin("left")}
              disabled={isPinned === "left"}
            >
              <Pin className="mr-2 h-4 w-4 -rotate-45" />
              Pin to left
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.pin("right")}
              disabled={isPinned === "right"}
            >
              <Pin className="mr-2 h-4 w-4 rotate-45" />
              Pin to right
            </DropdownMenuItem>
            {isPinned && (
              <DropdownMenuItem onClick={() => column.pin(false)}>
                <PinOff className="mr-2 h-4 w-4" />
                Unpin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Visibility Options */}
        {canHide && (
          <>
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide {title} column
            </DropdownMenuItem>
          </>
        )}

        {/* Show All Columns */}
        {hasHiddenColumns && (
          <>
            {canHide && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={handleShowAllColumns}>
              <Eye className="mr-2 h-4 w-4" />
              Show all columns
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
