/**
 * useFaceting - Auto-detect filter types based on column data
 *
 * Analyzes column data using TanStack Table's faceting to determine
 * the best filter UI (text, select, number-range, date-range, etc.)
 */

import { useMemo } from "react";
import type { Column } from "@tanstack/react-table";

export type FilterVariant =
  | "text"
  | "number"
  | "number-range"
  | "select"
  | "multi-select"
  | "boolean"
  | "date"
  | "date-range";

export interface FilterMetadata {
  variant: FilterVariant;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
}

interface UseFacetingOptions {
  selectThreshold?: number; // Max unique values for select (default: 10)
}

/**
 * Auto-detect the best filter variant for a column
 */
export function useFaceting<TData>(
  column: Column<TData>,
  options: UseFacetingOptions = {},
): FilterMetadata {
  const { selectThreshold = 10 } = options;

  return useMemo(() => {
    // Check if column has manual filter config in meta
    const meta = column.columnDef.meta;
    if (meta?.filterVariant) {
      return {
        variant: meta.filterVariant,
        options: meta.filterOptions,
      };
    }

    // Get faceted data from TanStack Table
    const facetedUniqueValues = column.getFacetedUniqueValues();
    const facetedMinMax = column.getFacetedMinMaxValues();

    // No data to analyze
    if (facetedUniqueValues.size === 0) {
      return { variant: "text" };
    }

    // Get first few values to analyze type
    const values = Array.from(facetedUniqueValues.keys()).slice(0, 100);
    const uniqueCount = facetedUniqueValues.size;

    // Boolean detection (true/false, yes/no, 0/1)
    if (uniqueCount <= 2) {
      const valuesSet = new Set(
        values.map((v) => String(v).toLowerCase().trim()),
      );
      const booleanPatterns = [
        ["true", "false"],
        ["yes", "no"],
        ["0", "1"],
        ["active", "inactive"],
        ["enabled", "disabled"],
      ];

      for (const pattern of booleanPatterns) {
        if (
          pattern.every((p) => valuesSet.has(p)) &&
          valuesSet.size === pattern.length
        ) {
          return { variant: "boolean" };
        }
      }
    }

    // Number detection
    const allNumbers = values.every(
      (v) => typeof v === "number" || !isNaN(Number(v)),
    );

    if (allNumbers && facetedMinMax) {
      const [min, max] = facetedMinMax;
      // If few unique values, use select; otherwise use range
      if (uniqueCount <= selectThreshold) {
        return {
          variant: "select",
          options: values
            .map((v) => Number(v))
            .sort((a, b) => a - b)
            .map((v) => ({ label: String(v), value: v })),
        };
      }
      return {
        variant: "number-range",
        min: Number(min),
        max: Number(max),
      };
    }

    // Date detection
    const allDates = values.every((v) => {
      if (v instanceof Date) return true;
      if (typeof v !== "string") return false;
      const parsed = new Date(v);
      return !isNaN(parsed.getTime());
    });

    if (allDates) {
      // If few unique dates, use select; otherwise use date range
      if (uniqueCount <= selectThreshold) {
        return {
          variant: "select",
          options: values
            .map((v) => new Date(v))
            .sort((a, b) => a.getTime() - b.getTime())
            .map((v) => ({
              label: v.toLocaleDateString(),
              value: v.toISOString(),
            })),
        };
      }
      return { variant: "date-range" };
    }

    // String-based detection
    // Few unique values -> select dropdown
    if (uniqueCount <= selectThreshold) {
      return {
        variant: "select",
        options: values
          .map((v) => String(v))
          .sort()
          .map((v) => ({ label: v, value: v })),
      };
    }

    // Many unique values -> text search
    return { variant: "text" };
  }, [column, selectThreshold]);
}
