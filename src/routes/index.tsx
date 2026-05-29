/**
 * src/routes/index.tsx
 */
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Auth Domain Pages
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";

// Clients Domain Pages
import { ClientsPage } from "@/features/clients/pages/ClientsPage";

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
    // The ProtectedRoute acts as our Layout Guard.
    // Any route placed in these children is automatically secured.
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <div className="p-8">
            <h1>Dashboard (Coming Soon)</h1>
          </div>
        ),
      },
      {
        // New Client Management Route
        path: "/dashboard/clients",
        element: <ClientsPage />,
      },
    ],
  },
]);
