import { useState, useEffect, createContext } from "react";
import { supabase } from "../supabase";
import { useLocalStorage } from "./use-local-storage";
import { logActivity } from "../activity-logger";

type User = {
  id: string;
  email: string;
  role: "admin" | "manager" | "accountant" | "viewer";
  name: string;
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

// Mock users for localStorage fallback
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123", // In a real app, passwords would be hashed
    role: "admin",
    name: "المدير",
  },
  {
    id: "2",
    email: "manager@example.com",
    password: "password123",
    role: "manager",
    name: "مدير الموارد البشرية",
  },
  {
    id: "3",
    email: "accountant@example.com",
    password: "password123",
    role: "accountant",
    name: "المحاسب",
  },
  {
    id: "4",
    email: "viewer@example.com",
    password: "password123",
    role: "viewer",
    name: "مستخدم عادي",
  },
];

// Permission mapping
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

  // Initialize localStorage with default data if empty and sync with Supabase
  useEffect(() => {
    const syncUsersWithSupabase = async () => {
      if (supabase) {
        try {
          // Get users from Supabase
          const { data, error } = await supabase.from("users").select("*");
          if (error) throw error;

          if (data && data.length > 0) {
            // Update localStorage with Supabase data
            localStorage.setItem("users", JSON.stringify(data));
            console.log("Users synced from Supabase to localStorage");
          } else {
            // If no users in Supabase, push localStorage users to Supabase
            const localUsers = JSON.parse(
              localStorage.getItem("users") || "[]",
            );
            if (localUsers.length > 0) {
              const { error: insertError } = await supabase
                .from("users")
                .insert(localUsers);
              if (insertError)
                console.error("Error pushing users to Supabase:", insertError);
              else console.log("Users pushed from localStorage to Supabase");
            }
          }
        } catch (error) {
          console.error("Error syncing users with Supabase:", error);
        }
      }
    };

    syncUsersWithSupabase();

    // Initialize users
    if (!localStorage.getItem("users")) {
      localStorage.setItem(
        "users",
        JSON.stringify([
          {
            id: "1",
            name: "المدير",
            email: "admin@example.com",
            role: "admin",
            created_at: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "2",
            name: "مدير الموارد البشرية",
            email: "manager@example.com",
            role: "manager",
            created_at: "2024-01-02T00:00:00.000Z",
          },
          {
            id: "3",
            name: "المحاسب",
            email: "accountant@example.com",
            role: "accountant",
            created_at: "2024-01-03T00:00:00.000Z",
          },
          {
            id: "4",
            name: "مستخدم عادي",
            email: "viewer@example.com",
            role: "viewer",
            created_at: "2024-01-04T00:00:00.000Z",
          },
        ]),
      );
    }

    // Initialize mock auth users
    if (!localStorage.getItem("mock_auth_users")) {
      localStorage.setItem(
        "mock_auth_users",
        JSON.stringify([
          {
            id: "1",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
            name: "المدير",
          },
          {
            id: "2",
            email: "manager@example.com",
            password: "password123",
            role: "manager",
            name: "مدير الموارد البشرية",
          },
          {
            id: "3",
            email: "accountant@example.com",
            password: "password123",
            role: "accountant",
            name: "المحاسب",
          },
          {
            id: "4",
            email: "viewer@example.com",
            password: "password123",
            role: "viewer",
            name: "مستخدم عادي",
          },
        ]),
      );
    }
  }, []);

  // Helper function for mock login
  const mockLoginFallback = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    console.log("Using mock login fallback");
    // First check mock users array
    let mockUser = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    // If not found in default mock users, check localStorage for custom added users
    if (!mockUser) {
      const customUsers = JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      );
      mockUser = customUsers.find(
        (u: any) => u.email === email && u.password === password,
      );
    }

    if (mockUser) {
      const { password, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword as User);
      logActivity("auth", "login", "تسجيل دخول", mockUser.id);
      return true;
    }
    return false;
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (data.session) {
            // Get user profile from database
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.session.user.id)
              .single();

            if (userError) throw userError;

            if (userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
              });
            }
          }
        } else {
          // Check localStorage for mock session
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

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Supabase auth error:", error);
            // Fall back to mock login if Supabase auth fails
            return await mockLoginFallback(email, password);
          }

          if (data.user) {
            try {
              // Get user profile from database
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", data.user.id)
                .single();

              if (userError) {
                console.error("User data fetch error:", userError);
                // Fall back to mock login if user data fetch fails
                return await mockLoginFallback(email, password);
              }

              if (userData) {
                const userObj = {
                  id: userData.id,
                  email: userData.email,
                  role: userData.role,
                  name: userData.name,
                };
                setUser(userObj);
                logActivity("auth", "login", "تسجيل دخول", userObj.id);
                return true;
              }
            } catch (userError) {
              console.error("Error fetching user data:", userError);
              // Fall back to mock login if user data fetch fails
              return await mockLoginFallback(email, password);
            }
          }
          return false;
        } catch (authError) {
          console.error("Supabase auth exception:", authError);
          // Fall back to mock login if Supabase auth throws an exception
          return await mockLoginFallback(email, password);
        }
      } else {
        return await mockLoginFallback(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        logActivity("auth", "logout", "تسجيل خروج", user.id);
      }

      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      localStorage.removeItem("auth_user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
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
