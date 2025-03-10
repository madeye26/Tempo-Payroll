import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../supabase";
import { useLocalStorage } from "./use-local-storage";
import { logActivity } from "../activity-logger";
import { supabaseAuth } from "../supabase-auth";

type User = {
  id: string;
  email: string;
  role: "admin" | "manager" | "accountant" | "viewer";
  name: string;
  avatar?: string;
  permissions?: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Default permission mapping by role
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>("auth_user", null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount and listen for auth state changes
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data } = await supabase.auth.getSession();

          if (data.session) {
            // Import auth utils dynamically to avoid circular dependencies
            const { ensureUserInPublicTable } = await import("../auth-utils");

            // Get user profile from database
            const userData = await ensureUserInPublicTable(data.session.user);

            if (userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
                avatar: userData.avatar,
                permissions: userData.permissions,
              });
            }
          }
        } else {
          // Check localStorage for session when Supabase is not available
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Check session immediately
    checkSession();

    // Listen for auth state changes from Supabase
    const handleAuthChange = async (event: CustomEvent) => {
      const { session } = event.detail;

      if (session) {
        // User signed in, update our state
        const { ensureUserInPublicTable } = await import("../auth-utils");
        const userData = await ensureUserInPublicTable(session.user);

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            avatar: userData.avatar,
            permissions: userData.permissions,
          });
        }
      } else {
        // User signed out
        setUser(null);
      }
    };

    window.addEventListener(
      "supabase-auth-state-change",
      handleAuthChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "supabase-auth-state-change",
        handleAuthChange as EventListener,
      );
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login attempt for:", email);
      console.log("Supabase available:", !!supabase);

      if (supabase) {
        console.log("Attempting login with Supabase for:", email);
        console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
        console.log(
          "Supabase Key available:",
          !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        );

        // Try Supabase auth
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Supabase auth error:", error);
            console.log("Falling back to mock login");
            // Fall back to mock login
            return await mockLoginFallback(email, password);
          }

          console.log("Supabase login response:", data);

          if (data.user) {
            console.log("Supabase login successful for user:", data.user.id);

            // Import auth utils dynamically to avoid circular dependencies
            const { ensureUserInPublicTable, updateUserLoginStats } =
              await import("../auth-utils");

            // Ensure user exists in public.users table
            console.log("Ensuring user exists in public.users table");
            const userData = await ensureUserInPublicTable(data.user);

            if (userData) {
              console.log(
                "User found/created in public.users table:",
                userData,
              );

              // Update login stats
              await updateUserLoginStats(userData.id);

              // Set user in state
              setUser({
                id: userData.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
                avatar: userData.avatar,
                permissions: userData.permissions,
              });

              console.log("User state set, login successful");

              // Force a reload of the page to ensure routes recognize the auth state
              setTimeout(() => {
                window.location.href = "/";
              }, 100);

              return true;
            } else {
              console.log(
                "Could not get/create user in public.users table, using minimal user object",
              );
              // If we couldn't get or create user data, create a minimal user object
              setUser({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || email.split("@")[0],
                role: (data.user.user_metadata?.role || "viewer") as any,
              });

              console.log("Minimal user state set, login successful");

              // Force a reload of the page to ensure routes recognize the auth state
              setTimeout(() => {
                window.location.href = "/";
              }, 100);

              return true;
            }
          } else {
            console.log("No user returned from Supabase login");
          }
        } catch (supabaseError) {
          console.error("Exception during Supabase login:", supabaseError);
          console.log("Falling back to mock login after exception");
          return await mockLoginFallback(email, password);
        }

        return false;
      } else {
        console.log("Supabase not available, using mock login");
        // Fallback to mock login when Supabase is not available
        return await mockLoginFallback(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Helper function for mock login
  const mockLoginFallback = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    console.log("Using mock login fallback");
    const mockUsers = JSON.parse(
      localStorage.getItem("mock_auth_users") || "[]",
    );
    const mockUser = mockUsers.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (mockUser) {
      const { password, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword as User);
      logActivity("auth", "login", "تسجيل دخول", mockUser.id);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      if (user) {
        if (supabase) {
          await supabaseAuth.signOut(user.id);
        } else {
          // Fallback when Supabase is not available
          logActivity("auth", "logout", "تسجيل خروج", user.id);
        }
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // First check user-specific permissions if they exist
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    // Fall back to role-based permissions
    return (
      rolePermissions[user.role as keyof typeof rolePermissions]?.includes(
        permission,
      ) || false
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};
