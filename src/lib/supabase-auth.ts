import { supabase } from "./supabase";
import { logActivity } from "./activity-logger";

/**
 * Authentication service using Supabase Auth
 */
export const supabaseAuth = {
  /**
   * Sign up a new user
   */
  async signUp(email, password, userData) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "viewer",
            avatar: userData.avatar,
          },
        },
      });

      if (error) throw error;

      // Also create user in public.users table for foreign key relationships
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: email,
            name: userData.name,
            role: userData.role || "viewer",
            is_active: userData.is_active !== false,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        message: `Error creating user: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login time and login count
      if (data.user) {
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!userError && userData) {
          // Update login stats
          await supabase
            .from("users")
            .update({
              last_login: new Date().toISOString(),
              login_count: (userData.login_count || 0) + 1,
            })
            .eq("id", userData.id);

          // Log activity
          logActivity("auth", "login", "تسجيل دخول", userData.id);

          return {
            success: true,
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              avatar: userData.avatar,
              permissions: userData.permissions,
            },
          };
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message: `Error signing in: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(userId) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // Log activity before signing out
      if (userId) {
        logActivity("auth", "logout", "تسجيل خروج", userId);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        message: `Error signing out: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      return { success: true, session: data.session };
    } catch (error) {
      console.error("Get session error:", error);
      return { success: false, session: null };
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return { success: true, user: data };
    } catch (error) {
      console.error("Get user error:", error);
      return { success: false, user: null };
    }
  },

  /**
   * Update user profile
   */
  async updateUser(userId, userData) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // Update user metadata in Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar,
        },
      });

      if (authError) throw authError;

      // Update user in users table
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          role: userData.role,
          is_active: userData.is_active,
          avatar: userData.avatar,
          permissions: userData.permissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        message: `Error updating user: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(userId) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      // In a real app, you would use the Supabase Admin API to delete the user from Auth
      // For now, we'll just delete from the users table
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Delete user error:", error);
      return {
        success: false,
        message: `Error deleting user: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Get all users
   */
  async getUsers() {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;

      return { success: true, users: data };
    } catch (error) {
      console.error("Get users error:", error);
      return { success: false, users: [] };
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: `Error resetting password: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Update password
   */
  async updatePassword(password) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        message: `Error updating password: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
};
