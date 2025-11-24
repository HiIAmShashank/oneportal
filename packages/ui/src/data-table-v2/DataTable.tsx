/**
 * DataTable V2 - Main Component
 *
 * Clean, composable data table with smart defaults
 *
 * IMPORTANT - Performance Requirements:
 * To prevent infinite re-renders, consumers MUST provide stable references for:
 *
 * 1. `columns` - Use React.useMemo or define outside component
 *    CORRECT:
 *    ```tsx
 *    const columns = useMemo(() => [
 *      { accessorKey: 'name', header: 'Name' },
 *      { accessorKey: 'email', header: 'Email' }
 *    ], []);
 *    ```
 *
 *    WRONG:
 *    ```tsx
 *    const columns = [
 *      { accessorKey: 'name', header: 'Name' }  // Recreated every render!
 *    ];
 *    ```
 *
 * 2. `data` - Use React.useState or React.useMemo
 *    CORRECT:
 *    ```tsx
 *    const [data, setData] = useState(initialData);
 *    // or
 *    const data = useMemo(() => transformedData, [dependencies]);
 *    ```
 *
 *    WRONG:
 *    ```tsx
 *    const data = items.filter(x => x.active);  // Recreated every render!
 *    ```
 *
 * For more details, see TanStack Table documentation:
 * https://tanstack.com/table/latest/docs/guide/data
 */

import * as React from "react";
import {
  flexRender,
  type RowSelectionState,
  type ColumnOrderState,
  type ColumnSizingState,
  type Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useDataTable } from "./hooks/useDataTable";
import { usePersistence } from "./hooks/usePersistence";
import { useDebounce } from "./utils/debounce";
import { TablePagination } from "./components/TablePagination";
import { DataTableToolbar } from "./components/DataTableToolbar";
import { FacetedFilter } from "./components/FacetedFilter";
import { BulkActions } from "./components/BulkActions";
import { ColumnHeaderMenu } from "./components/ColumnHeaderMenu";
import { DraggableColumnHeader } from "./components/DraggableColumnHeader";
import {
  EmptyState,
  LoadingState,
  ErrorState,
  NoResultsState,
} from "./components/states";
import {
  createSelectionColumn,
  createActionsColumn,
  createExpandColumn,
} from "./utils/columnUtils";
import type { DataTableProps } from "./types";
import { cn } from "../lib/utils";

