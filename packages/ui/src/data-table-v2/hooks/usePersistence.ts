/**
 * usePersistence - localStorage hook for DataTable state
 *
 * Handles persisting and restoring table state to/from localStorage.
 * Follows OnePortal localStorage key convention: oneportal:datatable:{key}:{property}
 */

import { useEffect, useCallback } from "react";
import type {
  VisibilityState,
  ColumnSizingState,
  ColumnPinningState,
  ColumnOrderState,
  SortingState,
  ColumnFiltersState,
  GroupingState,
} from "@tanstack/react-table";
import type { PersistenceConfig } from "../types";

export interface PersistedState {
  visibility?: VisibilityState;
  sizing?: ColumnSizingState;
  pinning?: ColumnPinningState;
  order?: ColumnOrderState;
  sorting?: SortingState;
  filters?: ColumnFiltersState;
  density?: "compact" | "default" | "comfortable";
  filterMode?: "toolbar" | "inline";
  grouping?: GroupingState;
}

type PersistedKey = keyof PersistedState;

/**
 * Hook for persisting DataTable state to localStorage
 */
export function usePersistence(config?: PersistenceConfig) {
  // If no config or disabled, return no-op functions
  if (!config || config.enabled === false) {
    return {
      saveState: () => {},
      restoreState: () => ({}) as PersistedState,
      clearState: () => {},
    };
  }

  const { key, include, exclude } = config;

  // Determine which keys to persist
  const shouldPersist = useCallback(
    (stateKey: PersistedKey): boolean => {
      // If include is specified, only persist included keys
      if (include && include.length > 0) {
        return include.includes(stateKey as any);
      }

      // If exclude is specified, persist everything except excluded keys
      if (exclude && exclude.length > 0) {
        return !exclude.includes(stateKey as any);
      }

      // By default, persist everything
      return true;
    },
    [include, exclude],
  );

  /**
   * Save state to localStorage
   */
  const saveState = useCallback(
    (state: Partial<PersistedState>) => {
      try {
        Object.entries(state).forEach(([stateKey, value]) => {
          if (shouldPersist(stateKey as PersistedKey)) {
            const storageKey = `oneportal:datatable:${key}:${stateKey}`;
            localStorage.setItem(storageKey, JSON.stringify(value));
          }
        });
      } catch (error) {
        console.error(
          "[DataTable] Failed to save state to localStorage:",
          error,
        );
      }
    },
    [key, shouldPersist],
  );

  /**
   * Restore state from localStorage
   */
  const restoreState = useCallback((): PersistedState => {
    const restored: PersistedState = {};

    try {
      const keys: PersistedKey[] = [
        "visibility",
        "sizing",
        "pinning",
        "order",
        "sorting",
        "filters",
        "density",
        "filterMode",
        "grouping",
      ];

      keys.forEach((stateKey) => {
        if (shouldPersist(stateKey)) {
          const storageKey = `oneportal:datatable:${key}:${stateKey}`;
          const value = localStorage.getItem(storageKey);

          if (value) {
            try {
              restored[stateKey] = JSON.parse(value);
            } catch (parseError) {
              console.warn(
                `[DataTable] Failed to parse persisted state for ${stateKey}:`,
                parseError,
              );
            }
          }
        }
      });
    } catch (error) {
      console.error(
        "[DataTable] Failed to restore state from localStorage:",
        error,
      );
    }

    return restored;
  }, [key, shouldPersist]);

  /**
   * Clear persisted state from localStorage
   */
  const clearState = useCallback(() => {
    try {
      const keys: PersistedKey[] = [
        "visibility",
        "sizing",
        "pinning",
        "order",
        "sorting",
        "filters",
        "density",
        "filterMode",
        "grouping",
      ];

      keys.forEach((stateKey) => {
        if (shouldPersist(stateKey)) {
          const storageKey = `oneportal:datatable:${key}:${stateKey}`;
          localStorage.removeItem(storageKey);
        }
      });
    } catch (error) {
      console.error(
        "[DataTable] Failed to clear state from localStorage:",
        error,
      );
    }
  }, [key, shouldPersist]);

  return {
    saveState,
    restoreState,
    clearState,
  };
}

/**
 * Hook for auto-syncing state changes to localStorage
 */
export function usePersistenceSync(
  config: PersistenceConfig | undefined,
  state: Partial<PersistedState>,
) {
  const { saveState } = usePersistence(config);

  useEffect(() => {
    if (config && config.enabled !== false) {
      saveState(state);
    }
  }, [config, state, saveState]);
}
