import { supabase } from "./supabase";
import { logActivity } from "./activity-logger";

/**
 * User authentication and management service
 */
export const authService = {
  /**
   * Login a user with email and password
   */
  async login(email: string, password: string) {
    try {
      // First try to use Supabase Auth if available
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!error && data.user) {
            // Get user profile from database
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (!userError && userData) {
              // Update last login time and login count
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
                },
              };
            }
          }
        } catch (supabaseError) {
          console.error("Supabase auth error:", supabaseError);
          // Fall back to mock login if Supabase auth fails
        }
      }

      // Fallback to mock login system
      const mockAuthUsers = JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      );
      const user = mockAuthUsers.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (user) {
        // Update local storage for mock login tracking
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u: any) => u.id === user.id);

        if (userIndex >= 0) {
          users[userIndex].last_login = new Date().toISOString();
          users[userIndex].login_count =
            (users[userIndex].login_count || 0) + 1;
          localStorage.setItem("users", JSON.stringify(users));
        }

        // Log activity
        logActivity("auth", "login", "تسجيل دخول", user.id);

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }

      return {
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء تسجيل الدخول: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Logout the current user
   */
  async logout(userId: string) {
    try {
      // Log activity before logging out
      if (userId) {
        logActivity("auth", "logout", "تسجيل خروج", userId);
      }

      if (supabase) {
        await supabase.auth.signOut();
      }

      // Clear local auth state
      localStorage.removeItem("auth_user");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء تسجيل الخروج: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    is_active?: boolean;
    avatar?: string;
    permissions?: string[];
  }) {
    try {
      const {
        email,
        password,
        name,
        role,
        is_active = true,
        avatar,
        permissions = [],
      } = userData;

      // Always use localStorage for reliability
      const userId = Date.now().toString();
      const newUser = {
        id: userId,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
        is_active,
        login_count: 0,
        avatar,
        permissions,
      };

      // Save to mock auth users
      const mockAuthUsers = JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      );
      mockAuthUsers.push({
        id: userId,
        email,
        password,
        name,
        role,
      });
      localStorage.setItem("mock_auth_users", JSON.stringify(mockAuthUsers));

      // Save to users collection
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      console.log("Created new user:", newUser);
      console.log("Updated users list:", users);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء إنشاء المستخدم: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Update an existing user
   */
  async updateUser(
    userId: string,
    userData: {
      name?: string;
      role?: string;
      password?: string;
      is_active?: boolean;
      avatar?: string;
      permissions?: string[];
    },
  ) {
    try {
      // Always update localStorage for reliability
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === userId);

      if (userIndex >= 0) {
        if (userData.name) users[userIndex].name = userData.name;
        if (userData.role) users[userIndex].role = userData.role;
        if (userData.is_active !== undefined)
          users[userIndex].is_active = userData.is_active;
        if (userData.avatar !== undefined)
          users[userIndex].avatar = userData.avatar;
        if (userData.permissions !== undefined)
          users[userIndex].permissions = userData.permissions;
        users[userIndex].updated_at = new Date().toISOString();

        localStorage.setItem("users", JSON.stringify(users));
        console.log("Updated user:", users[userIndex]);
      } else {
        console.error("User not found for update:", userId);
        return {
          success: false,
          message: "المستخدم غير موجود",
        };
      }

      // Update mock auth users if password changed
      if (userData.password) {
        const mockAuthUsers = JSON.parse(
          localStorage.getItem("mock_auth_users") || "[]",
        );
        const authUserIndex = mockAuthUsers.findIndex(
          (u: any) => u.id === userId,
        );

        if (authUserIndex >= 0) {
          mockAuthUsers[authUserIndex].password = userData.password;
          localStorage.setItem(
            "mock_auth_users",
            JSON.stringify(mockAuthUsers),
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء تحديث المستخدم: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: string) {
    try {
      // Always update localStorage for reliability
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.filter((u: any) => u.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      console.log("Deleted user, remaining users:", updatedUsers);

      // Remove from mock auth users
      const mockAuthUsers = JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      );
      const updatedMockAuthUsers = mockAuthUsers.filter(
        (u: any) => u.id !== userId,
      );
      localStorage.setItem(
        "mock_auth_users",
        JSON.stringify(updatedMockAuthUsers),
      );

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء حذف المستخدم: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Get all users
   */
  async getUsers() {
    try {
      // Always get from localStorage for reliability
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Fetched users from localStorage:", users);
      return { success: true, users };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء جلب المستخدمين: ${error instanceof Error ? error.message : String(error)}`,
        users: [],
      };
    }
  },

  /**
   * Get a user by ID
   */
  async getUserById(userId: string) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        return { success: true, user: data };
      } else {
        // Get from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        return { success: true, user };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        success: false,
        message: `حدث خطأ أثناء جلب المستخدم: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
};