export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    data,
    columns,
    features,
    ui,
    persistence,
    actions,
    onRowClick,
    onCellClick,
    state,
    onStateChange,
    onTableReady,
    className,
    containerClassName,
  } = props;

  // Ref for virtualization
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Initialize persistence hook
  const { saveState, restoreState } = usePersistence(persistence);

  // Restore persisted state on mount (only once)
  const persistedState = React.useMemo(
    () => {
      return restoreState();
    },
    // Empty deps array is intentional - only restore on mount

    [],
  );

  // Row selection state (internal if not controlled)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Density state (internal if not controlled)
  const [internalDensity, setInternalDensity] = React.useState<
    "compact" | "default" | "comfortable"
  >(persistedState.density || ui?.density || "default");

  // Filter mode state (internal if not controlled)
  const [internalFilterMode, setInternalFilterMode] = React.useState<
    "toolbar" | "inline"
  >(persistedState.filterMode || ui?.filterMode || "inline");

  // Column order state (internal if not controlled)
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    persistedState.order || [],
  );

  // Column sizing state (internal if not controlled)
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    persistedState.sizing || {},
  );

  // DnD sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Handle density changes
  const handleDensityChange = React.useCallback(
    (newDensity: "compact" | "default" | "comfortable") => {
      // If controlled, notify parent
      if (ui?.density !== undefined && ui?.onDensityChange) {
        ui.onDensityChange(newDensity);
      } else {
        // Otherwise update internal state
        setInternalDensity(newDensity);
      }
    },
    [ui?.density, ui?.onDensityChange],
  );

  // Handle filter mode changes
  const handleFilterModeChange = React.useCallback(
    (newMode: "toolbar" | "inline") => {
      // If controlled, notify parent
      if (ui?.filterMode !== undefined && ui?.onFilterModeChange) {
        ui.onFilterModeChange(newMode);
      } else {
        // Otherwise update internal state
        setInternalFilterMode(newMode);
      }
    },
    [ui?.filterMode, ui?.onFilterModeChange],
  );

  // Handle drag end for column reordering
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);

        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        setColumnOrder(newOrder);

        // Notify parent if callback provided
        if (features?.columns?.onOrderChange) {
          features.columns.onOrderChange(newOrder);
        }
      }
    },
    [columnOrder, features?.columns],
  );

  // Handle column sizing changes - this is the state updater for TanStack Table
  const handleColumnSizingChange = React.useCallback(
    (
      updaterOrValue:
        | ColumnSizingState
        | ((old: ColumnSizingState) => ColumnSizingState),
    ) => {
      const newValue =
        typeof updaterOrValue === "function"
          ? updaterOrValue(state?.columnSizing ?? columnSizing)
          : updaterOrValue;

      // If controlled, notify parent via onStateChange
      if (state?.columnSizing !== undefined && onStateChange) {
        onStateChange({ columnSizing: newValue });
      } else {
        // Otherwise update internal state
        setColumnSizing(newValue);
      }
    },
    [state?.columnSizing, columnSizing, onStateChange],
  );

  // Current density (controlled or internal)
  const currentDensity = ui?.density ?? internalDensity;

  // Current filter mode (controlled or internal)
  const currentFilterMode = ui?.filterMode ?? internalFilterMode;

  // Build final columns array with selection, expand, and actions
  const finalColumns = React.useMemo(() => {
    let cols = [...columns];

    // Prepend selection column if enabled
    if (features?.selection) {
      const selectionCol = createSelectionColumn<TData>({
        mode: features.selection.mode,
        position: features.selection.pinLeft ? "left" : undefined,
      });
      cols = [selectionCol, ...cols];
    }

    // Prepend expand column if expanding is enabled and explicit column requested
    if (features?.expanding?.enabled && features?.expanding?.showExpandColumn) {
      const expandCol = createExpandColumn<TData>();
      cols = [expandCol, ...cols];
    }

    // Append actions column if provided
    if (actions?.row && actions.row.length > 0) {
      const actionsCol = createActionsColumn<TData>(actions.row, {
        position: actions.pinRight ? "right" : "left",
      });
      cols = [...cols, actionsCol];
    }

    return cols;
  }, [
    columns,
    features?.selection,
    features?.expanding,
    actions?.row,
    actions?.pinRight,
  ]);

  // Auto-detect column pinning from metadata
  const autoPinning = React.useMemo(() => {
    const pinning: { left?: string[]; right?: string[] } = {};

    finalColumns.forEach((col) => {
      const position = col.meta?.__position as "left" | "right" | undefined;
      if (position === "left" && col.id) {
        pinning.left = pinning.left || [];
        pinning.left.push(col.id);
      } else if (position === "right" && col.id) {
        pinning.right = pinning.right || [];
        pinning.right.push(col.id);
      }
    });

    return Object.keys(pinning).length > 0 ? pinning : undefined;
  }, [finalColumns]);

  // Initialize column order from finalColumns or use provided initialOrder
  React.useEffect(() => {
    // Only initialize if columnOrder is empty (not set from persistence)
    if (columnOrder.length === 0) {
      if (
        features?.columns?.initialOrder &&
        features.columns.initialOrder.length > 0
      ) {
        setColumnOrder(features.columns.initialOrder);
      } else {
        // Initialize with column IDs from finalColumns
        const colIds = finalColumns
          .map((col) => col.id)
          .filter((id): id is string => id !== undefined);
        setColumnOrder(colIds);
      }
    }
  }, [finalColumns, features?.columns?.initialOrder, columnOrder.length]);

  // Handle row selection changes - this is the state updater for TanStack Table
  const handleRowSelectionChange = React.useCallback(
    (
      updaterOrValue:
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState),
    ) => {
      const newValue =
        typeof updaterOrValue === "function"
          ? updaterOrValue(state?.rowSelection ?? rowSelection)
          : updaterOrValue;

      // If controlled, notify parent via onStateChange
      if (state?.rowSelection !== undefined && onStateChange) {
        onStateChange({ rowSelection: newValue });
      } else {
        // Otherwise update internal state
        setRowSelection(newValue);
      }
    },
    [state?.rowSelection, rowSelection, onStateChange],
  );

  // Enhanced features with row selection, column sizing updaters, and persisted initial state
  const enhancedFeatures = React.useMemo(() => {
    return {
      ...features,
      // Inject persisted sorting state
      ...(features?.sorting &&
        persistedState.sorting && {
          sorting: {
            ...(typeof features.sorting === "object" ? features.sorting : {}),
            initialState: persistedState.sorting,
          },
        }),
      // Inject persisted filtering state
      ...(features?.filtering &&
        persistedState.filters && {
          filtering: {
            ...(typeof features.filtering === "object"
              ? features.filtering
              : {}),
            initialState: persistedState.filters,
          },
        }),
      // Inject persisted grouping state
      ...(features?.grouping &&
        persistedState.grouping && {
          grouping: {
            ...features.grouping,
            initialState: persistedState.grouping,
          },
        }),
      // Add selection state updater if selection is enabled
      ...(features?.selection && {
        selection: {
          ...features.selection,
          onRowSelectionChange: handleRowSelectionChange,
        },
      }),
      // Inject persisted column state and add column sizing state updater
      ...(features?.columns?.resizing !== false && {
        columns: {
          ...features?.columns,
          onSizingChange: handleColumnSizingChange,
          // Inject persisted column state
          ...(persistedState.visibility && {
            initialVisibility: persistedState.visibility,
          }),
          ...(persistedState.sizing && {
            initialSizing: persistedState.sizing,
          }),
          // Use persisted pinning if available, otherwise use auto-detected pinning
          ...((persistedState.pinning || autoPinning) && {
            initialPinning: persistedState.pinning || autoPinning,
          }),
          ...(persistedState.order && {
            initialOrder: persistedState.order,
          }),
        },
      }),
    };
  }, [
    features,
    handleRowSelectionChange,
    handleColumnSizingChange,
    persistedState,
    autoPinning,
  ]);

  // Create table instance with smart defaults
  const table = useDataTable({
    data,
    columns: finalColumns,
    features: enhancedFeatures,
    state: {
      ...state,
      // Use controlled state if provided, otherwise internal state
      rowSelection: state?.rowSelection ?? rowSelection,
      columnOrder: state?.columnOrder ?? columnOrder,
      columnSizing: state?.columnSizing ?? columnSizing,
    },
    onStateChange,
  });

  // Persist table state changes to localStorage
  React.useEffect(() => {
    if (persistence && persistence.enabled !== false) {
      const tableState = table.getState();

      saveState({
        visibility: tableState.columnVisibility,
        sizing: columnSizing,
        pinning: tableState.columnPinning,
        order: columnOrder,
        sorting: tableState.sorting,
        filters: tableState.columnFilters,
        density: internalDensity,
        filterMode: internalFilterMode,
        grouping: tableState.grouping,
      });
    }
  }, [
    persistence,
    table.getState().columnVisibility,
    table.getState().columnPinning,
    table.getState().sorting,
    table.getState().columnFilters,
    table.getState().grouping,
    columnSizing,
    columnOrder,
    internalDensity,
    internalFilterMode,
    saveState,
  ]);

  // Handle row selection changes
  React.useEffect(() => {
    const currentSelection = table.getState().rowSelection;

    // Update internal state if not controlled
    if (!state?.rowSelection) {
      setRowSelection(currentSelection);
    }

    // Call onChange callback if provided
    if (features?.selection?.onChange) {
      features.selection.onChange(table.getState().rowSelection);
    }
  }, [table.getState().rowSelection, features?.selection, state?.rowSelection]);

  // Debounce configuration
  const debounceMs = features?.serverSide?.debounceMs ?? 300;

  // Debounce filters and global filter for server-side
  const debouncedColumnFilters = useDebounce(
    table.getState().columnFilters,
    debounceMs,
  );
  const debouncedGlobalFilter = useDebounce(
    table.getState().globalFilter,
    debounceMs,
  );

  // Build server-side fetch function
  const handleServerFetch = React.useCallback(() => {
    if (features?.serverSide?.enabled && features.serverSide.onFetch) {
      const tableState = table.getState();

      // Build filters object from column filters
      // Skip if clientSideFiltering is enabled (filters are client-side only)
      const filters: Record<string, unknown> = {};
      if (!features.serverSide.clientSideFiltering) {
        for (const filter of debouncedColumnFilters) {
          // Skip undefined, null, and empty strings
          if (
            filter.value !== undefined &&
            filter.value !== null &&
            filter.value !== ""
          ) {
            filters[filter.id] = filter.value;
          }
        }
      }

      // Build server-side params
      const params = {
        page: tableState.pagination.pageIndex,
        pageSize: tableState.pagination.pageSize,
        // Legacy single-column sorting (deprecated, use sorting array)
        sortBy: features.serverSide.clientSideSorting
          ? undefined
          : tableState.sorting[0]?.id,
        sortOrder: features.serverSide.clientSideSorting
          ? undefined
          : tableState.sorting[0]?.desc
            ? ("desc" as const)
            : ("asc" as const),
        // Modern multi-column sorting
        sorting:
          features.serverSide.clientSideSorting || !tableState.sorting.length
            ? undefined
            : tableState.sorting.map((s) => ({ id: s.id, desc: s.desc })),
        filters,
        // Use debounced global filter
        globalFilter: features.serverSide.clientSideFiltering
          ? undefined
          : debouncedGlobalFilter,
      };

      // Trigger fetch callback
      features.serverSide.onFetch(params);
    }
  }, [
    features?.serverSide,
    table,
    debouncedColumnFilters,
    debouncedGlobalFilter,
  ]);

  // Handle server-side data fetching
  // Extract state values to avoid recreating arrays in dependency array
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const sorting = table.getState().sorting;
  const sortingKey = JSON.stringify(sorting); // Stable reference for sorting array

  React.useEffect(() => {
    if (features?.serverSide?.enabled) {
      handleServerFetch();
    }
  }, [
    handleServerFetch,
    features?.serverSide?.enabled,
    pageIndex,
    pageSize,
    // Only re-fetch on sorting changes if NOT using clientSideSorting
    // Use stringified key for stable reference
    ...(features?.serverSide?.clientSideSorting ? [] : [sortingKey]),
    // Debounced filters will trigger refetch via handleServerFetch deps
  ]);

  // Expose table instance and refetch function to parent
  React.useEffect(() => {
    onTableReady?.(table, handleServerFetch);
  }, [table, onTableReady, handleServerFetch]);

  // Extract UI config with defaults
  const density = currentDensity;
  const variant = ui?.variant || "default";
  const stickyHeader = ui?.stickyHeader || false;

  // Density classes (memoized for stable reference)
  const densityClasses = React.useMemo(
    () => ({
      compact: "text-xs",
      default: "text-sm",
      comfortable: "text-base",
    }),
    [],
  );

  const cellPaddingClasses = React.useMemo(
    () => ({
      compact: "px-2 py-1",
      default: "px-4 py-2",
      comfortable: "px-6 py-4",
    }),
    [],
  );

  // Variant classes (memoized for stable reference)
  const variantClasses = React.useMemo(
    () => ({
      default: "",
      bordered: "border border-border dark:border-border",
      striped: "",
    }),
    [],
  );

  // Check if table is empty
  const isEmpty = data.length === 0;
  // Support loading/error states from either top-level props or serverSide config
  const isLoading = props.isLoading ?? features?.serverSide?.loading;
  const hasError = props.error ?? features?.serverSide?.error;

  // Calculate visible column count for state components
  const visibleColumnCount = table
    .getAllColumns()
    .filter((col) => col.getIsVisible()).length;

  // Check if pagination is enabled
  const paginationEnabled = features?.pagination !== false;

  // Check if filtering/toolbar is enabled
  const filteringEnabled = features?.filtering !== false;
  const filterMode = currentFilterMode;
  const showToolbar = ui?.showToolbar !== false && filteringEnabled;
  const showGlobalSearch = ui?.showGlobalSearch !== false;
  const showColumnFilters =
    ui?.showColumnFilters !== false && filterMode === "toolbar";
  const showInlineFilters =
    ui?.showColumnFilters !== false && filterMode === "inline";

  // Check if column reordering is enabled
  const reorderingEnabled = features?.columns?.reordering === true;

  // Get column IDs for DnD (only non-pinned columns can be reordered)
  const columnIds = React.useMemo(
    () => table.getAllLeafColumns().map((col) => col.id),
    [table],
  );

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: React.useCallback(
      (index) => {
        const rowHeight = features?.virtualization?.rowHeight;
        if (typeof rowHeight === "function") {
          const row = table.getRowModel().rows[index];
          return row ? rowHeight(row.original) : 48;
        }
        return (rowHeight as number) ?? 48;
      },
      [features?.virtualization?.rowHeight, table],
    ),
    overscan: features?.virtualization?.overscan ?? 10,
    enabled: features?.virtualization?.enabled === true,
    getItemKey: React.useCallback(
      (index: number) => table.getRowModel().rows[index]?.id ?? index,
      [table],
    ),
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  const renderRow = React.useCallback(
    (row: Row<TData>) => (
      <React.Fragment key={row.id}>
        <tr
          onClick={() => onRowClick?.(row.original)}
          className={cn(
            "border-b border-border dark:border-border transition-colors",
            "hover:bg-muted/50 dark:hover:bg-muted/50",
            onRowClick && "cursor-pointer",
            variant === "striped" && "even:bg-muted/30 dark:even:bg-muted/20",
          )}
          data-state={row.getIsSelected() ? "selected" : undefined}
        >
          {(() => {
            // Cache visible cells once per row for performance
            const visibleCells = row.getVisibleCells();
            return visibleCells.map((cell, cellIndex) => {
              const isPinned = cell.column.getIsPinned();
              const isLastLeftPinned =
                isPinned === "left" &&
                visibleCells[cellIndex + 1]?.column.getIsPinned() !== "left";
              const isFirstRightPinned =
                isPinned === "right" &&
                visibleCells[cellIndex - 1]?.column.getIsPinned() !== "right";

              // Check if this is the first data column for row expansion indentation
              // Skip special columns (expand, select, actions) and apply to first content column
              const firstDataColumnIndex = visibleCells.findIndex(
                (c) =>
                  c.column.id !== "expand" &&
                  c.column.id !== "select" &&
                  c.column.id !== "actions",
              );
              const isFirstDataColumn = cellIndex === firstDataColumnIndex;

              // Calculate indentation based on row depth for hierarchical data
              // Use larger multiplier (2.5rem per level) for better visibility
              const depthIndentation =
                isFirstDataColumn && row.depth > 0
                  ? `${row.depth * 2.5}rem`
                  : undefined;

              return (
                <td
                  key={cell.id}
                  style={{
                    width: `${cell.column.getSize()}px`,
                    // Pinning styles
                    position: isPinned ? "sticky" : "relative",
                    left:
                      isPinned === "left"
                        ? `${cell.column.getStart("left")}px`
                        : undefined,
                    right:
                      isPinned === "right"
                        ? `${cell.column.getAfter("right")}px`
                        : undefined,
                    zIndex: isPinned ? 9 : undefined,
                    // Add indentation based on row depth for hierarchical data
                    // Only applied to first data column for visual tree structure
                    paddingLeft: depthIndentation,
                  }}
                  onClick={(e) => {
                    if (onCellClick) {
                      e.stopPropagation();
                      onCellClick({
                        row: row.original,
                        columnId: cell.column.id,
                        value: cell.getValue(),
                      });
                    }
                  }}
                  className={cn(
                    cellPaddingClasses[density],
                    densityClasses[density],
                    cell.column.columnDef.meta?.cellClassName,
                    "align-middle relative",
                    "[&:has([role=checkbox])]:pr-0",
                    // Special handling for expand column to prevent cutoff
                    cell.column.id === "expand" && "px-2!",
                    variantClasses[variant],
                    // Add background to pinned cells to prevent text overlap
                    isPinned && "bg-background dark:bg-background",
                    // Left-pinned column shadow (on right edge) using ::before
                    isLastLeftPinned &&
                      "before:content-[''] before:absolute before:top-0 before:bottom-0 before:right-0 before:w-[10px] before:translate-x-full before:pointer-events-none before:bg-linear-to-r before:from-black/10 dark:before:from-black/30 before:to-transparent",
                    // Right-pinned column shadow (on left edge) using ::after
                    isFirstRightPinned &&
                      "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:w-[10px] after:-translate-x-full after:pointer-events-none after:bg-linear-to-l after:from-black/10 dark:after:from-black/30 after:to-transparent",
                  )}
                >
                  {/* Special columns (expand, select, actions) - always render normally */}
                  {["expand", "select", "actions"].includes(cell.column.id) ? (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  ) : /* Grouped cell with expand/collapse */
                  cell.getIsGrouped() ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          row.toggleExpanded();
                        }}
                        className="inline-flex items-center justify-center h-6 w-6 rounded-sm hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                      >
                        {row.getIsExpanded() ? (
                          <span className="text-sm">▼</span>
                        ) : (
                          <span className="text-sm">▶</span>
                        )}
                      </button>
                      <span className="font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                        ({row.subRows.length})
                      </span>
                    </div>
                  ) : cell.getIsAggregated() ? (
                    /* Aggregated cell */
                    <div className="font-medium">
                      {flexRender(
                        cell.column.columnDef.aggregatedCell ??
                          cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  ) : cell.getIsPlaceholder() ? null : (
                    /* Normal cell */
                    <div className="truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  )}
                </td>
              );
            });
          })()}
        </tr>
        {/* Custom expandable content (detail panel) - renders immediately after parent row */}
        {row.getIsExpanded() && features?.expanding?.renderExpandedRow && (
          <tr>
            <td
              colSpan={row.getAllCells().length}
              className={cn(
                cellPaddingClasses[density],
                "bg-muted/30 dark:bg-muted/10",
              )}
            >
              {features.expanding.renderExpandedRow(row)}
            </td>
          </tr>
        )}
      </React.Fragment>
    ),
    [
      onRowClick,
      variant,
      density,
      cellPaddingClasses,
      densityClasses,
      variantClasses,
      onCellClick,
      features?.expanding,
    ],
  );

  const tableContent = (
    <div
      className={cn("w-full", containerClassName)}
      data-density={density}
      data-variant={variant}
    >
      {/* Toolbar with filters */}
      {showToolbar && !isLoading && !hasError && (
        <DataTableToolbar
          table={table}
          globalSearch={showGlobalSearch}
          columnFilters={showColumnFilters}
          globalSearchPlaceholder={ui?.globalSearchPlaceholder}
          showViewOptions={true}
          density={density}
          onDensityChange={handleDensityChange}
          filterMode={filterMode}
          onFilterModeChange={handleFilterModeChange}
        />
      )}

      {/* Bulk Actions */}
      {actions?.bulk && actions.bulk.length > 0 && !isLoading && !hasError && (
        <div className="mb-4">
          <BulkActions table={table} actions={actions.bulk} />
        </div>
      )}

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className={cn(
          "relative w-full",
          "rounded-md border border-border dark:border-border",
          "bg-background dark:bg-background",
          // Only add overflow-auto when NOT in loading state to prevent scrollwheel flicker
          // Ensure overflow is handled when virtualization is enabled
          (!isLoading || features?.virtualization?.enabled) && "overflow-auto",
          // Add max height for virtualization or sticky header
          (stickyHeader || features?.virtualization?.enabled) &&
            "max-h-[600px]",
          className,
        )}
      >
        <table
          className={cn("w-full caption-bottom", densityClasses[density])}
          style={{
            tableLayout: "fixed",
            minWidth: table.getTotalSize(),
          }}
        >
          {/* Table Head */}
          <thead
            className={cn(
              "border-b border-border dark:border-border",
              stickyHeader &&
                "sticky top-0 z-20 bg-background dark:bg-background shadow-xs",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => {
              // Header row - column titles, sort, menu, resize
              const headerRow = (
                <tr
                  key={`${headerGroup.id}-header`}
                  className="hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                >
                  {headerGroup.headers.map((header, index) => {
                    const isPinned = header.column.getIsPinned();
                    const isLastLeftPinned =
                      isPinned === "left" &&
                      headerGroup.headers[index + 1]?.column.getIsPinned() !==
                        "left";
                    const isFirstRightPinned =
                      isPinned === "right" &&
                      headerGroup.headers[index - 1]?.column.getIsPinned() !==
                        "right";
                    const canResize = header.column.getCanResize();

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: `${header.getSize()}px`,
                          // Pinning styles
                          position: isPinned ? "sticky" : "relative",
                          left:
                            isPinned === "left"
                              ? `${header.column.getStart("left")}px`
                              : undefined,
                          right:
                            isPinned === "right"
                              ? `${header.column.getAfter("right")}px`
                              : undefined,
                          zIndex: isPinned ? 10 : undefined,
                        }}
                        className={cn(
                          "group", // Add group for hover effects
                          cellPaddingClasses[density],
                          header.column.columnDef.meta?.headerClassName,
                          "text-left align-middle font-bold",
                          "text-muted-foreground dark:text-muted-foreground",
                          "[&:has([role=checkbox])]:pr-0",
                          "relative",
                          // Column separator border (only for non-pinned columns)
                          !isPinned &&
                            "after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-border last:after:hidden",
                          // Special handling for expand column to prevent cutoff
                          header.column.id === "expand" && "px-2!",
                          variantClasses[variant],
                          (stickyHeader || isPinned) &&
                            "bg-background dark:bg-background",
                          // Left-pinned column shadow (on right edge) using ::before
                          isLastLeftPinned &&
                            "before:content-[''] before:absolute before:top-0 before:bottom-0 before:right-0 before:w-[10px] before:translate-x-full before:pointer-events-none before:bg-linear-to-r before:from-black/10 dark:before:from-black/30 before:to-transparent",
                          // Right-pinned column shadow (on left edge) using ::after
                          isFirstRightPinned &&
                            "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:w-[10px] after:-translate-x-full after:pointer-events-none after:bg-linear-to-l after:from-black/10 dark:after:from-black/30 after:to-transparent",
                        )}
                      >
                        {header.isPlaceholder ? null : reorderingEnabled &&
                          !isPinned ? (
                          <DraggableColumnHeader header={header}>
                            <div className="flex items-center gap-1 justify-between relative">
                              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                                <span className="truncate">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                </span>
                                {/* Sorting indicator */}
                                {header.column.getIsSorted() && (
                                  <span className="text-primary">
                                    {header.column.getIsSorted() === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                )}
                              </div>
                              {/* Only show menu for non-special columns */}
                              {!["select", "expand", "actions"].includes(
                                header.column.id,
                              ) && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bg-background dark:bg-background pointer-events-none">
                                  <div className="pointer-events-auto">
                                    <ColumnHeaderMenu
                                      column={header.column}
                                      table={table}
                                      title={
                                        typeof header.column.columnDef
                                          .header === "string"
                                          ? header.column.columnDef.header
                                          : header.column.id
                                      }
                                      onFilterModeChange={
                                        handleFilterModeChange
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </DraggableColumnHeader>
                        ) : (
                          <div className="flex items-center gap-1 justify-between relative">
                            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                              <span className="truncate">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </span>
                              {/* Sorting indicator */}
                              {header.column.getIsSorted() && (
                                <span className="text-primary">
                                  {header.column.getIsSorted() === "asc"
                                    ? "↑"
                                    : "↓"}
                                </span>
                              )}
                            </div>
                            {/* Only show menu for non-special columns */}
                            {!["select", "expand", "actions"].includes(
                              header.column.id,
                            ) && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bg-background dark:bg-background pointer-events-none">
                                <div className="pointer-events-auto">
                                  <ColumnHeaderMenu
                                    column={header.column}
                                    table={table}
                                    title={
                                      typeof header.column.columnDef.header ===
                                      "string"
                                        ? header.column.columnDef.header
                                        : header.column.id
                                    }
                                    onFilterModeChange={handleFilterModeChange}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Resize handle */}
                        {canResize && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                              "hover:bg-primary/50 active:bg-primary",
                              header.column.getIsResizing() && "bg-primary",
                            )}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              );

              // Filter row - separate row for inline filters
              const filterRow = showInlineFilters ? (
                <tr
                  key={`${headerGroup.id}-filters`}
                  className="bg-muted/30 dark:bg-muted/20 border-b border-border dark:border-border"
                >
                  {headerGroup.headers.map((header, index) => {
                    const isPinned = header.column.getIsPinned();
                    const isLastLeftPinned =
                      isPinned === "left" &&
                      headerGroup.headers[index + 1]?.column.getIsPinned() !==
                        "left";
                    const isFirstRightPinned =
                      isPinned === "right" &&
                      headerGroup.headers[index - 1]?.column.getIsPinned() !==
                        "right";
                    const isSpecialColumn = [
                      "select",
                      "expand",
                      "actions",
                    ].includes(header.column.id);

                    return (
                      <th
                        key={`${header.id}-filter`}
                        style={{
                          width: `${header.getSize()}px`,
                          // Pinning styles
                          position: isPinned ? "sticky" : "relative",
                          left:
                            isPinned === "left"
                              ? `${header.column.getStart("left")}px`
                              : undefined,
                          right:
                            isPinned === "right"
                              ? `${header.column.getAfter("right")}px`
                              : undefined,
                          zIndex: isPinned ? 10 : undefined,
                        }}
                        className={cn(
                          cellPaddingClasses[density],
                          densityClasses[density],
                          "relative",
                          (stickyHeader || isPinned) &&
                            (isPinned
                              ? "bg-sidebar dark:bg-muted"
                              : "bg-muted/30 dark:bg-muted/20"),
                          // Left-pinned column shadow (on right edge) using ::before
                          isLastLeftPinned &&
                            "before:content-[''] before:absolute before:top-0 before:bottom-0 before:right-0 before:w-[10px] before:translate-x-full before:pointer-events-none before:bg-linear-to-r before:from-black/10 dark:before:from-black/30 before:to-transparent",
                          // Right-pinned column shadow (on left edge) using ::after
                          isFirstRightPinned &&
                            "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:w-[10px] after:-translate-x-full after:pointer-events-none after:bg-linear-to-l after:from-black/10 dark:after:from-black/30 after:to-transparent",
                        )}
                      >
                        {/* Show filter only for non-special columns that allow filtering */}
                        {!isSpecialColumn &&
                        header.column.getCanFilter() &&
                        header.column.columnDef.enableColumnFilter !== false ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <FacetedFilter
                              column={header.column}
                              title={
                                typeof header.column.columnDef.header ===
                                "string"
                                  ? header.column.columnDef.header
                                  : header.column.id
                              }
                              inline={true}
                              density={density}
                            />
                          </div>
                        ) : (
                          // Empty placeholder to maintain consistent hook calls
                          <div className="h-8" />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ) : null;

              // Wrap both rows in Fragment
              const headerContent = (
                <React.Fragment key={headerGroup.id}>
                  {headerRow}
                  {filterRow}
                </React.Fragment>
              );

              // Wrap with SortableContext if reordering is enabled
              return reorderingEnabled ? (
                <SortableContext key={headerGroup.id} items={columnIds}>
                  {headerContent}
                </SortableContext>
              ) : (
                headerContent
              );
            })}
          </thead>

          {/* Table Body */}
          <tbody>
            {/* Loading State */}
            {isLoading && (
              <tr>
                <td colSpan={visibleColumnCount}>
                  {typeof ui?.loadingState === "object" &&
                  React.isValidElement(ui.loadingState) ? (
                    ui.loadingState
                  ) : (
                    <LoadingState
                      message={ui?.loadingMessage}
                      mode={
                        ui?.loadingState === "skeleton" ? "skeleton" : "spinner"
                      }
                      columnCount={visibleColumnCount}
                      density={currentDensity}
                    />
                  )}
                </td>
              </tr>
            )}

            {/* Error State */}
            {hasError && !isLoading && (
              <tr>
                <td colSpan={visibleColumnCount}>
                  {typeof ui?.errorState === "object" &&
                  React.isValidElement(ui.errorState) ? (
                    ui.errorState
                  ) : (
                    <ErrorState
                      message={ui?.errorMessage}
                      details={features?.serverSide?.error?.message}
                      onRetry={handleServerFetch}
                    />
                  )}
                </td>
              </tr>
            )}

            {/* Empty State */}
            {isEmpty && !isLoading && !hasError && (
              <tr>
                <td colSpan={visibleColumnCount}>
                  {typeof ui?.emptyState === "object" &&
                  React.isValidElement(ui.emptyState) ? (
                    ui.emptyState
                  ) : (
                    <EmptyState message={ui?.emptyMessage} />
                  )}
                </td>
              </tr>
            )}

            {/* No Results from Filters */}
            {!isEmpty &&
              !isLoading &&
              !hasError &&
              table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={visibleColumnCount}>
                    <NoResultsState
                      onClearFilters={() => {
                        table.resetColumnFilters();
                        table.setGlobalFilter("");
                      }}
                    />
                  </td>
                </tr>
              )}

            {/* Data Rows */}
            {!isLoading &&
              !hasError &&
              !isEmpty &&
              (features?.virtualization?.enabled ? (
                <>
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <tr>
                      <td
                        style={{
                          height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px`,
                          border: 0,
                          padding: 0,
                        }}
                        colSpan={visibleColumnCount}
                      />
                    </tr>
                  )}
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = table.getRowModel().rows[virtualRow.index];
                    if (!row) return null;
                    return renderRow(row);
                  })}
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <tr>
                      <td
                        style={{
                          height: `${
                            rowVirtualizer.getTotalSize() -
                            (rowVirtualizer.getVirtualItems()[
                              rowVirtualizer.getVirtualItems().length - 1
                            ]?.end ?? 0)
                          }px`,
                          border: 0,
                          padding: 0,
                        }}
                        colSpan={visibleColumnCount}
                      />
                    </tr>
                  )}
                </>
              ) : (
                table.getRowModel().rows.map((row) => renderRow(row))
              ))}
          </tbody>

          {/* Table Footer - for aggregations and summaries */}
          {/* Only render footer if at least one column has a footer defined */}
          {table
            .getFooterGroups()
            .some((group) =>
              group.headers.some((header) => header.column.columnDef.footer),
            ) && (
            <tfoot className="border-t border-border dark:border-border">
              {table.getFooterGroups().map((footerGroup) => (
                <tr
                  key={footerGroup.id}
                  className="bg-muted/50 dark:bg-muted/20 font-medium"
                >
                  {footerGroup.headers.map((footer, index) => {
                    const isPinned = footer.column.getIsPinned();
                    const isLastLeftPinned =
                      isPinned === "left" &&
                      footerGroup.headers[index + 1]?.column.getIsPinned() !==
                        "left";
                    const isFirstRightPinned =
                      isPinned === "right" &&
                      footerGroup.headers[index - 1]?.column.getIsPinned() !==
                        "right";

                    return (
                      <th
                        key={footer.id}
                        colSpan={footer.colSpan}
                        style={{
                          width: `${footer.getSize()}px`,
                          // Pinning styles
                          position: isPinned ? "sticky" : "relative",
                          left:
                            isPinned === "left"
                              ? `${footer.column.getStart("left")}px`
                              : undefined,
                          right:
                            isPinned === "right"
                              ? `${footer.column.getAfter("right")}px`
                              : undefined,
                          zIndex: isPinned ? 10 : undefined,
                        }}
                        className={cn(
                          cellPaddingClasses[density],
                          "text-left align-middle relative",
                          "text-muted-foreground dark:text-muted-foreground",
                          variantClasses[variant],
                          isPinned && "bg-muted/50 dark:bg-muted/20",
                          // Left-pinned column shadow (on right edge) using ::before
                          isLastLeftPinned &&
                            "before:content-[''] before:absolute before:top-0 before:bottom-0 before:right-0 before:w-[10px] before:translate-x-full before:pointer-events-none before:bg-linear-to-r before:from-black/10 dark:before:from-black/30 before:to-transparent",
                          // Right-pinned column shadow (on left edge) using ::after
                          isFirstRightPinned &&
                            "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:w-[10px] after:-translate-x-full after:pointer-events-none after:bg-linear-to-l after:from-black/10 dark:after:from-black/30 after:to-transparent",
                        )}
                      >
                        {footer.isPlaceholder
                          ? null
                          : flexRender(
                              footer.column.columnDef.footer,
                              footer.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Controls */}
      {paginationEnabled && !isEmpty && !isLoading && !hasError && (
        <TablePagination
          table={table}
          pageSizeOptions={
            typeof features?.pagination === "object"
              ? features.pagination.pageSizeOptions
              : undefined
          }
          showPageInfo={
            typeof features?.pagination === "object"
              ? features.pagination.showPageInfo
              : true
          }
          showPageSizeSelector={
            typeof features?.pagination === "object"
              ? features.pagination.showPageSizeSelector
              : true
          }
          rowCount={
            typeof features?.pagination === "object"
              ? features.pagination.rowCount
              : undefined
          }
          showFirstLastButtons={
            typeof features?.pagination === "object"
              ? features.pagination.showFirstLastButtons
              : true
          }
        />
      )}
    </div>
  );

  // Wrap with DndContext if reordering is enabled
  return reorderingEnabled ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {tableContent}
    </DndContext>
  ) : (
    tableContent
  );
}

DataTable.displayName = "DataTable";
