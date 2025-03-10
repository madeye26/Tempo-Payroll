import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/schema";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Use mock data if Supabase is not configured
  console.warn("Supabase credentials not found, using mock data");
}

// Log the environment variables (without exposing the full key)
export const supabaseConfig = {
  url: supabaseUrl || "Not configured",
  hasKey: supabaseAnonKey ? "Yes" : "No",
};

console.log("Supabase configuration:", {
  url: supabaseUrl || "Not configured",
  hasKey: supabaseAnonKey ? "Yes" : "No",
});

// Create Supabase client with error handling
let supabaseClient = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    console.log("Initializing Supabase client with URL:", supabaseUrl);
    console.log("Anon key available:", !!supabaseAnonKey);

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "supabase_auth_token",
        debug: true,
      },
    });
    console.log("Supabase client initialized successfully");

    // Test the connection
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error testing Supabase connection:", error);
      } else {
        console.log(
          "Supabase connection test successful",
          data.session ? "Session exists" : "No session",
        );
      }
    });

    // Log auth state changes for debugging
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(
        "Auth state changed:",
        event,
        session ? "Session exists" : "No session",
      );

      // Dispatch a custom event that our auth provider can listen to
      window.dispatchEvent(
        new CustomEvent("supabase-auth-state-change", {
          detail: { event, session },
        }),
      );
    });
  } else {
    console.warn("Cannot initialize Supabase client - missing URL or key");
    console.log("URL available:", !!supabaseUrl);
    console.log("Key available:", !!supabaseAnonKey);
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}

export const supabase = supabaseClient;

// Mock data for development
export const mockEmployees = [
  {
    id: "1",
    name: "أحمد محمد",
    monthly_incentives: 500,
    position: "مهندس برمجيات",
    department: "تكنولوجيا المعلومات",
    base_salary: 5000,
    join_date: "2024-01-01",
    status: "active" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "فاطمة علي",
    monthly_incentives: 400,
    position: "محاسب",
    department: "المالية",
    base_salary: 4500,
    join_date: "2024-01-01",
    status: "active" as const,
    created_at: new Date().toISOString(),
  },
];
