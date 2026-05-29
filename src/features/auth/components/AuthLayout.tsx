/**
 * src/features/auth/components/AuthLayout.tsx
 */
import React from "react";
import { cn } from "@/lib/utils";
// import { Zap } from "lucide-react"; // Optional: Use a brand icon here later

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
    // bg-muted/30 gives a subtle contrast against the form card in both light and dark modes
    <div
      className={cn(
        "min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300",
        className,
      )}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Placeholder Logo utilizing the Primary Brand Tokens */}
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <div className="h-6 w-6 rounded-full bg-primary animate-pulse-subtle" />
          {/* <Zap className="h-6 w-6 text-primary" /> */}
        </div>

        <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* bg-background and border-border ensure the card adapts to Dark Mode natively */}
        <div className="bg-background py-8 px-4 shadow-xl shadow-black/5 border border-border sm:rounded-xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
