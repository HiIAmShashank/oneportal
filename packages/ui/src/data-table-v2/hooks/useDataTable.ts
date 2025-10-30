/**
 * useDataTable - Core TanStack Table wrapper with smart defaults
 *
 * Simplifies TanStack Table setup with sensible defaults and grouped config
 */

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import type {
  Table,
  Row,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import type { DataTableProps } from "../types";
import { customFilterFns } from "../filters/customFilters";

type UseDataTableProps<TData> = Pick<
  DataTableProps<TData>,
  "data" | "columns" | "features" | "state" | "onStateChange"
>;

// Normalized config types (resolved from union types)
type NormalizedSortingConfig = {
  enabled: boolean;
  multi?: boolean;
  initialState?: SortingState;
  onChange?: (state: SortingState) => void;
};

type NormalizedFilteringConfig = {
  enabled: boolean;
  mode: "faceted" | "manual";
  global: boolean;
  columns: boolean;
  initialState?: ColumnFiltersState;
  onChange?: (state: ColumnFiltersState) => void;
};

type NormalizedPaginationConfig = {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  manual?: boolean;
  initialState?: PaginationState;
  onChange?: (state: PaginationState) => void;
};

/**
 * Core hook that wraps TanStack Table with smart defaults
 */
export function useDataTable<TData>(
  props: UseDataTableProps<TData>,
): Table<TData> {
  const {
    data,
    columns,
    features = {},
    state: customState,
    onStateChange,
  } = props;

  // ============================================================================
  // Extract and normalize feature configs
  // ============================================================================

  // Sorting config
  const sortingConfig: NormalizedSortingConfig = useMemo(() => {
    if (features.sorting === false) return { enabled: false };
    if (features.sorting === true || features.sorting === undefined)
      return { enabled: true, multi: true };
    return { enabled: true, multi: true, ...features.sorting };
  }, [features.sorting]);

  // Filtering config
  const filteringConfig: NormalizedFilteringConfig = useMemo(() => {
    if (features.filtering === false)
      return {
        enabled: false,
        mode: "faceted" as const,
        global: true,
        columns: true,
      };
    if (features.filtering === true || features.filtering === undefined) {
      return {
        enabled: true,
        mode: "faceted" as const,
        global: true,
        columns: true,
      };
    }
    return {
      enabled: true,
      mode: "faceted" as const,
      global: true,
      columns: true,
      ...features.filtering,
    };
  }, [features.filtering]);

  // Pagination config
  const paginationConfig: NormalizedPaginationConfig = useMemo(() => {
    if (features.pagination === false) return { enabled: false, pageSize: 10 };
    if (features.pagination === true || features.pagination === undefined)
      return { enabled: true, pageSize: 10 };
    return { enabled: true, pageSize: 10, ...features.pagination };
  }, [features.pagination]);

  // Selection config
  const selectionConfig = useMemo(() => {
    if (!features.selection) return { mode: "none" as const, pinLeft: false };
    return { pinLeft: true, ...features.selection };
  }, [features.selection]);

  // Column config
  const columnConfig = useMemo(() => {
    return {
      visibility: true,
      resizing: true,
      reordering: false, // Requires DndContext, opt-in
      pinning: true,
      ...features.columns,
    };
  }, [features.columns]);

  // Grouping config
  const groupingConfig = useMemo(() => {
    if (!features.grouping) return { enabled: false };
    return features.grouping;
  }, [features.grouping]);

  // Expanding config
  const expandingConfig = useMemo(() => {
    if (!features.expanding) return { enabled: false };
    return features.expanding;
  }, [features.expanding]);

  // Server-side config
  const serverSideConfig = useMemo(() => {
    if (!features.serverSide)
      return { enabled: false, totalCount: 0, loading: false, error: null };
    return features.serverSide;
  }, [features.serverSide]);

  // ============================================================================
  // Build TanStack Table options
  // ============================================================================

  const tableOptions = useMemo(() => {
    // Convert our ColumnDef to TanStack's format
    const tanstackColumns = columns.map((col) => ({
      ...col,
      // Ensure accessorKey is properly typed
      ...("accessorKey" in col &&
        col.accessorKey && { accessorKey: col.accessorKey as string }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    return {
      data,
      columns: tanstackColumns,

      // Default column settings (can be overridden per column)
      defaultColumn: {
        minSize: 80, // Button width (32px) + padding (48px) = 80px minimum
        size: 150, // Default column width
        maxSize: 500, // Reasonable maximum width
      },

      // Core
      getCoreRowModel: getCoreRowModel(),

      // Custom filter functions
      filterFns: customFilterFns,

      // Sorting
      enableSorting: sortingConfig.enabled,
      ...(sortingConfig.enabled &&
        !serverSideConfig.enabled && {
          getSortedRowModel: getSortedRowModel(),
          enableMultiSort: sortingConfig.multi,
        }),
      manualSorting: serverSideConfig.enabled,

      // Filtering
      ...(filteringConfig.enabled &&
        !serverSideConfig.enabled && {
          getFilteredRowModel: getFilteredRowModel(),
          // V2: Enable faceting for smart filter detection
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          getFacetedMinMaxValues: getFacetedMinMaxValues(),
          enableFilters: true,
          enableGlobalFilter: filteringConfig.global,
          enableColumnFilters: filteringConfig.columns,
        }),
      manualFiltering: serverSideConfig.enabled,

      // Pagination
      ...(paginationConfig.enabled &&
        !serverSideConfig.enabled && {
          getPaginationRowModel: getPaginationRowModel(),
        }),
      manualPagination: serverSideConfig.enabled,

      // Row selection
      ...(selectionConfig.mode !== "none" && {
        // V2: enableRowSelection can be boolean or function for conditional selection
        enableRowSelection: selectionConfig.getCanSelect
          ? (row: Row<TData>) => selectionConfig.getCanSelect!(row)
          : true,
        enableMultiRowSelection: selectionConfig.mode === "multiple",
        // V2: Add state updater for controlled/uncontrolled mode
        // @ts-expect-error - onRowSelectionChange is added by DataTable component
        ...(selectionConfig.onRowSelectionChange && {
          // @ts-expect-error - onRowSelectionChange is added by DataTable component
          onRowSelectionChange: selectionConfig.onRowSelectionChange,
        }),
      }),

      // Column features
      enableColumnResizing: columnConfig.resizing,
      enableHiding: columnConfig.visibility,
      enablePinning: columnConfig.pinning,
      columnResizeMode: "onChange" as const,
      // Column ordering (only when reordering is enabled)
      ...(columnConfig.reordering && {
        onColumnOrderChange: columnConfig.onOrderChange,
      }),

      // Grouping
      ...(groupingConfig.enabled && {
        getGroupedRowModel: getGroupedRowModel(),
        enableGrouping: true,
      }),

      // Expanding
      ...(expandingConfig.enabled && {
        getExpandedRowModel: getExpandedRowModel(),
        enableExpanding: true,
        ...(expandingConfig.getSubRows && {
          getSubRows: expandingConfig.getSubRows,
        }),
        ...(expandingConfig.getCanExpand && {
          getRowCanExpand: expandingConfig.getCanExpand,
        }),
      }),

      // Server-side
      ...(serverSideConfig.enabled && {
        pageCount: serverSideConfig.totalCount
          ? Math.ceil(
              serverSideConfig.totalCount / (paginationConfig.pageSize || 10),
            )
          : undefined,
      }),

      // Initial state for uncontrolled mode (only used if no customState provided)
      initialState: {
        ...(sortingConfig.initialState && {
          sorting: sortingConfig.initialState,
        }),
        ...(filteringConfig.initialState && {
          columnFilters: filteringConfig.initialState,
        }),
        ...(paginationConfig.initialState && {
          pagination: paginationConfig.initialState,
        }),
        ...(paginationConfig.pageSize && {
          pagination: {
            pageIndex: 0,
            pageSize: paginationConfig.pageSize,
          },
        }),
        ...(columnConfig.initialVisibility && {
          columnVisibility: columnConfig.initialVisibility,
        }),
        ...(columnConfig.initialSizing && {
          columnSizing: columnConfig.initialSizing,
        }),
        ...(columnConfig.initialPinning && {
          columnPinning: columnConfig.initialPinning,
        }),
        ...(columnConfig.initialOrder && {
          columnOrder: columnConfig.initialOrder,
        }),
        ...(groupingConfig.initialState && {
          grouping: groupingConfig.initialState,
        }),
        ...(expandingConfig.enabled && {
          expanded: expandingConfig.initialState || {}, // Default to collapsed
        }),
      },

      // Controlled state (only if parent provides it)
      ...(customState && { state: customState }),

      // Callbacks
      ...(sortingConfig.onChange && {
        onSortingChange: sortingConfig.onChange,
      }),
      ...(filteringConfig.onChange && {
        onColumnFiltersChange: filteringConfig.onChange,
      }),
      ...(paginationConfig.onChange && {
        onPaginationChange: paginationConfig.onChange,
      }),
      ...(columnConfig.onVisibilityChange && {
        onColumnVisibilityChange: columnConfig.onVisibilityChange,
      }),
      ...(columnConfig.onSizingChange && {
        onColumnSizingChange: columnConfig.onSizingChange,
      }),
      ...(columnConfig.onPinningChange && {
        onColumnPinningChange: columnConfig.onPinningChange,
      }),
      ...(groupingConfig.onChange && {
        onGroupingChange: groupingConfig.onChange,
      }),
      ...(expandingConfig.onChange && {
        onExpandedChange: expandingConfig.onChange,
      }),
      ...(onStateChange && { onStateChange }),
    };
  }, [
    data,
    columns,
    sortingConfig,
    filteringConfig,
    paginationConfig,
    selectionConfig,
    columnConfig,
    groupingConfig,
    expandingConfig,
    serverSideConfig,
    customState,
    onStateChange,
  ]);

  const table = useReactTable(tableOptions) as Table<TData>;

  return table;
}
