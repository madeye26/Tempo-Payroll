import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Use mock data if Supabase is not configured
  console.warn("Supabase credentials not found, using mock data");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Mock data for development
export const mockEmployees = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
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
    email: "fatima@example.com",
    position: "محاسب",
    department: "المالية",
    base_salary: 4500,
    join_date: "2024-01-01",
    status: "active" as const,
    created_at: new Date().toISOString(),
  },
];
