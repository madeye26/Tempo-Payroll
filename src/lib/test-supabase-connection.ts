import { supabase } from "./supabase";

/**
 * Test the connection to Supabase
 * @returns Object with success status and message
 */
export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return {
        success: false,
        message:
          "Supabase client is not initialized. Check your environment variables.",
      };
    }

    // Test the connection by making a simple query
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      return {
        success: false,
        message: "Failed to connect to Supabase database.",
        error,
      };
    }

    return {
      success: true,
      message: "Successfully connected to Supabase database.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing Supabase connection: ${error instanceof Error ? error.message : String(error)}`,
      error,
    };
  }
}

/**
 * Test inserting an employee into the database
 * @returns Object with success status and message
 */
export async function testEmployeeInsert() {
  try {
    if (!supabase) {
      return {
        success: false,
        message:
          "Supabase client is not initialized. Check your environment variables.",
      };
    }

    // Create a test employee
    const testEmployee = {
      name: "موظف اختبار",
      position: "منصب اختبار",
      department: "قسم اختبار",
      base_salary: 1000,
      monthly_incentives: 100,
      join_date: new Date().toISOString().split("T")[0],
      status: "active",
    };

    // Insert the test employee
    const { data, error } = await supabase
      .from("employees")
      .insert([testEmployee])
      .select();

    if (error) {
      return {
        success: false,
        message: "Failed to insert test employee into database.",
        error,
      };
    }

    // Clean up - delete the test employee
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from("employees")
        .delete()
        .eq("id", data[0].id);

      if (deleteError) {
        console.warn("Failed to delete test employee:", deleteError);
      }
    }

    return {
      success: true,
      message: "Successfully inserted and deleted test employee.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing employee insert: ${error instanceof Error ? error.message : String(error)}`,
      error,
    };
  }
}
