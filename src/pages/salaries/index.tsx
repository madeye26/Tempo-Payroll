import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useSalaryCalculation } from "@/lib/hooks/use-salary-calculation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Calculator, Printer, Calendar } from "lucide-react";
import { PrintPayslip } from "@/components/salary-calculator/print-payslip";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function SalariesPage() {
  const { employees } = useEmployees();

  // Get advances data
  const [advances, setAdvances] = useState<any[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "أحمد محمد",
      amount: 1000,
      requestDate: "2024-05-01",
      expectedRepaymentDate: "2024-06-01",
      status: "pending",
      remainingAmount: 1000,
    },
    {
      id: "3",
      employeeId: "1",
      employeeName: "أحمد محمد",
      amount: 800,
      requestDate: "2024-05-10",
      expectedRepaymentDate: "2024-06-10",
      status: "pending",
      remainingAmount: 800,
    },
  ]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
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

  const handleSave = () => {
    console.log("Saving salary calculation:", {
      employeeId: selectedEmployeeId,
      month: selectedMonth,
      year: selectedYear,
      ...formData,
    });

    // If there are advances being deducted, update their status
    if (parseFloat(formData.advances) > 0 && selectedEmployeeId) {
      // This would update the advances in a real app
      // For now, we'll just log it
      console.log(
        `Deducted ${formData.advances} from employee ${selectedEmployeeId}'s advances`,
      );

      // In a real implementation, you would:
      // 1. Find the employee's pending advances
      // 2. Mark them as paid or partially paid
      // 3. Update the remaining amount for each advance
    }
  };

  const months = [
    { value: "يناير", label: "يناير" },
    { value: "فبراير", label: "فبراير" },
    { value: "مارس", label: "مارس" },
    { value: "أبريل", label: "أبريل" },
    { value: "مايو", label: "مايو" },
    { value: "يونيو", label: "يونيو" },
    { value: "يوليو", label: "يوليو" },
    { value: "أغسطس", label: "أغسطس" },
    { value: "سبتمبر", label: "سبتمبر" },
    { value: "أكتوبر", label: "أكتوبر" },
    { value: "نوفمبر", label: "نوفمبر" },
    { value: "ديسمبر", label: "ديسمبر" },
  ];

  const years = ["2022", "2023", "2024", "2025"];

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
