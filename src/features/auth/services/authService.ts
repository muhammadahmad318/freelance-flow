import { supabase } from "@/lib/supabase";
import type { AuthCredentials } from "@/types/auth";

export const authService = {
  /**
   * Signs up a new user and adds their name to the public.profiles table
   * via the metadata options.
   */
  async signUp({ email, password, name }: AuthCredentials & { name: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Authenticates an existing user.
   */
  async signIn({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sends a password reset email to the user.
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Logs the user out and clears the local session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
