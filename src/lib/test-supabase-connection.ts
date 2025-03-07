import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return {
        success: false,
        message:
          "Supabase client is not initialized. Check your environment variables.",
      };
    }

    // Test the connection by making a simple query
    const { data, error } = await supabase
      .from("employees")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error,
      };
    }

    console.log("Supabase connection successful:", data);
    return {
      success: true,
      message: "Connection to Supabase successful",
      data,
    };
  } catch (err) {
    console.error("Unexpected error testing Supabase connection:", err);
    return {
      success: false,
      message: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function testEmployeeInsert() {
  try {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return {
        success: false,
        message:
          "Supabase client is not initialized. Check your environment variables.",
      };
    }

    // Test employee insert with a test record
    const testEmployee = {
      name: "Test Employee",
      monthly_incentives: 100,
      position: "Test Position",
      department: "Test Department",
      base_salary: 1000,
      join_date: new Date().toISOString().split("T")[0],
    };

    const { data, error } = await supabase
      .from("employees")
      .insert([testEmployee])
      .select();

    if (error) {
      console.error("Employee insert test failed:", error);
      return {
        success: false,
        message: `Insert failed: ${error.message}`,
        error,
      };
    }

    console.log("Employee insert successful:", data);
    return {
      success: true,
      message: "Employee insert successful",
      data,
    };
  } catch (err) {
    console.error("Unexpected error testing employee insert:", err);
    return {
      success: false,
      message: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
