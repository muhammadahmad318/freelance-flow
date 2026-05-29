import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/context/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
