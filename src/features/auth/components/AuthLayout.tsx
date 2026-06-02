/**
 * src/features/auth/components/AuthLayout.tsx
 *
 * Global layout wrapper for authentication pages.
 * Provides consistent branding, typography, and responsive container sizing.
 */
import React from "react";
import { cn } from "@/lib/utils";

/**
 * @property {React.ReactNode} children - Content rendered inside the auth card.
 * @property {string} title - The main heading text.
 * @property {string} subtitle - The secondary descriptive text.
 * @property {string} [className] - Optional custom classes for the root container.
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    /* Main Layout Wrapper */
    <div
      className={cn(
        "min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300",
        className,
      )}
    >
      {/* Branding & Typography */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Animated Logo Placeholder */}
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <div className="h-6 w-6 rounded-full bg-primary animate-pulse-subtle" />
        </div>

        {/* Primary Heading */}
        <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>

        {/* Secondary Subheading */}
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {/* Form Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow-xl shadow-black/5 border border-border sm:rounded-xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
