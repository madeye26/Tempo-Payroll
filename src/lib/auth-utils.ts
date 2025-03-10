import { supabase } from "./supabase";
import { logActivity } from "./activity-logger";

/**
 * Creates a user in the public.users table if they don't already exist
 * This is needed for foreign key relationships
 */
export async function ensureUserInPublicTable(user: any) {
  if (!supabase || !user) return null;

  try {
    // Check if user exists in public.users table
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // Record not found
      // Create user in public.users table
      const { data: userData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split("@")[0],
            role: user.user_metadata?.role || "viewer",
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user in public table:", insertError);
        return null;
      }

      return userData;
    }

    return data;
  } catch (error) {
    console.error("Error in ensureUserInPublicTable:", error);
    return null;
  }
}

/**
 * Updates the user's last login time and login count
 */
export async function updateUserLoginStats(userId: string) {
  if (!supabase || !userId) return;

  try {
    // Get current user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("login_count")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data for login stats:", userError);
      return;
    }

    // Update login stats
    const { error } = await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        login_count: (userData?.login_count || 0) + 1,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user login stats:", error);
    }

    // Log activity
    logActivity("auth", "login", "تسجيل دخول", userId);
  } catch (error) {
    console.error("Error in updateUserLoginStats:", error);
  }
}

/**
 * Gets the user's permissions based on their role
 */
export function getUserPermissions(role: string) {
  const rolePermissions = {
    admin: [
      "view_dashboard",
      "manage_employees",
      "manage_salaries",
      "manage_advances",
      "manage_attendance",
      "view_reports",
      "export_data",
      "manage_settings",
      "manage_users",
    ],
    manager: [
      "view_dashboard",
      "manage_employees",
      "manage_salaries",
      "manage_advances",
      "manage_attendance",
      "view_reports",
      "export_data",
    ],
    accountant: [
      "view_dashboard",
      "manage_salaries",
      "manage_advances",
      "view_reports",
      "export_data",
    ],
    viewer: ["view_dashboard", "view_reports"],
  };

  return rolePermissions[role as keyof typeof rolePermissions] || [];
}
