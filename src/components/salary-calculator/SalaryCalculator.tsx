import React, { useState, useEffect } from "react";
import { useSalaryCalculation } from "@/lib/hooks/use-salary-calculation";
import EmployeeSection from "./EmployeeSection";
import MonthlyVariablesForm from "./MonthlyVariablesForm";
import SalarySummary from "./SalarySummary";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { logActivity } from "@/lib/activity-logger";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  basicSalary: number;
}

interface MonthlyVariables {
  incentives: string;
  bonuses: string;
  absences: string;
  penalties: string;
  advances: string;
  purchases: string;
}

interface SalaryCalculatorProps {
  employees?: Employee[];
  selectedEmployee?: Employee;
  monthlyVariables?: MonthlyVariables;
  onEmployeeSelect?: (employeeId: string) => void;
  onAddNewEmployee?: () => void;
  onMonthlyVariablesSubmit?: (values: MonthlyVariables) => void;
  onSaveSalary?: () => void;
  onEditSalary?: () => void;
}

const defaultEmployees = [
  {
    id: "1",
    name: "أحمد محمد",
    position: "مهندس برمجيات",
    department: "تكنولوجيا المعلومات",
    basicSalary: 5000,
  },
  {
    id: "2",
    name: "فاطمة علي",
    position: "محاسب",
    department: "المالية",
    basicSalary: 4500,
  },
];

const defaultMonthlyVariables = {
  incentives: "0",
  bonuses: "0",
  absences: "0",
  penalties: "0",
  advances: "0",
  purchases: "0",
};

const SalaryCalculator = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(defaultEmployees[0]);
  const [monthlyVariables, setMonthlyVariables] = useState<MonthlyVariables>(
    defaultMonthlyVariables,
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "MMMM", { locale: ar }),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Load saved employees from localStorage
  const [savedEmployees, setSavedEmployees] = useLocalStorage(
    "employees",
    defaultEmployees,
  );

  useEffect(() => {
    // If we have saved employees, use the first one as default
    if (savedEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(savedEmployees[0]);
    }
  }, [savedEmployees]);

  // Calculate totals based on monthly variables
  const calculateTotals = () => {
    if (!selectedEmployee) {
      return {
        totalSalary: 0,
        totalDeductions: 0,
        netSalary: 0,
      };
    }

    // Parse all values to numbers
    const baseSalary = selectedEmployee.basicSalary || 0;
    const incentives = parseFloat(monthlyVariables.incentives) || 0;
    const bonuses = parseFloat(monthlyVariables.bonuses) || 0;
    const absences = parseFloat(monthlyVariables.absences) || 0;
    const penalties = parseFloat(monthlyVariables.penalties) || 0;
    const advances = parseFloat(monthlyVariables.advances) || 0;
    const purchases = parseFloat(monthlyVariables.purchases) || 0;

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

  const { totalSalary, totalDeductions, netSalary } = calculateTotals();

  const handleSave = async () => {
    if (!selectedEmployee) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار موظف أولاً",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const employeeId = selectedEmployee.id;
      const employeeName = selectedEmployee.name;
      const salaryId = `${employeeId}-${selectedMonth}-${selectedYear}`;

      // Prepare salary data
      const salaryData = {
        id: salaryId,
        employeeId,
        employeeName,
        baseSalary: selectedEmployee.basicSalary || 0,
        incentives: parseFloat(monthlyVariables.incentives) || 0,
        bonuses: parseFloat(monthlyVariables.bonuses) || 0,
        absences: parseFloat(monthlyVariables.absences) || 0,
        penalties: parseFloat(monthlyVariables.penalties) || 0,
        advances: parseFloat(monthlyVariables.advances) || 0,
        purchases: parseFloat(monthlyVariables.purchases) || 0,
        totalSalary,
        totalDeductions,
        netSalary,
        month: selectedMonth,
        year: selectedYear,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const savedSalaries = JSON.parse(
        localStorage.getItem("salaries") || "[]",
      );
      const existingSalaryIndex = savedSalaries.findIndex(
        (s: any) => s.id === salaryId,
      );

      // Get current user from localStorage for activity logging
      const currentUser = JSON.parse(
        localStorage.getItem("auth_user") || "null",
      );

      if (existingSalaryIndex >= 0) {
        // Update existing salary
        savedSalaries[existingSalaryIndex] = salaryData;

        // Log activity for salary update
        if (currentUser) {
          logActivity(
            "salary",
            "update",
            `تم تحديث راتب الموظف ${employeeName} لشهر ${selectedMonth}/${selectedYear}`,
            currentUser.id,
            { employeeId, salaryId },
          );
        }
      } else {
        // Add new salary
        savedSalaries.push(salaryData);

        // Log activity for new salary
        if (currentUser) {
          logActivity(
            "salary",
            "create",
            `تم إضافة راتب جديد للموظف ${employeeName} لشهر ${selectedMonth}/${selectedYear}`,
            currentUser.id,
            { employeeId, salaryId },
          );
        }
      }

      localStorage.setItem("salaries", JSON.stringify(savedSalaries));

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات الراتب بنجاح",
      });
    } catch (error) {
      console.error("Error saving salary calculation:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حفظ الراتب: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 p-6 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold text-right bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        حاسبة الرواتب
      </h1>

      <EmployeeSection
        selectedEmployee={selectedEmployee}
        onEmployeeSelect={(id) => {
          const employee = defaultEmployees.find((e) => e.id === id);
          setSelectedEmployee(employee);
        }}
      />

      <MonthlyVariablesForm
        initialValues={monthlyVariables}
        onSubmit={setMonthlyVariables}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <SalarySummary
        totalSalary={totalSalary}
        totalDeductions={totalDeductions}
        netSalary={netSalary}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};

export default SalaryCalculator;
