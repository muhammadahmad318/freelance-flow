/**
 * src/hooks/useDebounce.ts
 *
 * A custom React hook that delays the update of a value until a specified
 * amount of time has passed since the last change.
 *
 * Crucial for optimizing performance on high-frequency events like text input,
 * preventing excessive API calls (DDOS-ing your own backend) or heavy re-renders.
 */
import { useState, useEffect } from "react";

/**
 * @template T - The type of the value being debounced.
 * @param {T} value - The dynamic value to debounce (e.g., a search term).
 * @param {number} delay - The delay in milliseconds to wait before updating.
 * @returns {T} The debounced value, which will only update after the delay period has elapsed without changes.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
