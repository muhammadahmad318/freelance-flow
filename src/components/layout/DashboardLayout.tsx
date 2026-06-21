/**
 * src/components/layout/DashboardLayout.tsx
 *
 * Master layout wrapper for authenticated routes.
 * Implements a strict h-screen flex grid to prevent dual-scrolling,
 * and manages the mobile sidebar drawer state.
 */
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  /**
   * Automatically closes the mobile drawer when the user navigates to a new route.
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar 
        Rendered natively in the flex grid, hidden on mobile breakpoints.
      */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar Drawer
       */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm transition-opacity md:hidden ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Drawer Container */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Reusing the exact same Sidebar, overriding the 'hidden' class */}
          <Sidebar className="flex" />
        </div>
      </>

      {/* Main Application Area
        Takes up remaining width (flex-1) and handles its own internal Y-axis scrolling.
      */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* The routed page components (e.g., ClientList) are injected here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
