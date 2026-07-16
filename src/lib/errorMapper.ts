/**
 * src/lib/errorMapper.ts
*
* Global Error Interceptor for mapping raw Supabase/PostgreSQL errors
* to human-readable strings. Ensures technical errors do not reach the UI.
*/
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Error mapping dictionary for Supabase/PostgreSQL error codes.
 */
export const SUPABASE_ERROR_DICTIONARY: Record<string, string> = {
  // Unique Violation (e.g. duplicate email)
  "23505": "This record already exists.",

  // Foreign Key Violation (ON DELETE RESTRICT)
  "23503": "Action denied: This record is tied to existing data.",

  // Check Constraint Violation
  "23514": "Invalid data provided. Please ensure the project end date occurs after the start date.",

  // RLS / Insufficient Privilege Violation
  "42501": "You do not have permission to assign a project to this client.",

  // Data Type Mismatch
  "22P02": "Invalid format. Please ensure budget values are numerical.",

  // Parse Error
  "PGRST100": "Invalid search format provided.",
};

/**
 * Parses a given error object (typically from Supabase) and returns
 * a user-friendly error message.
 *
 * @param error - The error object to map. Expected to have a 'code' property if from Supabase.
 * @returns A safe, human-readable error string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseSupabaseError = (error: PostgrestError | Error | unknown): string => {
  // Check if it's a Supabase error (has a code)
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as PostgrestError).code;
    if (code && SUPABASE_ERROR_DICTIONARY[code]) {
      return SUPABASE_ERROR_DICTIONARY[code];
    }
  }

  // Handle standard JS Errors
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("network error") || msg.includes("fetch failed")) {
      return "A network error occurred. Please check your connection.";
    }
    // You could return error.message here if you want to expose other generic errors
  }

  return "An unexpected communication error occurred. Please try again.";
};