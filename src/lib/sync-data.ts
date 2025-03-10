import { supabase } from "./supabase";
import {
  syncActivityLogs,
  fetchAndMergeActivityLogs,
} from "./sync-activity-logs";
import { syncSalaryData } from "./sync-salary-data";

/**
 * Synchronizes all data between localStorage and Supabase
 */
export async function syncAllData() {
  if (!supabase) {
    console.log("Supabase not available, skipping data sync");
    return { success: false, message: "Supabase not available" };
  }

  try {
    console.log("Starting full data synchronization...");

    // Sync activity logs
    await syncActivityLogs();
    await fetchAndMergeActivityLogs();

    // Sync salary data
    await syncSalaryData();

    // Sync employees
    await syncEmployees();

    // Sync advances
    await syncAdvances();

    // Sync absences
    await syncAbsences();

    console.log("Data synchronization completed successfully");
    return { success: true, message: "Data synchronized successfully" };
  } catch (error) {
    console.error("Error in syncAllData:", error);
    return {
      success: false,
      message: `Error synchronizing data: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Synchronizes employees between localStorage and Supabase
 */
async function syncEmployees() {
  try {
    // Get employees from localStorage
    const localEmployees = JSON.parse(
      localStorage.getItem("employees") || "[]",
    );
    if (localEmployees.length === 0) {
      console.log("No local employees to sync");
      return;
    }

    // Get employees from Supabase
    const { data: supabaseEmployees, error } = await supabase
      .from("employees")
      .select("*");

    if (error) {
      console.error("Error fetching employees from Supabase:", error);
      return;
    }

    // If no employees in Supabase, push all local employees
    if (!supabaseEmployees || supabaseEmployees.length === 0) {
      console.log("No employees in Supabase, pushing all local employees");
      const { error: insertError } = await supabase
        .from("employees")
        .insert(localEmployees.map(formatEmployeeForSupabase));

      if (insertError) {
        console.error("Error pushing employees to Supabase:", insertError);
      } else {
        console.log(
          `Successfully pushed ${localEmployees.length} employees to Supabase`,
        );
      }
      return;
    }

    // Create maps for quick lookup
    const supabaseEmployeeMap = new Map(
      supabaseEmployees.map((emp) => [emp.id, emp]),
    );
    const localEmployeeMap = new Map(
      localEmployees.map((emp) => [emp.id, emp]),
    );

    // Find employees to insert (in local but not in Supabase)
    const employeesToInsert = localEmployees.filter(
      (emp) => !supabaseEmployeeMap.has(emp.id),
    );

    // Find employees to update (in both local and Supabase)
    const employeesToUpdate = localEmployees.filter((emp) => {
      const supabaseEmp = supabaseEmployeeMap.get(emp.id);
      if (!supabaseEmp) return false;

      // Compare timestamps if available
      const localUpdatedAt = new Date(emp.updated_at || emp.created_at || 0);
      const supabaseUpdatedAt = new Date(
        supabaseEmp.updated_at || supabaseEmp.created_at || 0,
      );

      return localUpdatedAt > supabaseUpdatedAt;
    });

    // Find employees to pull from Supabase (in Supabase but not in local or newer in Supabase)
    const employeesToPull = supabaseEmployees.filter((emp) => {
      const localEmp = localEmployeeMap.get(emp.id);
      if (!localEmp) return true;

      // Compare timestamps if available
      const localUpdatedAt = new Date(
        localEmp.updated_at || localEmp.created_at || 0,
      );
      const supabaseUpdatedAt = new Date(emp.updated_at || emp.created_at || 0);

      return supabaseUpdatedAt > localUpdatedAt;
    });

    // Insert new employees to Supabase
    if (employeesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("employees")
        .insert(employeesToInsert.map(formatEmployeeForSupabase));

      if (insertError) {
        console.error("Error inserting employees to Supabase:", insertError);
      } else {
        console.log(
          `Successfully inserted ${employeesToInsert.length} employees to Supabase`,
        );
      }
    }

    // Update existing employees in Supabase
    for (const emp of employeesToUpdate) {
      const { error: updateError } = await supabase
        .from("employees")
        .update(formatEmployeeForSupabase(emp))
        .eq("id", emp.id);

      if (updateError) {
        console.error(
          `Error updating employee ${emp.id} in Supabase:`,
          updateError,
        );
      }
    }

    if (employeesToUpdate.length > 0) {
      console.log(
        `Successfully updated ${employeesToUpdate.length} employees in Supabase`,
      );
    }

    // Pull new or updated employees from Supabase
    if (employeesToPull.length > 0) {
      const updatedLocalEmployees = [...localEmployees];

      for (const emp of employeesToPull) {
        const localIndex = updatedLocalEmployees.findIndex(
          (e) => e.id === emp.id,
        );
        if (localIndex >= 0) {
          updatedLocalEmployees[localIndex] = formatEmployeeFromSupabase(emp);
        } else {
          updatedLocalEmployees.push(formatEmployeeFromSupabase(emp));
        }
      }

      localStorage.setItem("employees", JSON.stringify(updatedLocalEmployees));
      console.log(
        `Successfully pulled ${employeesToPull.length} employees from Supabase`,
      );
    }
  } catch (error) {
    console.error("Error in syncEmployees:", error);
  }
}

/**
 * Synchronizes advances between localStorage and Supabase
 */
async function syncAdvances() {
  try {
    // Get advances from localStorage
    const localAdvances = JSON.parse(localStorage.getItem("advances") || "[]");
    if (localAdvances.length === 0) {
      console.log("No local advances to sync");
      return;
    }

    // Get advances from Supabase
    const { data: supabaseAdvances, error } = await supabase
      .from("advances")
      .select("*");

    if (error) {
      console.error("Error fetching advances from Supabase:", error);
      return;
    }

    // If no advances in Supabase, push all local advances
    if (!supabaseAdvances || supabaseAdvances.length === 0) {
      console.log("No advances in Supabase, pushing all local advances");
      const { error: insertError } = await supabase
        .from("advances")
        .insert(localAdvances.map(formatAdvanceForSupabase));

      if (insertError) {
        console.error("Error pushing advances to Supabase:", insertError);
      } else {
        console.log(
          `Successfully pushed ${localAdvances.length} advances to Supabase`,
        );
      }
      return;
    }

    // Create maps for quick lookup
    const supabaseAdvanceMap = new Map(
      supabaseAdvances.map((adv) => [adv.id, adv]),
    );
    const localAdvanceMap = new Map(localAdvances.map((adv) => [adv.id, adv]));

    // Find advances to insert (in local but not in Supabase)
    const advancesToInsert = localAdvances.filter(
      (adv) => !supabaseAdvanceMap.has(adv.id),
    );

    // Find advances to update (in both local and Supabase)
    const advancesToUpdate = localAdvances.filter((adv) => {
      const supabaseAdv = supabaseAdvanceMap.get(adv.id);
      if (!supabaseAdv) return false;

      // For advances, we consider status changes as the most important
      return (
        adv.status !== supabaseAdv.status ||
        adv.remainingAmount !== supabaseAdv.remaining_amount
      );
    });

    // Find advances to pull from Supabase (in Supabase but not in local)
    const advancesToPull = supabaseAdvances.filter(
      (adv) => !localAdvanceMap.has(adv.id),
    );

    // Insert new advances to Supabase
    if (advancesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("advances")
        .insert(advancesToInsert.map(formatAdvanceForSupabase));

      if (insertError) {
        console.error("Error inserting advances to Supabase:", insertError);
      } else {
        console.log(
          `Successfully inserted ${advancesToInsert.length} advances to Supabase`,
        );
      }
    }

    // Update existing advances in Supabase
    for (const adv of advancesToUpdate) {
      const { error: updateError } = await supabase
        .from("advances")
        .update(formatAdvanceForSupabase(adv))
        .eq("id", adv.id);

      if (updateError) {
        console.error(
          `Error updating advance ${adv.id} in Supabase:`,
          updateError,
        );
      }
    }

    if (advancesToUpdate.length > 0) {
      console.log(
        `Successfully updated ${advancesToUpdate.length} advances in Supabase`,
      );
    }

    // Pull new advances from Supabase
    if (advancesToPull.length > 0) {
      const updatedLocalAdvances = [...localAdvances];

      for (const adv of advancesToPull) {
        updatedLocalAdvances.push(formatAdvanceFromSupabase(adv));
      }

      localStorage.setItem("advances", JSON.stringify(updatedLocalAdvances));
      console.log(
        `Successfully pulled ${advancesToPull.length} advances from Supabase`,
      );
    }
  } catch (error) {
    console.error("Error in syncAdvances:", error);
  }
}

/**
 * Synchronizes absences between localStorage and Supabase
 */
async function syncAbsences() {
  try {
    // Get absences from localStorage
    const localAbsences = JSON.parse(localStorage.getItem("absences") || "[]");
    if (localAbsences.length === 0) {
      console.log("No local absences to sync");
      return;
    }

    // Get absences from Supabase
    const { data: supabaseAbsences, error } = await supabase
      .from("leaves")
      .select("*");

    if (error) {
      console.error("Error fetching absences from Supabase:", error);
      return;
    }

    // If no absences in Supabase, push all local absences
    if (!supabaseAbsences || supabaseAbsences.length === 0) {
      console.log("No absences in Supabase, pushing all local absences");
      const { error: insertError } = await supabase
        .from("leaves")
        .insert(localAbsences.map(formatAbsenceForSupabase));

      if (insertError) {
        console.error("Error pushing absences to Supabase:", insertError);
      } else {
        console.log(
          `Successfully pushed ${localAbsences.length} absences to Supabase`,
        );
      }
      return;
    }

    // Create maps for quick lookup
    const supabaseAbsenceMap = new Map(
      supabaseAbsences.map((abs) => [abs.id, abs]),
    );
    const localAbsenceMap = new Map(localAbsences.map((abs) => [abs.id, abs]));

    // Find absences to insert (in local but not in Supabase)
    const absencesToInsert = localAbsences.filter(
      (abs) => !supabaseAbsenceMap.has(abs.id),
    );

    // Find absences to update (in both local and Supabase)
    const absencesToUpdate = localAbsences.filter((abs) => {
      const supabaseAbs = supabaseAbsenceMap.get(abs.id);
      if (!supabaseAbs) return false;

      // For absences, we consider status changes as the most important
      return abs.status !== supabaseAbs.status;
    });

    // Find absences to pull from Supabase (in Supabase but not in local)
    const absencesToPull = supabaseAbsences.filter(
      (abs) => !localAbsenceMap.has(abs.id),
    );

    // Insert new absences to Supabase
    if (absencesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("leaves")
        .insert(absencesToInsert.map(formatAbsenceForSupabase));

      if (insertError) {
        console.error("Error inserting absences to Supabase:", insertError);
      } else {
        console.log(
          `Successfully inserted ${absencesToInsert.length} absences to Supabase`,
        );
      }
    }

    // Update existing absences in Supabase
    for (const abs of absencesToUpdate) {
      const { error: updateError } = await supabase
        .from("leaves")
        .update(formatAbsenceForSupabase(abs))
        .eq("id", abs.id);

      if (updateError) {
        console.error(
          `Error updating absence ${abs.id} in Supabase:`,
          updateError,
        );
      }
    }

    if (absencesToUpdate.length > 0) {
      console.log(
        `Successfully updated ${absencesToUpdate.length} absences in Supabase`,
      );
    }

    // Pull new absences from Supabase
    if (absencesToPull.length > 0) {
      const updatedLocalAbsences = [...localAbsences];

      for (const abs of absencesToPull) {
        updatedLocalAbsences.push(formatAbsenceFromSupabase(abs));
      }

      localStorage.setItem("absences", JSON.stringify(updatedLocalAbsences));
      console.log(
        `Successfully pulled ${absencesToPull.length} absences from Supabase`,
      );
    }
  } catch (error) {
    console.error("Error in syncAbsences:", error);
  }
}

// Helper functions to format data for Supabase
function formatEmployeeForSupabase(employee: any) {
  return {
    id: employee.id,
    name: employee.name,
    position: employee.position,
    department: employee.department,
    base_salary: employee.base_salary || employee.basicSalary,
    monthly_incentives:
      employee.monthly_incentives || employee.monthlyIncentives || 0,
    join_date: employee.join_date,
    status: employee.status || "active",
    created_at: employee.created_at || new Date().toISOString(),
    updated_at: employee.updated_at || new Date().toISOString(),
  };
}

function formatEmployeeFromSupabase(employee: any) {
  return {
    id: employee.id,
    name: employee.name,
    position: employee.position,
    department: employee.department,
    base_salary: employee.base_salary,
    monthly_incentives: employee.monthly_incentives || 0,
    join_date: employee.join_date,
    status: employee.status || "active",
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  };
}

function formatAdvanceForSupabase(advance: any) {
  return {
    id: advance.id,
    employee_id: advance.employeeId,
    amount: advance.amount,
    remaining_amount: advance.remainingAmount,
    request_date: advance.requestDate,
    expected_repayment_date: advance.expectedRepaymentDate,
    actual_repayment_date: advance.actualRepaymentDate || null,
    status: advance.status || "pending",
    notes: advance.notes || null,
    created_at: advance.created_at || new Date().toISOString(),
  };
}

function formatAdvanceFromSupabase(advance: any) {
  return {
    id: advance.id,
    employeeId: advance.employee_id,
    employeeName: "Unknown", // This would need to be populated from employees data
    amount: advance.amount,
    remainingAmount: advance.remaining_amount,
    requestDate: advance.request_date,
    expectedRepaymentDate: advance.expected_repayment_date,
    actualRepaymentDate: advance.actual_repayment_date,
    status: advance.status,
    notes: advance.notes,
    created_at: advance.created_at,
  };
}

function formatAbsenceForSupabase(absence: any) {
  return {
    id: absence.id,
    employee_id: absence.employeeId,
    start_date: absence.startDate,
    end_date: absence.endDate,
    reason: absence.reason || null,
    type: absence.type,
    status: absence.status || "pending",
    notes: absence.notes || null,
    created_at: absence.created_at || new Date().toISOString(),
  };
}

function formatAbsenceFromSupabase(absence: any) {
  return {
    id: absence.id,
    employeeId: absence.employee_id,
    employeeName: "Unknown", // This would need to be populated from employees data
    startDate: absence.start_date,
    endDate: absence.end_date,
    reason: absence.reason,
    type: absence.type,
    status: absence.status,
    notes: absence.notes,
    created_at: absence.created_at,
  };
}
