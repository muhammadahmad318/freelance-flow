/**
 * src/components/layout/Header.tsx
 *
 * The global top navigation bar for the dashboard shell.
 * Contains the mobile menu trigger, theme toggle, and user profile utilities.
 */
import React from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  /** Callback triggered when the mobile hamburger menu is clicked */
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, setTheme } = useTheme();

  /**
   * Toggles the global theme between light and dark modes.
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur transition-colors sm:px-6">
      {/* Left Side: Mobile Menu Trigger */}
      <div className="flex items-center">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Right Side: Utilities (Theme & Profile) */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Vertical Divider */}
        <div
          className="h-6 w-px bg-border hidden sm:block"
          aria-hidden="true"
        />

        {/* User Profile Dropdown Trigger */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Open user menu"
        >
          {/* Avatar Fallback Circle */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 transition-colors hover:bg-primary/20">
            {/* Hardcoded initials for now, to be wired to AuthContext later */}
            <span className="text-sm font-semibold tracking-wider">MA</span>
          </div>

          {/* Optional: Show name on larger screens */}
          <span className="hidden text-sm font-medium text-foreground md:block">
            Muhammad
          </span>
        </button>
      </div>
    </header>
  );
};
