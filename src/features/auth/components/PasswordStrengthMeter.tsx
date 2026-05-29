/**
 * src/features/auth/components/PasswordStrengthMeter.tsx
 *
 * Evaluates a given password string against strict security criteria
 * and visualizes the strength using a progress bar and dynamic checklist.
 */
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({
  password = "",
}: PasswordStrengthMeterProps) {
  // 1. Evaluate Criteria
  // These directly mirror the Regex rules defined in authSchema.ts
  const criteria = [
    { label: "At least 8 characters", isMet: password.length >= 8 },
    { label: "One uppercase letter", isMet: /[A-Z]/.test(password) },
    { label: "One lowercase letter", isMet: /[a-z]/.test(password) },
    { label: "One number", isMet: /[0-9]/.test(password) },
    { label: "One special character", isMet: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.isMet).length;

  // 2. Determine UI State Based on Score
  let strengthLabel = "Weak";
  let barColorClass = "bg-muted"; // Default empty state

  if (password.length > 0) {
    if (metCount <= 2) {
      strengthLabel = "Weak";
      barColorClass = "bg-destructive"; // Maps to our Electric Pulse red
    } else if (metCount === 3 || metCount === 4) {
      strengthLabel = "Moderate";
      barColorClass = "bg-amber-500"; // Standard warning yellow/orange
    } else if (metCount === 5) {
      strengthLabel = "Strong";
      barColorClass = "bg-emerald-500"; // Standard success green
    }
  }

  // Generate an array of 5 segments for the progress bar
  const progressSegments = Array.from({ length: 5 }, (_, i) => i < metCount);

  return (
    <div className="w-full space-y-3 pt-1">
      {/* Visual Progress Bar & Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Password strength
        </span>
        {password.length > 0 && (
          <span
            className={cn(
              "text-xs font-bold transition-colors duration-300",
              metCount <= 2
                ? "text-destructive"
                : metCount === 5
                  ? "text-emerald-500"
                  : "text-amber-500",
            )}
          >
            {strengthLabel}
          </span>
        )}
      </div>

      {/* 5-Segment Indicator */}
      <div className="flex gap-1 h-1.5 w-full">
        {progressSegments.map((isFilled, index) => (
          <div
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-500",
              isFilled ? barColorClass : "bg-muted",
            )}
          />
        ))}
      </div>

      {/* Dynamic Requirements Checklist */}
      <ul className="space-y-1.5 pt-1">
        {criteria.map((criterion, index) => {
          const isMet = criterion.isMet;
          return (
            <li
              key={index}
              className={cn(
                "flex items-center space-x-2 text-xs transition-colors duration-300",
                isMet ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {isMet ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}
              <span>{criterion.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
