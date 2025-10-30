/**
 * Debounce Hook
 *
 * Delays updating a value until after a specified delay has passed
 * since the last time the value changed. Useful for:
 * - Search inputs (prevent excessive API calls)
 * - Filter inputs
 * - Any rapid state changes that trigger expensive operations
 */

import { useEffect, useState } from "react";

/**
 * Debounce a value - updates only after the delay period with no changes
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This only runs 300ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
