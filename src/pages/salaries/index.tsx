import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployees } from "@/lib/hooks/use-employees";
import { supabase } from "@/lib/supabase";
import { useSalaryCalculation } from "@/lib/hooks/use-salary-calculation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Calculator, Printer, Calendar, FileText } from "lucide-react";
import { PrintPayslip } from "@/components/salary-calculator/print-payslip";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function SalariesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're editing an existing salary
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get("edit");
    if (editId) {
      setEditingSalaryId(editId);
    }
  }, [location]);
  const { employees } = useEmployees();

  // Get advances data
  const [advances, setAdvances] = useState<any[]>([]);

  // Fetch advances from database or initialize with employee data
  useEffect(() => {
    const fetchAdvances = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from("advances")
            .select(
              `
              id,
              employee_id,
              amount,
              remaining_amount,
              request_date,
              expected_repayment_date,
              actual_repayment_date,
              status,
              employees(name)
            `,
            )
            .eq("status", "pending");

          if (error) {
            console.error("Error fetching advances:", error);
            return;
          }

          if (data && data.length > 0) {
            const formattedAdvances = data.map((advance) => ({
              id: advance.id,
              employeeId: advance.employee_id,
              employeeName: advance.employees?.name || "Unknown",
              amount: advance.amount,
              requestDate: advance.request_date,
              expectedRepaymentDate: advance.expected_repayment_date,
              actualRepaymentDate: advance.actual_repayment_date,
              status: advance.status,
              remainingAmount: advance.remaining_amount,
            }));
            setAdvances(formattedAdvances);
          } else if (employees.length > 0) {
            // If no advances in database but we have employees, create sample data
            const initialAdvances = [];
            if (employees[0]) {
              initialAdvances.push({
                id: "1",
                employeeId: employees[0].id,
                employeeName: employees[0].name,
                amount: 1000,
                requestDate: "2024-05-01",
                expectedRepaymentDate: "2024-06-01",
                status: "pending",
                remainingAmount: 1000,
              });

              initialAdvances.push({
                id: "3",
                employeeId: employees[0].id,
                employeeName: employees[0].name,
                amount: 800,
                requestDate: "2024-05-10",
                expectedRepaymentDate: "2024-06-10",
                status: "pending",
                remainingAmount: 800,
              });
            }
            setAdvances(initialAdvances);
          }
        } else if (employees.length > 0) {
          // Fallback for when supabase is not available
          const initialAdvances = [];
          if (employees[0]) {
            initialAdvances.push({
              id: "1",
              employeeId: employees[0].id,
              employeeName: employees[0].name,
              amount: 1000,
              requestDate: "2024-05-01",
              expectedRepaymentDate: "2024-06-01",
              status: "pending",
              remainingAmount: 1000,
            });

            initialAdvances.push({
              id: "3",
              employeeId: employees[0].id,
              employeeName: employees[0].name,
              amount: 800,
              requestDate: "2024-05-10",
              expectedRepaymentDate: "2024-06-10",
              status: "pending",
              remainingAmount: 800,
            });
          }
          setAdvances(initialAdvances);
        }
      } catch (error) {
        console.error("Error in fetchAdvances:", error);
      }
    };

    fetchAdvances();
  }, [employees, supabase]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [editingSalaryId, setEditingSalaryId] = useState<string | null>(null);
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  // Load saved salaries for editing
  useEffect(() => {
    if (editingSalaryId) {
      const savedSalaries = JSON.parse(
        localStorage.getItem("salaries") || "[]",
      );
      const salaryToEdit = savedSalaries.find(
        (s: any) =>
          s.date && new Date(s.date).getTime().toString() === editingSalaryId,
      );

      if (salaryToEdit) {
        setSelectedEmployeeId(salaryToEdit.employeeId);
        setSelectedMonth(salaryToEdit.month);
        setSelectedYear(salaryToEdit.year.toString());

        // Set form data from saved salary
        setFormData({
          baseSalary: salaryToEdit.baseSalary.toString(),
          monthlyIncentives: salaryToEdit.monthlyIncentives.toString(),
          bonus: salaryToEdit.bonus.toString(),
          overtimeHours: salaryToEdit.overtimeHours.toString(),
          overtimeValue: salaryToEdit.overtimeValue.toString(),
          totalSalaryWithIncentives: (
            salaryToEdit.baseSalary + salaryToEdit.monthlyIncentives
          ).toString(),
          totalSalary: (
            salaryToEdit.baseSalary +
            salaryToEdit.bonus +
            salaryToEdit.overtimeValue
          ).toString(),
          purchases: salaryToEdit.purchases.toString(),
          advances: salaryToEdit.advances.toString(),
          absences: salaryToEdit.absences.toString(),
          hourlyDeductions: salaryToEdit.hourlyDeductions.toString(),
          penaltyDays: salaryToEdit.penaltyDays.toString(),
          penalties: salaryToEdit.penalties.toString(),
          netSalary: salaryToEdit.netSalary.toString(),
          dailyRate: "",
          dailyRateWithIncentives: "",
        });
      }
    }
  }, [editingSalaryId]);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM", { locale: ar }),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    dailyRate: "",
    dailyRateWithIncentives: "",
    overtimeRate: "",
    overtimeHours: "",
    baseSalary: "",
    monthlyIncentives: "",
    totalSalaryWithIncentives: "",
    bonus: "",
    overtimeValue: "",
    totalSalary: "",
    purchases: "",
    advances: "",
    absences: "",
    hourlyDeductions: "",
    penaltyDays: "",
    penalties: "",
    netSalary: "",
  });

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      // Get days in the selected month
      const year = parseInt(selectedYear);
      const month = months.findIndex((m) => m.value === selectedMonth) + 1;
      const daysInMonth = new Date(year, month, 0).getDate();

      // Get employee's pending advances
      const pendingAdvances = advances.filter(
        (adv) => adv.employeeId === employeeId && adv.status === "pending",
      );
      const totalPendingAdvances = pendingAdvances.reduce(
        (sum, adv) => sum + (adv.remainingAmount || adv.amount),
        0,
      );

      setFormData({
        ...formData,
        baseSalary: employee.base_salary.toString(),
        dailyRate: (employee.base_salary / daysInMonth).toFixed(2),
        dailyRateWithIncentives: (
          (employee.base_salary + (employee.monthly_incentives || 0)) /
          daysInMonth
        ).toFixed(2),
        overtimeRate: (employee.base_salary / daysInMonth / 8).toFixed(2),
        monthlyIncentives: employee.monthly_incentives?.toString() || "0",
        totalSalaryWithIncentives: (
          employee.base_salary + (employee.monthly_incentives || 0)
        ).toString(),
        advances: totalPendingAdvances.toString(),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    calculateSalary({ ...formData, [name]: value });
  };

  // Update calculations when month changes
  useEffect(() => {
    if (selectedEmployeeId) {
      handleEmployeeSelect(selectedEmployeeId);
    }
  }, [selectedMonth, selectedYear]);

  const calculateSalary = (data: typeof formData) => {
    const baseSalary = parseFloat(data.baseSalary) || 0;
    const monthlyIncentives = parseFloat(data.monthlyIncentives) || 0;
    const bonus = parseFloat(data.bonus) || 0;
    const overtimeHours = parseFloat(data.overtimeHours) || 0;
    const overtimeRate = parseFloat(data.overtimeRate) || 0;
    const purchases = parseFloat(data.purchases) || 0;
    const advances = parseFloat(data.advances) || 0;
    const absences = parseFloat(data.absences) || 0;
    const hourlyDeductions = parseFloat(data.hourlyDeductions) || 0;
    const penaltyDays = parseFloat(data.penaltyDays) || 0;
    const dailyRate = parseFloat(data.dailyRate) || 0;
    const dailyRateWithIncentives =
      parseFloat(data.dailyRateWithIncentives) || 0;

    const overtimeValue = overtimeHours * overtimeRate;
    const totalSalaryWithIncentives = baseSalary + monthlyIncentives;

    // Calculate absence deductions based on whether employee has incentives
    const absenceDeduction =
      monthlyIncentives > 0
        ? absences * dailyRateWithIncentives
        : absences * dailyRate;

    // Total salary without monthly incentives for net calculation
    const totalSalary = baseSalary + bonus + overtimeValue;
    const penalties = penaltyDays * dailyRate;
    const totalDeductions =
      purchases + advances + absenceDeduction + hourlyDeductions + penalties;
    const netSalary = totalSalary - totalDeductions;

    setFormData({
      ...data,
      overtimeValue: overtimeValue.toFixed(2),
      totalSalaryWithIncentives: totalSalaryWithIncentives.toFixed(2),
      totalSalary: totalSalary.toFixed(2),
      penalties: penalties.toFixed(2),
      netSalary: netSalary.toFixed(2),
    });
  };

  const handleCalculate = () => {
    calculateSalary(formData);
  };

  const handleSave = async () => {
    if (!selectedEmployeeId) return;

    const salaryData = {
      employeeId: selectedEmployeeId,
      employeeName: selectedEmployee?.name || "",
      month: selectedMonth,
      monthName:
        months.find((m) => m.value === selectedMonth)?.label || selectedMonth,
      year: selectedYear,
      baseSalary: parseFloat(formData.baseSalary) || 0,
      monthlyIncentives: parseFloat(formData.monthlyIncentives) || 0,
      bonus: parseFloat(formData.bonus) || 0,
      overtimeHours: parseFloat(formData.overtimeHours) || 0,
      overtimeValue: parseFloat(formData.overtimeValue) || 0,
      purchases: parseFloat(formData.purchases) || 0,
      advances: parseFloat(formData.advances) || 0,
      absences: parseFloat(formData.absences) || 0,
      hourlyDeductions: parseFloat(formData.hourlyDeductions) || 0,
      penaltyDays: parseFloat(formData.penaltyDays) || 0,
      penalties: parseFloat(formData.penalties) || 0,
      netSalary: parseFloat(formData.netSalary) || 0,
      date: new Date().toISOString(),
    };

    try {
      // Save to Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from("salary_components")
          .insert([
            {
              employee_id: salaryData.employeeId,
              month: salaryData.month,
              year: parseInt(salaryData.year),
              bonus: salaryData.bonus,
              allowances: salaryData.monthlyIncentives,
              deductions: salaryData.hourlyDeductions + salaryData.penalties,
              purchases: salaryData.purchases,
              loans: salaryData.advances,
              absences: salaryData.absences,
              overtime_hours: salaryData.overtimeHours,
              penalty_days: salaryData.penaltyDays,
              net_salary: salaryData.netSalary,
            },
          ]);

        if (error) {
          console.error("Error saving salary:", error);
          alert(`حدث خطأ أثناء حفظ الراتب: ${error.message}`);
          return;
        }
      }

      // Save to localStorage for persistence
      const savedSalaries = JSON.parse(
        localStorage.getItem("salaries") || "[]",
      );
      savedSalaries.push(salaryData);
      localStorage.setItem("salaries", JSON.stringify(savedSalaries));

      // If there are advances being deducted, update their status
      if (parseFloat(formData.advances) > 0 && selectedEmployeeId) {
        // Get the advances from localStorage
        const savedAdvances = JSON.parse(
          localStorage.getItem("advances") || "[]",
        );
        let remainingAdvanceAmount = parseFloat(formData.advances);

        // Update each advance until the deducted amount is covered
        const updatedAdvances = savedAdvances.map((advance) => {
          if (
            advance.employeeId === selectedEmployeeId &&
            advance.status === "pending" &&
            remainingAdvanceAmount > 0
          ) {
            const advanceAmount = advance.remainingAmount || advance.amount;

            if (remainingAdvanceAmount >= advanceAmount) {
              // Fully pay off this advance
              remainingAdvanceAmount -= advanceAmount;
              return {
                ...advance,
                status: "paid",
                remainingAmount: 0,
                actualRepaymentDate: new Date().toISOString().split("T")[0],
              };
            } else {
              // Partially pay off this advance
              const newRemainingAmount = advanceAmount - remainingAdvanceAmount;
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

        // Update Supabase if available
        if (supabase) {
          // This would be implemented in a real app
          console.log("Would update advances in Supabase");
        }
      }

      alert("تم حفظ الراتب بنجاح");
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert(
        `حدث خطأ غير متوقع: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const months = [
    { value: "1", label: "يناير" },
    { value: "2", label: "فبراير" },
    { value: "3", label: "مارس" },
    { value: "4", label: "أبريل" },
    { value: "5", label: "مايو" },
    { value: "6", label: "يونيو" },
    { value: "7", label: "يوليو" },
    { value: "8", label: "أغسطس" },
    { value: "9", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
  ];

  const years = [
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

  const payslipData = selectedEmployee
    ? {
        name: selectedEmployee.name,
        position: selectedEmployee.position,
        department: selectedEmployee.department,
        month: selectedMonth,
        year: selectedYear,
        baseSalary: parseFloat(formData.baseSalary) || 0,
        incentives: parseFloat(formData.monthlyIncentives) || 0,
        bonuses: parseFloat(formData.bonus) || 0,
        overtime: parseFloat(formData.overtimeValue) || 0,
        totalAdditions: parseFloat(formData.totalSalary) || 0,
        deductions: parseFloat(formData.hourlyDeductions) || 0,
        advances: parseFloat(formData.advances) || 0,
        purchases: parseFloat(formData.purchases) || 0,
        totalDeductions:
          parseFloat(formData.totalSalary) - parseFloat(formData.netSalary) ||
          0,
        netSalary: parseFloat(formData.netSalary) || 0,
      }
    : {
        name: "",
        position: "",
        department: "",
        month: "",
        year: "",
        baseSalary: 0,
        incentives: 0,
        bonuses: 0,
        overtime: 0,
        totalAdditions: 0,
        deductions: 0,
        advances: 0,
        purchases: 0,
        totalDeductions: 0,
        netSalary: 0,
      };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          حساب الرواتب
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/salaries/history")}
          >
            <FileText className="ml-2 h-4 w-4" />
            سجل الرواتب
          </Button>
          <Button
            variant="outline"
            onClick={() => setPrintDialogOpen(true)}
            disabled={!selectedEmployee || !formData.netSalary}
          >
            <Printer className="ml-2 h-4 w-4" />
            طباعة قسيمة الراتب
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 w-full md:w-1/3">
              <Label>اختر الموظف</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={handleEmployeeSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر موظف" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full md:w-1/3">
              <Label>الشهر</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full md:w-1/3">
              <Label>السنة</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedEmployee && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>قيمة الوحدة اليومية</Label>
                  <Input
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>قيمة اليوم بالحوافز</Label>
                  <Input
                    name="dailyRateWithIncentives"
                    value={formData.dailyRateWithIncentives}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>قيمة وحدة الأوفرتايم</Label>
                  <Input
                    name="overtimeRate"
                    value={formData.overtimeRate}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الراتب الأساسي</Label>
                  <Input
                    name="baseSalary"
                    value={formData.baseSalary}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحوافز الشهرية</Label>
                  <Input
                    name="monthlyIncentives"
                    value={formData.monthlyIncentives}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>إجمالي المرتب بالحافز</Label>
                  <Input
                    name="totalSalaryWithIncentives"
                    value={formData.totalSalaryWithIncentives}
                    readOnly
                    className="text-right bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>المكافأة</Label>
                  <Input
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>عدد ساعات الأوفرتايم</Label>
                  <Input
                    name="overtimeHours"
                    value={formData.overtimeHours}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>قيمة الأوفرتايم</Label>
                  <Input
                    name="overtimeValue"
                    value={formData.overtimeValue}
                    readOnly
                    className="text-right bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>إجمالي الراتب</Label>
                  <Input
                    name="totalSalary"
                    value={formData.totalSalary}
                    readOnly
                    className="text-right bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>المشتريات</Label>
                  <Input
                    name="purchases"
                    value={formData.purchases}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>السلف</Label>
                  <Input
                    name="advances"
                    value={formData.advances}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الغيابات (أيام)</Label>
                  <Input
                    name="absences"
                    value={formData.absences}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الخصومات/الساعات</Label>
                  <Input
                    name="hourlyDeductions"
                    value={formData.hourlyDeductions}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>أيام الجزاءات</Label>
                  <Input
                    name="penaltyDays"
                    value={formData.penaltyDays}
                    onChange={handleInputChange}
                    className="text-right"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الجزاءات</Label>
                  <Input
                    name="penalties"
                    value={formData.penalties}
                    readOnly
                    className="text-right bg-muted"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>صافي الراتب</Label>
                  <Input
                    name="netSalary"
                    value={formData.netSalary}
                    readOnly
                    className="text-right bg-muted font-bold text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleCalculate}>
                  <Calculator className="ml-2 h-4 w-4" />
                  حساب الراتب
                </Button>
                <Button onClick={handleSave}>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <PrintPayslip
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        employeeData={payslipData}
      />
    </div>
  );
}
