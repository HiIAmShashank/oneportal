/**
 * Custom filter functions for advanced filter types
 *
 * TanStack Table's default filters don't handle ranges and multi-select,
 * so we provide custom implementations
 */

import type { Row, FilterFn } from "@tanstack/react-table";

/**
 * Number range filter - checks if value is between min and max
 */
export const numberRangeFilter: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: [number | undefined, number | undefined],
) => {
  const [min, max] = filterValue;
  const value = row.getValue(columnId) as number;

  if (value === null || value === undefined) return false;

  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  if (min !== undefined && max !== undefined) {
    return numValue >= min && numValue <= max;
  }
  if (min !== undefined) {
    return numValue >= min;
  }
  if (max !== undefined) {
    return numValue <= max;
  }

  return true;
};

/**
 * Date range filter - checks if date is between start and end
 */
export const dateRangeFilter: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: [string, string],
) => {
  const [startDate, endDate] = filterValue;
  const cellValue = row.getValue(columnId);

  if (!cellValue) return false;

  // Convert cell value to Date
  let date: Date;
  if (cellValue instanceof Date) {
    date = cellValue;
  } else if (typeof cellValue === "string") {
    date = new Date(cellValue);
  } else {
    return false;
  }

  if (isNaN(date.getTime())) return false;

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && end) {
    return date >= start && date <= end;
  }
  if (start) {
    return date >= start;
  }
  if (end) {
    return date <= end;
  }

  return true;
};

/**
 * Multi-select filter - checks if value matches any selected option
 */
export const multiSelectFilter: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: string[],
) => {
  if (!filterValue || filterValue.length === 0) return true;

  const value = row.getValue(columnId);
  if (value === null || value === undefined) return false;

  return filterValue.includes(String(value));
};

/**
 * Boolean filter - handles true/false values
 */
export const booleanFilter: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: boolean,
) => {
  if (filterValue === undefined || filterValue === null) return true;

  const value = row.getValue(columnId);

  // Handle various boolean representations
  if (typeof value === "boolean") {
    return value === filterValue;
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();
    if (filterValue === true) {
      return ["true", "yes", "1", "active", "enabled"].includes(normalized);
    }
    return ["false", "no", "0", "inactive", "disabled"].includes(normalized);
  }

  if (typeof value === "number") {
    return filterValue ? value !== 0 : value === 0;
  }

  return false;
};

// Register custom filter functions
export const customFilterFns = {
  numberRange: numberRangeFilter,
  dateRange: dateRangeFilter,
  multiSelect: multiSelectFilter,
  boolean: booleanFilter,
};
