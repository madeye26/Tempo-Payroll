import { supabase } from "./supabase";

/**
 * Synchronizes salary data between localStorage and Supabase
 */
export async function syncSalaryData() {
  if (!supabase) {
    console.log("Supabase not available, skipping salary data sync");
    return;
  }

  try {
    // Get salaries from Supabase
    const { data, error } = await supabase
      .from("salary_components")
      .select(
        `
        id,
        employee_id,
        month,
        year,
        bonus,
        allowances,
        deductions,
        purchases,
        loans,
        absences,
        overtime_hours,
        penalty_days,
        net_salary,
        created_at,
        employees(name)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching salary data from Supabase:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No salary data found in Supabase");
      return;
    }

    console.log(`Fetched ${data.length} salary records from Supabase`);

    // Format data for localStorage
    const formattedSalaries = data.map((salary) => ({
      id: `${salary.employee_id}-${salary.month}-${salary.year}`,
      employeeId: salary.employee_id,
      employeeName: salary.employees?.name || "Unknown",
      month: salary.month,
      year: salary.year.toString(),
      baseSalary: 0, // This would need to be fetched from employee data
      incentives: salary.allowances || 0,
      bonuses: salary.bonus || 0,
      absences: salary.absences || 0,
      penalties: salary.deductions || 0,
      advances: salary.loans || 0,
      purchases: salary.purchases || 0,
      totalSalary: (salary.net_salary || 0) + (salary.deductions || 0),
      totalDeductions: salary.deductions || 0,
      netSalary: salary.net_salary || 0,
      createdAt: salary.created_at || new Date().toISOString(),
    }));

    // Get local salaries
    const localSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");

    // Create a map of existing salary IDs for quick lookup
    const existingSalaryIds = new Set(localSalaries.map((s) => s.id));

    // Add only new salaries from Supabase
    const newSalaries = formattedSalaries.filter(
      (s) => !existingSalaryIds.has(s.id),
    );

    if (newSalaries.length > 0) {
      // Merge and sort salaries by created_at (newest first)
      const mergedSalaries = [...newSalaries, ...localSalaries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Update localStorage
      localStorage.setItem("salaries", JSON.stringify(mergedSalaries));
      console.log(
        `Added ${newSalaries.length} new salary records from Supabase to localStorage`,
      );
    } else {
      console.log("No new salary records to add from Supabase");
    }
  } catch (error) {
    console.error("Error in syncSalaryData:", error);
  }
}

/**
 * Saves a salary record to both localStorage and Supabase
 */
export async function saveSalaryRecord(salaryData) {
  try {
    // Save to localStorage first for reliability
    const savedSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");
    const existingSalaryIndex = savedSalaries.findIndex(
      (s) => s.id === salaryData.id,
    );

    if (existingSalaryIndex >= 0) {
      // Update existing salary
      savedSalaries[existingSalaryIndex] = salaryData;
    } else {
      // Add new salary
      savedSalaries.push(salaryData);
    }

    localStorage.setItem("salaries", JSON.stringify(savedSalaries));

    // Then try to save to Supabase if available
    if (supabase) {
      const { error } = await supabase.from("salary_components").upsert([
        {
          id: salaryData.id,
          employee_id: salaryData.employeeId,
          month: salaryData.month,
          year: parseInt(salaryData.year),
          bonus: salaryData.bonuses,
          allowances: salaryData.incentives,
          deductions: salaryData.penalties,
          purchases: salaryData.purchases,
          loans: salaryData.advances,
          absences: salaryData.absences,
          net_salary: salaryData.netSalary,
          created_at: salaryData.createdAt,
        },
      ]);

      if (error) {
        console.error("Error saving salary to Supabase:", error);
      } else {
        console.log("Successfully saved salary to Supabase");
      }
    }

    return salaryData;
  } catch (error) {
    console.error("Error in saveSalaryRecord:", error);
    throw error;
  }
}
