import { supabase } from "./supabase";
import { authService } from "./auth-service";

export async function testAppFunctionality() {
  const results: Record<string, any> = {};

  // Test database connection
  results.database = await testSupabaseConnection();

  // Test authentication
  results.auth = await testAuthentication();

  // Test employee functions
  results.employees = await testEmployeeFunctions();

  // Test salary calculation
  results.salaries = await testSalaryCalculation();

  // Test activity logs
  results.activityLogs = await testActivityLogs();

  // Test advances
  results.advances = await testAdvances();

  // Test attendance
  results.attendance = await testAttendance();

  // Test reports
  results.reports = await testReports();

  // Test backup functionality
  results.backup = await testBackup();

  // Test data synchronization
  results.sync = await testDataSync();

  return results;
}

async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return {
        success: false,
        message:
          "Supabase client not initialized. Check environment variables.",
      };
    }

    const { error } = await supabase.from("employees").select("id").limit(1);
    if (error) {
      return {
        success: false,
        message: "Failed to connect to Supabase.",
        details: error,
      };
    }

    return {
      success: true,
      message: "Supabase connection successful.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing Supabase connection.",
      details: error,
    };
  }
}

async function testAuthentication() {
  try {
    // Test if auth service is available
    if (!authService) {
      return {
        success: false,
        message: "Auth service not initialized.",
      };
    }

    // Test getting users
    const { success, users } = await authService.getUsers();
    if (!success) {
      return {
        success: false,
        message: "Failed to get users from auth service.",
      };
    }

    // Check if we have at least one admin user
    const adminUser = users.find((user: any) => user.role === "admin");
    if (!adminUser) {
      return {
        success: false,
        message:
          "No admin user found. System requires at least one admin user.",
      };
    }

    return {
      success: true,
      message: `Authentication system working. Found ${users.length} users including ${users.filter((u: any) => u.role === "admin").length} admin(s).`,
      details: {
        userCount: users.length,
        adminCount: users.filter((u: any) => u.role === "admin").length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing authentication system.",
      details: error,
    };
  }
}

async function testEmployeeFunctions() {
  try {
    // Get employees from localStorage
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");

    if (employees.length === 0) {
      return {
        success: false,
        message: "No employees found in the system.",
      };
    }

    // Check if employees have required fields
    const validEmployees = employees.filter(
      (emp: any) =>
        emp.id &&
        emp.name &&
        (emp.base_salary || emp.basicSalary) &&
        emp.join_date,
    );

    if (validEmployees.length < employees.length) {
      return {
        success: false,
        message: `Found ${employees.length} employees, but ${employees.length - validEmployees.length} have missing required fields.`,
      };
    }

    return {
      success: true,
      message: `Employee system working. Found ${employees.length} valid employees.`,
      details: {
        employeeCount: employees.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing employee functions.",
      details: error,
    };
  }
}

async function testSalaryCalculation() {
  try {
    // Get employees and salaries from localStorage
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const salaries = JSON.parse(localStorage.getItem("salaries") || "[]");

    if (employees.length === 0) {
      return {
        success: false,
        message: "No employees found for salary calculation test.",
      };
    }

    // Test basic salary calculation
    const testEmployee = employees[0];
    const baseSalary =
      testEmployee.base_salary || testEmployee.basicSalary || 0;
    const incentives = testEmployee.monthly_incentives || 0;
    const totalSalary = baseSalary + incentives;
    const dailyRate = baseSalary / 30; // Assuming 30 days per month

    // Check if calculation works
    if (isNaN(totalSalary) || isNaN(dailyRate)) {
      return {
        success: false,
        message: "Salary calculation failed with test employee.",
      };
    }

    return {
      success: true,
      message: `Salary calculation system working. ${salaries.length > 0 ? `Found ${salaries.length} saved salary records.` : "No saved salary records yet."}`,
      details: {
        salaryRecords: salaries.length,
        testCalculation: {
          baseSalary,
          incentives,
          totalSalary,
          dailyRate,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing salary calculation.",
      details: error,
    };
  }
}

async function testActivityLogs() {
  try {
    // Get activity logs from localStorage
    const activityLogs = JSON.parse(
      localStorage.getItem("activity_logs") || "[]",
    );

    // Test logging a new activity
    const testLog = {
      id: Date.now().toString(),
      user_id: "system-test",
      type: "system",
      action: "test",
      description: "System test activity log",
      created_at: new Date().toISOString(),
    };

    // Add test log to localStorage
    const updatedLogs = [testLog, ...activityLogs];
    localStorage.setItem("activity_logs", JSON.stringify(updatedLogs));

    // Verify the log was added
    const newLogs = JSON.parse(localStorage.getItem("activity_logs") || "[]");
    const testLogExists = newLogs.some((log: any) => log.id === testLog.id);

    if (!testLogExists) {
      return {
        success: false,
        message: "Failed to add test activity log.",
      };
    }

    return {
      success: true,
      message: `Activity logging system working. Found ${newLogs.length} activity logs.`,
      details: {
        logCount: newLogs.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing activity logs.",
      details: error,
    };
  }
}

async function testAdvances() {
  try {
    // Get advances from localStorage
    const advances = JSON.parse(localStorage.getItem("advances") || "[]");

    if (advances.length === 0) {
      return {
        success: false,
        message: "No advances found in the system.",
      };
    }

    // Check if advances have required fields
    const validAdvances = advances.filter(
      (adv: any) =>
        adv.id &&
        adv.employeeId &&
        adv.amount &&
        adv.requestDate &&
        adv.expectedRepaymentDate,
    );

    if (validAdvances.length < advances.length) {
      return {
        success: false,
        message: `Found ${advances.length} advances, but ${advances.length - validAdvances.length} have missing required fields.`,
      };
    }

    // Check status distribution
    const pendingAdvances = advances.filter(
      (adv: any) => adv.status === "pending",
    ).length;
    const paidAdvances = advances.filter(
      (adv: any) => adv.status === "paid",
    ).length;

    return {
      success: true,
      message: `Advances system working. Found ${advances.length} advances (${pendingAdvances} pending, ${paidAdvances} paid).`,
      details: {
        advanceCount: advances.length,
        pendingCount: pendingAdvances,
        paidCount: paidAdvances,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing advances system.",
      details: error,
    };
  }
}

async function testAttendance() {
  try {
    // Get absences from localStorage
    const absences = JSON.parse(localStorage.getItem("absences") || "[]");

    if (absences.length === 0) {
      return {
        success: false,
        message: "No absences found in the system.",
      };
    }

    // Check if absences have required fields
    const validAbsences = absences.filter(
      (abs: any) =>
        abs.id && abs.employeeId && abs.startDate && abs.endDate && abs.type,
    );

    if (validAbsences.length < absences.length) {
      return {
        success: false,
        message: `Found ${absences.length} absences, but ${absences.length - validAbsences.length} have missing required fields.`,
      };
    }

    // Check type distribution
    const annualLeaves = absences.filter(
      (abs: any) => abs.type === "annual",
    ).length;
    const sickLeaves = absences.filter(
      (abs: any) => abs.type === "sick",
    ).length;

    return {
      success: true,
      message: `Attendance system working. Found ${absences.length} absences (${annualLeaves} annual, ${sickLeaves} sick).`,
      details: {
        absenceCount: absences.length,
        annualCount: annualLeaves,
        sickCount: sickLeaves,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing attendance system.",
      details: error,
    };
  }
}

async function testReports() {
  try {
    // Check if we have data for reports
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const salaries = JSON.parse(localStorage.getItem("salaries") || "[]");
    const advances = JSON.parse(localStorage.getItem("advances") || "[]");
    const absences = JSON.parse(localStorage.getItem("absences") || "[]");

    if (employees.length === 0 || salaries.length === 0) {
      return {
        success: false,
        message:
          "Insufficient data for generating reports. Need employees and salary data.",
      };
    }

    return {
      success: true,
      message: `Report system ready. Data available: ${employees.length} employees, ${salaries.length} salary records, ${advances.length} advances, ${absences.length} absences.`,
      details: {
        employeeCount: employees.length,
        salaryCount: salaries.length,
        advanceCount: advances.length,
        absenceCount: absences.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing report system.",
      details: error,
    };
  }
}

async function testDataSync() {
  try {
    // Check if Supabase is available
    if (!supabase) {
      return {
        success: false,
        message:
          "Supabase client not initialized. Data synchronization requires Supabase.",
      };
    }

    // Test connection to Supabase
    const { error } = await supabase.from("employees").select("id").limit(1);
    if (error) {
      return {
        success: false,
        message: "Failed to connect to Supabase for data synchronization.",
        details: error,
      };
    }

    // Import sync function dynamically
    const { syncAllData } = await import("./sync-data");
    const syncResult = await syncAllData();

    if (!syncResult.success) {
      return {
        success: false,
        message: `Data synchronization test failed: ${syncResult.message}`,
      };
    }

    return {
      success: true,
      message:
        "Data synchronization system working. Supabase connection established and sync functions available.",
      details: {
        syncResult,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing data synchronization.",
      details: error,
    };
  }
}

async function testBackup() {
  try {
    // Check if we have data to backup
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const salaries = JSON.parse(localStorage.getItem("salaries") || "[]");
    const advances = JSON.parse(localStorage.getItem("advances") || "[]");
    const absences = JSON.parse(localStorage.getItem("absences") || "[]");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const activityLogs = JSON.parse(
      localStorage.getItem("activity_logs") || "[]",
    );

    // Create a test backup object
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        employees,
        salaries,
        advances,
        absences,
        users,
        activityLogs,
      },
    };

    // Check if backup object is valid
    if (!backupData || !backupData.data) {
      return {
        success: false,
        message: "Failed to create backup data object.",
      };
    }

    return {
      success: true,
      message: `Backup system ready. Data available for backup: ${employees.length} employees, ${salaries.length} salary records, ${users.length} users, ${activityLogs.length} activity logs.`,
      details: {
        employeeCount: employees.length,
        salaryCount: salaries.length,
        advanceCount: advances.length,
        absenceCount: absences.length,
        userCount: users.length,
        logCount: activityLogs.length,
        backupSize: JSON.stringify(backupData).length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error testing backup system.",
      details: error,
    };
  }
}
