/**
 * DataTable V2 - Improved Type System
 *
 * Clean, grouped props with full TanStack Table v8 feature exposure
 */

import type * as React from "react";
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnSizingState,
  ColumnPinningState,
  ColumnOrderState,
  RowSelectionState,
  PaginationState,
  GroupingState,
  ExpandedState,
  Row,
  Column,
  Table,
  ColumnDef as TanStackColumnDef,
} from "@tanstack/react-table";

// Extend TanStack Table's ColumnMeta interface
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    // Manual filter config (overrides auto-detection)
    filterVariant?:
      | "text"
      | "number"
      | "number-range"
      | "select"
      | "multi-select"
      | "boolean"
      | "date"
      | "date-range";
    filterOptions?: Array<{ label: string; value: unknown }>;
    filterPlaceholder?: string;

    // Display
    headerClassName?: string;
    cellClassName?: string;
    footerClassName?: string;
    tooltip?: string;

    // Internal metadata for column positioning
    __position?: "left" | "right";
  }
}

// ============================================================================
// COLUMN DEFINITION
// ============================================================================

/**
 * Re-export TanStack Table's ColumnDef with our extended ColumnMeta
 */
export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<
  TData,
  TValue
>;

/**
 * Re-export ColumnMeta from TanStack Table (extended via declaration merging above)
 */
export type { ColumnMeta, ColumnFiltersState } from "@tanstack/react-table";

// ============================================================================
// MAIN DATATABLE PROPS
// ============================================================================

export interface DataTableProps<TData> {
  // Core data
  data: TData[];
  columns: ColumnDef<TData, any>[];

  // Feature configuration (grouped)
  features?: FeaturesConfig<TData>;

  // UI configuration (grouped)
  ui?: UIConfig;

  // Persistence configuration (grouped)
  persistence?: PersistenceConfig;
  persistState?: boolean;
  stateKey?: string;

  // Actions configuration (grouped)
  actions?: ActionsConfig<TData>;

  // Callbacks
  onRowClick?: (row: TData) => void;
  onCellClick?: (cell: {
    row: TData;
    columnId: string;
    value: unknown;
  }) => void;

  // Custom row functions
  getRowId?: (row: TData, index: number) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;

  // Loading and error states (for client-side data fetching)
  isLoading?: boolean;
  error?: Error | null;

  // Custom state (advanced users)
  state?: Partial<TableState>;
  onStateChange?: (state: Partial<TableState>) => void;

  // Individual state control (controlled mode)
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  grouping?: GroupingState;
  onGroupingChange?: (grouping: GroupingState) => void;
  expanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;

  // Advanced: Full TanStack Table instance access
  table?: Table<TData>;
  onTableReady?: (table: Table<TData>, refetch?: () => void) => void;

  // Styling
  className?: string;
  containerClassName?: string;
}

// ============================================================================
// GROUPED CONFIGURATION OBJECTS
// ============================================================================

/**
 * Features configuration - all table features in one place
 */
export interface FeaturesConfig<TData = unknown> {
  // Sorting
  sorting?:
    | boolean
    | {
        enabled?: boolean;
        multi?: boolean;
        initialState?: SortingState;
        onChange?: (state: SortingState) => void;
      };

  // Filtering (legacy "filtering", modern "filters")
  filtering?:
    | boolean
    | {
        enabled?: boolean;
        mode?: "faceted" | "manual";
        global?: boolean;
        columns?: boolean;
        initialState?: ColumnFiltersState;
        onChange?: (state: ColumnFiltersState) => void;
        onGlobalFilterChange?: (filter: string) => void;
      };

  // Filtering (modern "filters" prop)
  filters?: {
    enabled?: boolean;
    mode?: "toolbar" | "inline" | "faceted";
    debounceMs?: number;
  };

  // Pagination
  pagination?:
    | boolean
    | {
        enabled?: boolean;
        pageSize?: number;
        pageSizeOptions?: number[];
        showPageInfo?: boolean;
        showPageSizeSelector?: boolean;
        manual?: boolean;
        initialState?: PaginationState;
        onChange?: (state: PaginationState) => void;
        autoResetPageIndex?: boolean;
        pageCount?: number;
        rowCount?: number;
        showFirstLastButtons?: boolean;
      };

  // Row Selection
  selection?: {
    enabled?: boolean;
    mode?: "single" | "multiple";
    pinLeft?: boolean;
    getCanSelect?: (row: Row<TData>) => boolean;
    onChange?: (selection: RowSelectionState) => void;
  };

  // Column Management
  columns?: {
    visibility?: boolean;
    resizing?: boolean;
    reordering?: boolean;
    pinning?: boolean;
    initialVisibility?: VisibilityState;
    initialSizing?: ColumnSizingState;
    initialPinning?: ColumnPinningState;
    initialOrder?: ColumnOrderState;
    onVisibilityChange?: (state: VisibilityState) => void;
    onSizingChange?: (state: ColumnSizingState) => void;
    onPinningChange?: (state: ColumnPinningState) => void;
    onOrderChange?: (state: ColumnOrderState) => void;
  };

  // Row Grouping
  grouping?: {
    enabled?: boolean;
    manualGrouping?: boolean;
    initialState?: GroupingState;
    onChange?: (state: GroupingState) => void;
  };

