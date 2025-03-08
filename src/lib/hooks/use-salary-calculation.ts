import { useState } from "react";
import { supabase } from "../supabase";
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

  const saveSalaryCalculation = async (
    variables: MonthlyVariables,
    month: string,
    year: string,
  ) => {
    if (!employee) return;

    setLoading(true);
    try {
      const { totalSalary, totalDeductions, netSalary } =
        calculateTotals(variables);

      const salaryData = {
        id: Date.now().toString(),
        employeeId: employee.id,
        employeeName: employee.name,
        month,
        year,
        baseSalary: employee.base_salary,
        monthlyIncentives: parseFloat(variables.incentives) || 0,
        bonus: parseFloat(variables.bonuses) || 0,
        overtimeHours: 0,
        overtimeValue: 0,
        purchases: parseFloat(variables.purchases) || 0,
        advances: parseFloat(variables.advances) || 0,
        absences: parseFloat(variables.absences) || 0,
        hourlyDeductions: 0,
        penaltyDays: 0,
        penalties: parseFloat(variables.penalties) || 0,
        totalSalary,
        totalDeductions,
        netSalary,
        date: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("salary_components").insert([
          {
            employee_id: employee.id,
            month: month,
            year: parseInt(year),
            bonus: parseFloat(variables.bonuses),
            allowances: parseFloat(variables.incentives),
            deductions:
              parseFloat(variables.penalties) + parseFloat(variables.absences),
            purchases: parseFloat(variables.purchases),
            loans: parseFloat(variables.advances),
            net_salary: netSalary,
          },
        ]);

        if (error) throw error;
      } else {
        // Save to localStorage for persistence
        const savedSalaries = JSON.parse(
          localStorage.getItem("salaries") || "[]",
        );
        savedSalaries.push(salaryData);
        localStorage.setItem("salaries", JSON.stringify(savedSalaries));

        // Update advances if needed
        if (parseFloat(variables.advances) > 0) {
          await updateAdvances(employee.id, parseFloat(variables.advances));
        }
      }

      return salaryData;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvances = async (employeeId: string, advanceAmount: number) => {
    try {
      // Get advances from localStorage
      const savedAdvances = JSON.parse(
        localStorage.getItem("advances") || "[]",
      );
      let remainingAdvanceAmount = advanceAmount;

      // Update each advance until the deducted amount is covered
      const updatedAdvances = savedAdvances.map((advance: any) => {
        if (
          advance.employeeId === employeeId &&
          advance.status === "pending" &&
          remainingAdvanceAmount > 0
        ) {
          const advanceValue = advance.remainingAmount || advance.amount;

          if (remainingAdvanceAmount >= advanceValue) {
            // Fully pay off this advance
            remainingAdvanceAmount -= advanceValue;
            return {
              ...advance,
              status: "paid",
              remainingAmount: 0,
              actualRepaymentDate: new Date().toISOString().split("T")[0],
            };
          } else {
            // Partially pay off this advance
            const newRemainingAmount = advanceValue - remainingAdvanceAmount;
            remainingAdvanceAmount = 0;
            return {
              ...advance,
              remainingAmount: newRemainingAmount,
            };
          }
        }
        return advance;
      });

      // Save updated advances
      localStorage.setItem("advances", JSON.stringify(updatedAdvances));
    } catch (error) {
      console.error("Error updating advances:", error);
    }
  };

  return {
    calculateTotals,
    saveSalaryCalculation,
    loading,
    error,
  };
}
