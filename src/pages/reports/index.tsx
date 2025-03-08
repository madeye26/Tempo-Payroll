import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEmployees } from "@/lib/hooks/use-employees";
import { CalendarIcon, FileDown, Printer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { DataExport } from "@/components/ui/data-export";
import { AdvancedAnalytics } from "@/components/salary-calculator/advanced-analytics";
import { ReportTemplateBuilder } from "@/components/salary-calculator/report-template-builder";
import { PrintReport } from "@/components/salary-calculator/print-report";

interface SalaryReport {
  id: string;
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  incentives: number;
  bonuses: number;
  overtime: number;
  totalAdditions: number;
  deductions: number;
  advances: number;
  purchases: number;
  totalDeductions: number;
  netSalary: number;
  absences: number;
  penaltyDays: number;
  month: string;
  year: number;
}

export default function ReportsPage() {
  const { employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState("5");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [reportType, setReportType] = useState("monthly");
  const [templateBuilderOpen, setTemplateBuilderOpen] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [printReportOpen, setPrintReportOpen] = useState(false);

  // Load salary reports from localStorage or use mock data
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>([]);

  useEffect(() => {
    // Try to load saved salaries from localStorage
    const savedSalaries = localStorage.getItem("salaries");
    if (savedSalaries) {
      try {
        const parsedSalaries = JSON.parse(savedSalaries);
        const formattedReports = parsedSalaries.map(
          (salary: any, index: number) => ({
            id: salary.date
              ? new Date(salary.date).getTime().toString()
              : index.toString(),
            employeeId: salary.employeeId,
            employeeName: salary.employeeName,
            baseSalary: salary.baseSalary,
            incentives: salary.monthlyIncentives,
            bonuses: salary.bonus,
            overtime: salary.overtimeValue,
            totalAdditions:
              salary.baseSalary +
              salary.monthlyIncentives +
              salary.bonus +
              salary.overtimeValue,
            deductions: salary.hourlyDeductions,
            advances: salary.advances,
            purchases: salary.purchases,
            absences: parseInt(salary.absences) || 0,
            penaltyDays: parseInt(salary.penaltyDays) || 0,
            totalDeductions:
              salary.advances +
              salary.purchases +
              salary.hourlyDeductions +
              salary.penalties,
            netSalary: salary.netSalary,
            month: salary.month,
            year: parseInt(salary.year),
          }),
        );
        setSalaryReports(formattedReports);
      } catch (error) {
        console.error("Error parsing saved salaries:", error);
        // Fall back to mock data if parsing fails
        setDefaultMockData();
      }
    } else {
      // If no saved data, use mock data
      setDefaultMockData();
    }
  }, []);

  // Function to set default mock data
  const setDefaultMockData = () => {
    setSalaryReports([
      {
        id: "1",
        employeeId: "1",
        employeeName: "أحمد محمد",
        baseSalary: 5000,
        incentives: 500,
        bonuses: 200,
        overtime: 300,
        totalAdditions: 1000,
        deductions: 200,
        advances: 500,
        purchases: 300,
        totalDeductions: 1000,
        netSalary: 5000,
        absences: 2,
        penaltyDays: 1,
        month: "5",
        year: 2024,
      },
      {
        id: "2",
        employeeId: "2",
        employeeName: "فاطمة علي",
        baseSalary: 4500,
        incentives: 400,
        bonuses: 150,
        overtime: 250,
        totalAdditions: 800,
        deductions: 150,
        advances: 400,
        purchases: 250,
        totalDeductions: 800,
        netSalary: 4500,
        absences: 1,
        penaltyDays: 0,
        month: "5",
        year: 2024,
      },
    ]);
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

  const filteredReports = salaryReports.filter((report) => {
    if (reportType === "monthly") {
      return (
        report.month === selectedMonth &&
        report.year.toString() === selectedYear
      );
    } else {
      // For yearly reports, only show unique employees for the selected year
      return report.year.toString() === selectedYear;
    }
  });

  const totalSalaries = filteredReports.reduce(
    (sum, report) => sum + report.netSalary,
    0,
  );
  const totalIncentives = filteredReports.reduce(
    (sum, report) => sum + report.incentives,
    0,
  );
  const totalAdvances = filteredReports.reduce(
    (sum, report) => sum + report.advances,
    0,
  );
  const totalDeductions = filteredReports.reduce(
    (sum, report) => sum + report.totalDeductions,
    0,
  );

  const columns: ColumnDef<SalaryReport>[] = [
    {
      accessorKey: "employeeName",
      header: "اسم الموظف",
    },
    {
      accessorKey: "baseSalary",
      header: "الراتب الأساسي",
      cell: ({ row }) => `${row.getValue("baseSalary")} ج.م`,
    },
    {
      accessorKey: "incentives",
      header: "الحوافز",
      cell: ({ row }) => `${row.getValue("incentives")} ج.م`,
    },
    {
      accessorKey: "bonuses",
      header: "المكافآت",
      cell: ({ row }) => `${row.getValue("bonuses")} ج.م`,
    },
    {
      accessorKey: "overtime",
      header: "الأوفرتايم",
      cell: ({ row }) => `${row.getValue("overtime")} ج.م`,
    },
    {
      accessorKey: "totalAdditions",
      header: "إجمالي الإضافات",
      cell: ({ row }) => `${row.getValue("totalAdditions")} ج.م`,
    },
    {
      accessorKey: "absences",
      header: "الغيابات (أيام)",
      cell: ({ row }) => row.getValue("absences"),
    },
    {
      accessorKey: "penaltyDays",
      header: "أيام الجزاءات",
      cell: ({ row }) => row.getValue("penaltyDays"),
    },
    {
      accessorKey: "deductions",
      header: "الخصومات",
      cell: ({ row }) => `${row.getValue("deductions")} ج.م`,
    },
    {
      accessorKey: "advances",
      header: "السلف",
      cell: ({ row }) => `${row.getValue("advances")} ج.م`,
    },
    {
      accessorKey: "purchases",
      header: "المشتريات",
      cell: ({ row }) => `${row.getValue("purchases")} ج.م`,
    },
    {
      accessorKey: "totalDeductions",
      header: "إجمالي الخصومات",
      cell: ({ row }) => `${row.getValue("totalDeductions")} ج.م`,
    },
    {
      accessorKey: "netSalary",
      header: "صافي الراتب",
      cell: ({ row }) => `${row.getValue("netSalary")} ج.م`,
    },
  ];

  const handleGenerateReport = () => {
    // Get all saved salaries from localStorage
    const savedSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");

    // Format the salaries for the report
    const formattedReports = savedSalaries.map((salary: any, index: number) => {
      // Convert month names to month numbers for comparison
      let monthNumber = "";
      for (let i = 0; i < months.length; i++) {
        if (
          months[i].value === salary.month ||
          months[i].label === salary.month
        ) {
          monthNumber = months[i].value;
          break;
        }
      }

      return {
        id: salary.date
          ? new Date(salary.date).getTime().toString()
          : index.toString(),
        employeeId: salary.employeeId,
        employeeName: salary.employeeName,
        baseSalary: salary.baseSalary,
        incentives: salary.monthlyIncentives,
        bonuses: salary.bonus,
        overtime: salary.overtimeValue,
        totalAdditions:
          salary.baseSalary +
          salary.monthlyIncentives +
          salary.bonus +
          salary.overtimeValue,
        deductions: salary.hourlyDeductions,
        advances: salary.advances,
        purchases: salary.purchases,
        totalDeductions:
          salary.advances +
          salary.purchases +
          salary.hourlyDeductions +
          salary.penalties,
        netSalary: salary.netSalary,
        month: monthNumber || salary.month,
        year: parseInt(salary.year),
      };
    });

    // Update the reports state
    setSalaryReports(formattedReports);

    console.log("Generated reports:", formattedReports);
    console.log("Selected month:", selectedMonth);
    console.log("Selected year:", selectedYear);

    // Show a confirmation message
    alert(
      `تم إنشاء التقرير بنجاح لـ ${reportType === "monthly" ? months.find((m) => m.value === selectedMonth)?.label : "سنة"} ${selectedYear}`,
    );
  };

  const handleSaveTemplate = (template: any) => {
    setSavedTemplates([...savedTemplates, template]);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          تقارير الرواتب
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setTemplateBuilderOpen(true)}
          >
            إنشاء قالب تقرير
          </Button>
          <Button
            variant="outline"
            onClick={() => setPrintReportOpen(true)}
            disabled={filteredReports.length === 0}
          >
            <Printer className="ml-2 h-4 w-4" />
            طباعة التقرير
          </Button>
          <DataExport
            data={filteredReports}
            filename={`salary-report-${selectedYear}-${selectedMonth}`}
          />
        </div>
      </div>

      <Tabs
        defaultValue="monthly"
        className="w-full"
        onValueChange={setReportType}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">تقارير شهرية</TabsTrigger>
          <TabsTrigger value="yearly">تقارير سنوية</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
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

              <Button
                className="w-full md:w-auto"
                onClick={handleGenerateReport}
              >
                إنشاء التقرير
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">ملخص التقرير الشهري</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 space-y-2 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-muted-foreground">إجمالي الرواتب</p>
                <p className="text-2xl font-bold">{totalSalaries} ج.م</p>
              </Card>
              <Card className="p-4 space-y-2 bg-green-50 dark:bg-green-900/20">
                <p className="text-muted-foreground">إجمالي الحوافز</p>
                <p className="text-2xl font-bold">{totalIncentives} ج.م</p>
              </Card>
              <Card className="p-4 space-y-2 bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-muted-foreground">إجمالي السلف</p>
                <p className="text-2xl font-bold">{totalAdvances} ج.م</p>
              </Card>
              <Card className="p-4 space-y-2 bg-red-50 dark:bg-red-900/20">
                <p className="text-muted-foreground">إجمالي الخصومات</p>
                <p className="text-2xl font-bold">{totalDeductions} ج.م</p>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">تفاصيل الرواتب</h3>
            {filteredReports.length > 0 ? (
              <DataTable
                columns={columns}
                data={filteredReports}
                searchKey="employeeName"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد بيانات للعرض. الرجاء إنشاء التقرير أولاً.
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
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

              <Button
                className="w-full md:w-auto"
                onClick={handleGenerateReport}
              >
                إنشاء التقرير
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">ملخص التقرير السنوي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 space-y-2">
                <p className="text-muted-foreground">إجمالي الرواتب السنوية</p>
                <p className="text-2xl font-bold">{totalSalaries * 12} ج.م</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-muted-foreground">متوسط الرواتب الشهرية</p>
                <p className="text-2xl font-bold">{totalSalaries} ج.م</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-muted-foreground">عدد الموظفين</p>
                <p className="text-2xl font-bold">{filteredReports.length}</p>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="text-muted-foreground">إجمالي الخصومات السنوية</p>
                <p className="text-2xl font-bold">{totalDeductions * 12} ج.م</p>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">
              تفاصيل الرواتب السنوية
            </h3>
            {filteredReports.length > 0 ? (
              <DataTable
                columns={columns}
                data={filteredReports}
                searchKey="employeeName"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد بيانات للعرض. الرجاء إنشاء التقرير أولاً.
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                الموظفين الذين لديهم سلف غير مدفوعة
              </h3>
              <p className="text-muted-foreground">
                لا يوجد موظفين لديهم سلف غير مدفوعة
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AdvancedAnalytics
        data={[
          {
            month: "يناير",
            year: 2024,
            totalSalaries: 25000,
            totalDeductions: 5000,
            totalAdvances: 2000,
            employeeCount: 10,
            averageSalary: 2500,
          },
          {
            month: "فبراير",
            year: 2024,
            totalSalaries: 27000,
            totalDeductions: 5500,
            totalAdvances: 2200,
            employeeCount: 10,
            averageSalary: 2700,
          },
          {
            month: "مارس",
            year: 2024,
            totalSalaries: 26000,
            totalDeductions: 4800,
            totalAdvances: 1800,
            employeeCount: 10,
            averageSalary: 2600,
          },
          {
            month: "أبريل",
            year: 2024,
            totalSalaries: 28000,
            totalDeductions: 6000,
            totalAdvances: 2500,
            employeeCount: 11,
            averageSalary: 2545,
          },
          {
            month: "مايو",
            year: 2024,
            totalSalaries: 30000,
            totalDeductions: 6200,
            totalAdvances: 2700,
            employeeCount: 12,
            averageSalary: 2500,
          },
          {
            month: "يونيو",
            year: 2024,
            totalSalaries: 29000,
            totalDeductions: 5800,
            totalAdvances: 2300,
            employeeCount: 12,
            averageSalary: 2417,
          },
        ]}
      />

      <ReportTemplateBuilder
        open={templateBuilderOpen}
        onOpenChange={setTemplateBuilderOpen}
        onSave={handleSaveTemplate}
      />

      <PrintReport
        open={printReportOpen}
        onOpenChange={setPrintReportOpen}
        reports={filteredReports}
        month={months.find((m) => m.value === selectedMonth)?.label || ""}
        year={selectedYear}
      />
    </div>
  );
}
