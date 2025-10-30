/**
 * DataTable V2 - Public API
 */

// Main component
export { DataTable } from "./DataTable";

// Sub-components (for advanced composition)
export { TablePagination } from "./components/TablePagination";
export { DataTableToolbar } from "./components/DataTableToolbar";
export { FacetedFilter } from "./components/FacetedFilter";
export { ViewOptions } from "./components/ViewOptions";

// State components (for custom state rendering)
export {
  EmptyState,
  LoadingState,
  ErrorState,
  NoResultsState,
} from "./components/states";
export type {
  EmptyStateProps,
  LoadingStateProps,
  ErrorStateProps,
  NoResultsStateProps,
} from "./components/states";

// Types
export type {
  DataTableProps,
  ColumnDef,
  ColumnMeta,
  FeaturesConfig,
  UIConfig,
  PersistenceConfig,
  ActionsConfig,
  RowAction,
  BulkAction,
  ServerSideParams,
  ServerSideResponse,
  TableState,
  HeaderContext,
  CellContext,
  FooterContext,
  FilterMetadata,
  InferDataType,
  RequireProps,
  OptionalProps,
} from "./types";

// Hooks (for advanced usage)
export { useDataTable } from "./hooks/useDataTable";
export { useFaceting } from "./hooks/useFaceting";
export type { FilterVariant } from "./hooks/useFaceting";
export { usePersistence, usePersistenceSync } from "./hooks/usePersistence";
export type { PersistedState } from "./hooks/usePersistence";

// Utilities (for advanced usage)
export { useDebounce } from "./utils/debounce";

// Custom filter functions (for advanced usage)
export { customFilterFns } from "./filters/customFilters";
