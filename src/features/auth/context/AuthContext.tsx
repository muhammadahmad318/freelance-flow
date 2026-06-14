/**
 * src/features/auth/context/AuthContext.tsx
 *
 * Context and Provider for global authentication state management.
 * Integrates with Supabase to handle sessions, profile data, and auth events.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { UserProfile, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the application to provide user state and authentication methods.
 * Automatically initializes the session on load and listens for auth state changes.
 *
 * @param props - The component props.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Fetches the extended user profile data from the database.
   * Resolves the loading state upon completion or failure.
   *
   * @param userId - The unique identifier of the authenticated user.
   */
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error(
          "CRITICAL: Failed to fetch user profile from database.",
          error?.message || "No data returned.",
        );
        setUser(null);
        return;
      }

      setUser({
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        onboardingCompleted: data.onboarding_completed,
        themePreference: data.theme_preference || "light",
      });
    } catch (err) {
      console.error("CRITICAL: Native exception during profile fetch.", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Terminates the current user session and clears local auth state.
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the authentication context.
 * Must be used within an AuthProvider component tree.
 *
 * @returns The current user state and auth methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
