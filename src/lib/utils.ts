/**
 * src/lib/utils.ts
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges standard class names and safely resolves Tailwind CSS conflicts.
 * Example: cn('px-2 py-1 bg-red-500', 'p-4 bg-blue-500') => 'p-4 bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
