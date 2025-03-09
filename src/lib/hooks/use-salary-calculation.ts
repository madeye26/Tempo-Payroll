import { useState } from "react";
import { supabase } from "../supabase";
import { logActivity } from "../activity-logger";

interface MonthlyVariables {
  incentives: string;
  bonuses: string;
  absences: string;
  penalties: string;
  advances: string;
  purchases: string;
}

interface Employee {
  id: string;
  name: string;
  position?: string;
  department?: string;
  base_salary?: number;
  basicSalary?: number; // For compatibility with different naming conventions
}

export function useSalaryCalculation(selectedEmployee?: Employee) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateTotals = (variables: MonthlyVariables) => {
    if (!selectedEmployee)
      return { totalSalary: 0, totalDeductions: 0, netSalary: 0 };

    // Get base salary from either property name
    const baseSalary =
      selectedEmployee.base_salary || selectedEmployee.basicSalary || 0;

    // Parse all values to numbers
    const incentives = parseFloat(variables.incentives) || 0;
    const bonuses = parseFloat(variables.bonuses) || 0;
    const absences = parseFloat(variables.absences) || 0;
    const penalties = parseFloat(variables.penalties) || 0;
    const advances = parseFloat(variables.advances) || 0;
    const purchases = parseFloat(variables.purchases) || 0;

    // Calculate daily rate (assuming 30 days per month)
    const dailyRate = baseSalary / 30;

    // Calculate total salary
    const totalSalary = baseSalary + incentives + bonuses;

    // Calculate total deductions
    const absenceDeductions = absences * dailyRate;
    const totalDeductions =
      absenceDeductions + penalties + advances + purchases;

    // Calculate net salary
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
    if (!selectedEmployee) return;

    setLoading(true);
    try {
      const { totalSalary, totalDeductions, netSalary } =
        calculateTotals(variables);

      // Create a unique ID for this salary record
      const employeeId = selectedEmployee.id;
      const employeeName = selectedEmployee.name;
      const salaryId = `${employeeId}-${month}-${year}`;

      // Get current user from localStorage for activity logging
      const storedUser = localStorage.getItem("auth_user");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      // Prepare salary data
      const salaryData = {
        id: salaryId,
        employeeId: employeeId,
        employeeName: employeeName,
        month,
        year,
        baseSalary:
          selectedEmployee.base_salary || selectedEmployee.basicSalary || 0,
        incentives: parseFloat(variables.incentives) || 0,
        bonuses: parseFloat(variables.bonuses) || 0,
        absences: parseFloat(variables.absences) || 0,
        penalties: parseFloat(variables.penalties) || 0,
        advances: parseFloat(variables.advances) || 0,
        purchases: parseFloat(variables.purchases) || 0,
        totalSalary,
        totalDeductions,
        netSalary,
        date: new Date().toISOString(),
      };

      // Try to save to Supabase first
      let isUpdate = false;
      if (supabase) {
        try {
          // Check if this salary record already exists
          const { data: existingData } = await supabase
            .from("salary_components")
            .select("id")
            .eq("employee_id", employeeId)
            .eq("month", month)
            .eq("year", parseInt(year));

          isUpdate = existingData && existingData.length > 0;

          // Insert or update the salary record
          const { error } = await supabase.from("salary_components").upsert([
            {
              id: salaryId,
              employee_id: employeeId,
              month: month,
              year: parseInt(year),
              bonus: parseFloat(variables.bonuses),
              allowances: parseFloat(variables.incentives),
              deductions:
                parseFloat(variables.penalties) +
                parseFloat(variables.absences),
              purchases: parseFloat(variables.purchases),
              loans: parseFloat(variables.advances),
              net_salary: netSalary,
            },
          ]);

          if (error) throw error;

          // Log activity
          if (currentUser) {
            logActivity(
              "salary",
              isUpdate ? "update" : "create",
              isUpdate
                ? `تم تحديث راتب الموظف ${employeeName} لشهر ${month}/${year}`
                : `تم إضافة راتب جديد للموظف ${employeeName} لشهر ${month}/${year}`,
              currentUser.id,
              { employeeId, salaryId },
            );
          }
        } catch (error) {
          console.error("Error saving to Supabase:", error);
          // Fall back to localStorage
        }
      }

      // Save to localStorage for persistence
      const savedSalaries = JSON.parse(
        localStorage.getItem("salaries") || "[]",
      );
      const existingSalaryIndex = savedSalaries.findIndex(
        (s: any) => s.id === salaryId,
      );

      if (existingSalaryIndex >= 0) {
        // Update existing salary
        savedSalaries[existingSalaryIndex] = salaryData;
        isUpdate = true;
      } else {
        // Add new salary
        savedSalaries.push(salaryData);
        isUpdate = false;
      }

      localStorage.setItem("salaries", JSON.stringify(savedSalaries));

      // Log activity if not already logged with Supabase
      if (!supabase && currentUser) {
        logActivity(
          "salary",
          isUpdate ? "update" : "create",
          isUpdate
            ? `تم تحديث راتب الموظف ${employeeName} لشهر ${month}/${year}`
            : `تم إضافة راتب جديد للموظف ${employeeName} لشهر ${month}/${year}`,
          currentUser.id,
          { employeeId, salaryId },
        );
      }

      // Update advances if needed
      if (parseFloat(variables.advances) > 0) {
        await updateAdvances(
          employeeId,
          parseFloat(variables.advances),
          currentUser,
        );
      }

      return salaryData;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvances = async (
    employeeId: string,
    advanceAmount: number,
    currentUser: any,
  ) => {
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

      // Log advance payment activity
      if (currentUser) {
        logActivity(
          "advance",
          "update",
          `تم سداد سلفة بقيمة ${advanceAmount} للموظف`,
          currentUser.id,
          { employeeId, amount: advanceAmount },
        );
      }
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
