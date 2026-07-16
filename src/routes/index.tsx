/**
 * src/routes/index.tsx
 *
 * Application router configuration.
 * Integrates Auth guards and the global Dashboard layout.
 */
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth Domain Pages
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";

// Clients Domain Pages
import { ClientsPage } from "@/features/clients/pages/ClientsPage";

// Projects Domain Pages
import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    // 1. The Security Guard: Validates the Supabase session first
    element: <ProtectedRoute />,
    children: [
      {
        // 2. The Master Layout: Wraps all authenticated pages with the Sidebar & Header
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Dashboard
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Welcome to Electric Pulse. Metrics and AI insights coming
                  soon.
                </p>
              </div>
            ),
          },
          {
            // 3. The Feature Page: Injected into the DashboardLayout's <Outlet />
            path: "/dashboard/clients",
            element: <ClientsPage />,
          },
          {
            path: "/dashboard/projects",
            element: <ProjectsPage />,
          },
        ],
      },
    ],
  },
]);
