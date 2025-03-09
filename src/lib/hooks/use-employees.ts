import { useEffect, useState } from "react";
import { supabase, mockEmployees } from "@/lib/supabase";
import { Database } from "@/types/schema";
import { useQueryCache } from "./use-query-cache";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      if (supabase) {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .order("name");

        if (error) throw error;
        setEmployees(data || []);
      } else {
        // Use mock data if Supabase is not configured
        const savedEmployees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(mockEmployees),
        );
        setEmployees(savedEmployees);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      // Fallback to mock data on error
      const savedEmployees = JSON.parse(
        localStorage.getItem("employees") || JSON.stringify(mockEmployees),
      );
      setEmployees(savedEmployees);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();

    // Set up realtime subscription if supabase is available
    if (supabase) {
      const channel = supabase
        .channel("employees_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "employees" },
          () => fetchEmployees(),
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  const refetch = async () => {
    await fetchEmployees();
  };

  const addEmployee = (employee: Employee) => {
    const newEmployee = {
      ...employee,
      id: employee.id || Date.now().toString(),
      created_at: new Date().toISOString(),
      status: "active",
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    return newEmployee;
  };

  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === id ? { ...emp, ...updatedData } : emp,
    );

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
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
