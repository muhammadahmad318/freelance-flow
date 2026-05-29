/**
 * @file auth.ts
 * @description Types related to Authentication and User Profiles.
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  themePreference: "light" | "dark";
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export const AUTH_MODULE_LOADED = true;
