import { useQueryCache } from "./use-query-cache";
import { supabase, mockEmployees } from "@/lib/supabase";
import { Database } from "@/types/schema";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

export function useEmployeesCached() {
  const fetchEmployees = async (): Promise<Employee[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .order("name");

        if (error) throw error;
        return data || [];
      } else {
        // Use mock data if Supabase is not configured
        const savedEmployees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(mockEmployees),
        );
        return savedEmployees;
      }
    } catch (e) {
      console.error("Error fetching employees:", e);
      // Fallback to mock data on error
      const savedEmployees = JSON.parse(
        localStorage.getItem("employees") || JSON.stringify(mockEmployees),
      );
      return savedEmployees;
    }
  };

  const {
    data: employees = [],
    isLoading: loading,
    error,
    refetch,
    invalidateCache,
  } = useQueryCache<Employee[]>("employees", fetchEmployees, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addEmployee = async (employee: Employee) => {
    const newEmployee = {
      ...employee,
      id: employee.id || Date.now().toString(),
      created_at: new Date().toISOString(),
      status: "active",
    };

    try {
      if (supabase) {
        const { error } = await supabase
          .from("employees")
          .insert([newEmployee]);

        if (error) throw error;
      } else {
        // Update localStorage
        const updatedEmployees = [...employees, newEmployee];
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      }

      // Invalidate cache to force a refresh
      invalidateCache();
      await refetch();
      return newEmployee;
    } catch (e) {
      console.error("Error adding employee:", e);
      throw e;
    }
  };

  const updateEmployee = async (id: string, updatedData: Partial<Employee>) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from("employees")
          .update(updatedData)
          .eq("id", id);

        if (error) throw error;
      } else {
        // Update localStorage
        const updatedEmployees = employees.map((emp) =>
          emp.id === id ? { ...emp, ...updatedData } : emp,
        );
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      }

      // Invalidate cache to force a refresh
      invalidateCache();
      await refetch();
    } catch (e) {
      console.error("Error updating employee:", e);
      throw e;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from("employees")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } else {
        // Update localStorage
        const updatedEmployees = employees.filter((emp) => emp.id !== id);
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      }

      // Invalidate cache to force a refresh
      invalidateCache();
      await refetch();
    } catch (e) {
      console.error("Error deleting employee:", e);
      throw e;
    }
  };

  return {
    employees,
    loading,
    error,
    refetch,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
