import React, { useState } from "react";
import { useSalaryCalculation } from "@/lib/hooks/use-salary-calculation";
import EmployeeSection from "./EmployeeSection";
import MonthlyVariablesForm from "./MonthlyVariablesForm";
import SalarySummary from "./SalarySummary";

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
  const { calculateTotals, saveSalaryCalculation, loading } =
    useSalaryCalculation(selectedEmployee);
  const handleSave = async () => {
    try {
      await saveSalaryCalculation(monthlyVariables);
    } catch (error) {
      console.error("Error saving salary calculation:", error);
    }
  };

  const { totalSalary, totalDeductions, netSalary } =
    calculateTotals(monthlyVariables);

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