  // Row Expanding
  expanding?: {
    enabled?: boolean;
    showExpandColumn?: boolean;
    getSubRows?: (row: TData) => TData[] | undefined;
    getCanExpand?: (row: Row<TData>) => boolean;
    renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
    defaultExpanded?: boolean;
    initialState?: ExpandedState;
    onChange?: (state: ExpandedState) => void;
  };

  // Virtualization (V2: NEW!)
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number | ((row: TData) => number);
    overscan?: number;
  };

  // Server-side mode
  serverSide?: {
    enabled: boolean;
    totalCount: number;
    loading?: boolean;
    error?: Error | null;
    onFetch?: (params: ServerSideParams) => Promise<void> | void;

    // Hybrid mode: Enable client-side filtering on server-fetched data
    // When true: column filters work client-side on current page data
    // When false (default): all filtering is server-side
    clientSideFiltering?: boolean;

    // Hybrid mode: Enable client-side sorting on server-fetched data
    // When true: sorting works client-side on current page data
    // When false (default): sorting is server-side
    clientSideSorting?: boolean;

    // Debounce delay for filters/search (default: 300ms)
    debounceMs?: number;
  };
}

/**
 * UI configuration - visual settings
 */
export interface UIConfig {
  // Density
  density?: "compact" | "default" | "comfortable";
  onDensityChange?: (density: "compact" | "default" | "comfortable") => void;

  // Variant
  variant?: "default" | "bordered" | "striped";

  // Layout
  stickyHeader?: boolean;
  stickyColumns?: {
    left?: number;
    right?: number;
  };

  // Toolbar
  showToolbar?: boolean; // Default: true if filtering enabled
  showGlobalSearch?: boolean; // Default: true
  showColumnFilters?: boolean; // Default: true
  globalSearchPlaceholder?: string;
  filterMode?: "toolbar" | "inline"; // Default: "toolbar" - where to show column filters
  onFilterModeChange?: (mode: "toolbar" | "inline") => void;

  // States
  emptyState?: React.ReactNode;
  loadingState?: "skeleton" | "spinner" | React.ReactNode;
  errorState?: React.ReactNode;

  // Messages
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
}

/**
 * Persistence configuration - localStorage
 */
export interface PersistenceConfig {
  key: string; // localStorage key (required if enabled)
  enabled?: boolean; // Default: true
  // What to persist
  include?: Array<
    | "visibility"
    | "sizing"
    | "pinning"
    | "sorting"
    | "filters"
    | "density"
    | "grouping"
  >;
  exclude?: Array<
    | "visibility"
    | "sizing"
    | "pinning"
    | "sorting"
    | "filters"
    | "density"
    | "grouping"
  >;
}

/**
 * Actions configuration - row and bulk actions
 */
export interface ActionsConfig<TData> {
  row?: RowAction<TData>[];
  bulk?: BulkAction<TData>[];
  pinRight?: boolean; // Default: true
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export interface RowAction<TData> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void | Promise<void>;
  variant?: "default" | "destructive" | "outline" | "ghost";
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
  tooltip?: string;
}

export interface BulkAction<TData> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (rows: TData[]) => void | Promise<void>;
  variant?: "default" | "destructive" | "outline" | "ghost";
  disabled?: (rows: TData[]) => boolean;
  minSelection?: number;
  maxSelection?: number;
  tooltip?: string;
}

// ============================================================================
// SERVER-SIDE TYPES
// ============================================================================

export interface ServerSideParams {
  page: number;
  pageSize: number;
  sortBy?: string; // Deprecated: use sorting[] for multi-column support
  sortOrder?: "asc" | "desc"; // Deprecated: use sorting[] for multi-column support
  sorting?: Array<{ id: string; desc: boolean }>; // Multi-column sorting support
  filters?: Record<string, unknown>;
  globalFilter?: unknown;
}

export interface ServerSideResponse<TData> {
  data: TData[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// TABLE STATE
// ============================================================================

export interface TableState {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  columnVisibility: VisibilityState;
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  rowSelection: RowSelectionState;
  grouping: GroupingState;
  expanded: ExpandedState;
}

// ============================================================================
// CONTEXT TYPES (for render props)
// ============================================================================

export interface HeaderContext<TData = unknown> {
  column: Column<TData, unknown>;
  table: Table<TData>;
}

export interface CellContext<TData = unknown> {
  row: Row<TData>;
  column: Column<TData, unknown>;
  getValue: () => unknown;
  table: Table<TData>;
}

export interface FooterContext<TData = unknown> {
  column: Column<TData, unknown>;
  table: Table<TData>;
}

// ============================================================================
// FILTER TYPES (V2: Enhanced with faceting)
// ============================================================================

/**
 * Auto-detected filter metadata (from faceting)
 */
export interface FilterMetadata {
  variant:
    | "text"
    | "number"
    | "number-range"
    | "select"
    | "multi-select"
    | "boolean"
    | "date"
    | "date-range";
  options?: Array<{ label: string; value: unknown; count?: number }>;
  min?: number;
  max?: number;
  uniqueValues?: unknown[];
  totalCount?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract TData type from DataTableProps
 */
export type InferDataType<T> = T extends DataTableProps<infer U> ? U : never;

/**
 * Make specific props required
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific props optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
