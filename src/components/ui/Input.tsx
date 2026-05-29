/**
 * src/components/Input.tsx
 */
import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, placeholder, ...props }, ref) => {
    // 1. Accessibility: Auto-generate an ID if one isn't provided
    const fallbackId = useId();
    const inputId = id || fallbackId;

    // 2. Password Toggle State
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full relative">
        <input
          id={inputId}
          type={currentType}
          ref={ref}
          placeholder={placeholder || " "}
          className={cn(
            "peer flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-transparent",
            error && "border-destructive focus-visible:ring-destructive",
            isPassword && "pr-10",
            className,
          )}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              // Default state: Active/Focused (Floated to the top border)
              "absolute left-2 top-0 -translate-y-1/2 bg-background px-1 text-xs text-muted-foreground transition-all duration-200 pointer-events-none",
              // Inactive state: Input is empty and NOT focused (Acts as placeholder)
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
              // Focus state: Animate to top and change color to Primary
              "peer-focus:top-0 peer-focus:-translate-y-4/6 peer-focus:text-xs peer-focus:text-primary",
              // Error state overrides
              error && "text-destructive peer-focus:text-destructive",
            )}
          >
            {label}
          </label>
        )}

        {/* Password Show/Hide Toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            // Prevent the eye icon from acting as a tab stop, and prevent it from stealing focus from the input
            tabIndex={-1}
            onPointerDown={(e) => e.preventDefault()}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Absolute positioned error text to prevent layout shifts */}
        {error && (
          <span className="absolute -bottom-5 left-0 text-xs text-destructive">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
