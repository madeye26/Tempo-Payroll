import { useEffect, useState } from "react";
import { supabase, mockEmployees } from "@/lib/supabase";
import { Database } from "@/types/schema";

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
        setEmployees(mockEmployees);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      // Fallback to mock data on error
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();

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
  }, []);

  return { employees, loading, error, refetch: fetchEmployees };
}
