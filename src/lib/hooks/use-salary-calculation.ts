import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/schema";

type SalaryComponent = Database["public"]["Tables"]["salary_components"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];

export interface MonthlyVariables {
  incentives: string;
  bonuses: string;
  absences: string;
  penalties: string;
  advances: string;
  purchases: string;
}

export function useSalaryCalculation(employee?: Employee) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateTotals = (variables: MonthlyVariables) => {
    if (!employee) return { totalSalary: 0, totalDeductions: 0, netSalary: 0 };

    const totalAdditions =
      Number(variables.incentives) + Number(variables.bonuses);
    const totalDeductions =
      Number(variables.absences) +
      Number(variables.penalties) +
      Number(variables.advances) +
      Number(variables.purchases);
    const totalSalary = employee.base_salary + totalAdditions;
    const netSalary = totalSalary - totalDeductions;

    return {
      totalSalary,
      totalDeductions,
      netSalary,
    };
  };

  const saveSalaryCalculation = async (variables: MonthlyVariables) => {
    if (!employee) return;

    const { totalSalary, totalDeductions, netSalary } =
      calculateTotals(variables);
    const date = new Date();

    try {
      setLoading(true);
      if (supabase) {
        const { error } = await supabase.from("salary_components").insert([
          {
            employee_id: employee.id,
            month: date.toLocaleString("default", { month: "long" }),
            year: date.getFullYear(),
            bonus: Number(variables.bonuses),
            allowances: Number(variables.incentives),
            deductions:
              Number(variables.penalties) + Number(variables.absences),
            purchases: Number(variables.purchases),
            loans: Number(variables.advances),
            net_salary: netSalary,
          },
        ]);

        if (error) throw error;
      } else {
        console.log("Mock save salary calculation:", {
          employee_id: employee.id,
          variables,
          totals: { totalSalary, totalDeductions, netSalary },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateTotals,
    saveSalaryCalculation,
    loading,
    error,
  };
}
