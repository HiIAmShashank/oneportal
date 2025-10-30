/**
 * Mock Server API Utilities
 *
 * Simulates realistic server-side operations for DataTable V2:
 * - Pagination
 * - Sorting
 * - Filtering (column and global)
 * - Network latency
 * - Error scenarios
 */

import type {
  ServerSideParams,
  ServerSideResponse,
} from "@one-portal/ui/data-table-v2";

// =============================================================================
// CONFIGURATION
// =============================================================================

export interface MockAPIConfig {
  /** Network latency in milliseconds (default: 500) */
  delay?: number;
  /** Probability of random errors (0-1, default: 0) */
  errorRate?: number;
  /** Custom error message */
  errorMessage?: string;
}

// =============================================================================
// DELAY UTILITY
// =============================================================================

/**
 * Simulate network latency
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// COMPARISON UTILITIES
// =============================================================================

/**
 * Generic comparison function for sorting
 */
function compare(a: unknown, b: unknown): number {
  // Handle null/undefined
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Handle numbers
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();

  if (aStr < bStr) return -1;
  if (aStr > bStr) return 1;
  return 0;
}

// =============================================================================
// FILTER UTILITIES
// =============================================================================

/**
 * Check if a value matches a filter
 */
function matchesFilter(value: unknown, filterValue: unknown): boolean {
  // Handle undefined/null
  if (value == null) return false;

  // Array filter (multi-select)
  if (Array.isArray(filterValue)) {
    return filterValue.length === 0 || filterValue.includes(value);
  }

  // Range filter [min, max]
  if (
    Array.isArray(filterValue) &&
    filterValue.length === 2 &&
    typeof value === "number"
  ) {
    const [min, max] = filterValue;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  }

  // Date range filter
  if (Array.isArray(filterValue) && filterValue.length === 2) {
    const [start, end] = filterValue;
    if (start && end && value instanceof Date) {
      return value >= start && value <= end;
    }
  }

  // String contains (case-insensitive)
  if (typeof filterValue === "string") {
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  }

  // Exact match
  return value === filterValue;
}

/**
 * Check if a row matches the global filter
 */
function matchesGlobalFilter<TData extends Record<string, unknown>>(
  row: TData,
  globalFilter: string,
): boolean {
  if (!globalFilter) return true;

  const searchTerm = globalFilter.toLowerCase();

  return Object.values(row).some((value) => {
    if (value == null) return false;

    // Handle dates
    if (value instanceof Date) {
      return value.toISOString().toLowerCase().includes(searchTerm);
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.some((item) =>
        String(item).toLowerCase().includes(searchTerm),
      );
    }

    // Handle objects
    if (typeof value === "object") {
      return JSON.stringify(value).toLowerCase().includes(searchTerm);
    }

    // Handle primitives
    return String(value).toLowerCase().includes(searchTerm);
  });
}

// =============================================================================
// MOCK SERVER API
// =============================================================================

export interface MockServerAPI<TData> {
  fetchData: (params: ServerSideParams) => Promise<ServerSideResponse<TData>>;
  setConfig: (config: Partial<MockAPIConfig>) => void;
  getConfig: () => MockAPIConfig;
}

/**
 * Create a mock server API for a dataset
 *
 * @param allData - Complete dataset to operate on
 * @param config - Optional configuration
 * @returns Mock API with fetchData function
 */
export function createMockServerAPI<TData extends Record<string, unknown>>(
  allData: TData[],
  initialConfig: MockAPIConfig = {},
): MockServerAPI<TData> {
  let config: MockAPIConfig = {
    delay: 500,
    errorRate: 0,
    errorMessage: "Failed to fetch data from server",
    ...initialConfig,
  };

  /**
   * Fetch data with server-side operations
   */
  async function fetchData(
    params: ServerSideParams,
  ): Promise<ServerSideResponse<TData>> {
    // Simulate network latency
    await delay(config.delay || 500);

    // Simulate random errors
    if (config.errorRate && Math.random() < config.errorRate) {
      throw new Error(config.errorMessage || "Server error");
    }

    // Start with full dataset
    let result = [...allData];

    // 1. Apply global filter first
    if (params.globalFilter && params.globalFilter.trim() !== "") {
      result = result.filter((row) =>
        matchesGlobalFilter(row, params.globalFilter || ""),
      );
    }

    // 2. Apply column filters
    if (params.filters) {
      for (const [columnId, filterValue] of Object.entries(params.filters)) {
        if (filterValue === undefined || filterValue === null) continue;

        result = result.filter((row) => {
          const value = row[columnId];
          return matchesFilter(value, filterValue);
        });
      }
    }

    // 3. Apply sorting
    if (params.sortBy) {
      result.sort((a, b) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        const comparison = compare(aVal, bVal);
        return params.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    // Get total count after filtering but before pagination
    const totalCount = result.length;

    // 4. Apply pagination
    const start = params.page * params.pageSize;
    const end = start + params.pageSize;
    const paginatedData = result.slice(start, end);

    // Return server response
    return {
      data: paginatedData,
      totalCount,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  return {
    fetchData,
    setConfig: (newConfig) => {
      config = { ...config, ...newConfig };
    },
    getConfig: () => ({ ...config }),
  };
}

// =============================================================================
// PRESETS FOR COMMON SCENARIOS
// =============================================================================

/**
 * Fast API preset - Quick responses, no errors
 */
export function createFastAPI<TData extends Record<string, unknown>>(
  data: TData[],
): MockServerAPI<TData> {
  return createMockServerAPI(data, {
    delay: 200,
    errorRate: 0,
  });
}

/**
 * Slow API preset - Realistic delays
 */
export function createSlowAPI<TData extends Record<string, unknown>>(
  data: TData[],
): MockServerAPI<TData> {
  return createMockServerAPI(data, {
    delay: 1500,
    errorRate: 0,
  });
}

/**
 * Unreliable API preset - Random delays and errors
 */
export function createUnreliableAPI<TData extends Record<string, unknown>>(
  data: TData[],
): MockServerAPI<TData> {
  return createMockServerAPI(data, {
    delay: Math.random() * 2000 + 500, // 500-2500ms
    errorRate: 0.15, // 15% error rate
    errorMessage: "Network timeout - please try again",
  });
}

// =============================================================================
// HELPER: BUILD FILTERS OBJECT FROM COLUMN FILTERS STATE
// =============================================================================

/**
 * Convert TanStack Table ColumnFiltersState to filters object
 */
export function buildFiltersObject(
  columnFilters: Array<{ id: string; value: unknown }>,
): Record<string, unknown> {
  const filters: Record<string, unknown> = {};

  for (const filter of columnFilters) {
    if (filter.value !== undefined && filter.value !== null) {
      filters[filter.id] = filter.value;
    }
  }

  return filters;
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export { delay, compare, matchesFilter, matchesGlobalFilter };
