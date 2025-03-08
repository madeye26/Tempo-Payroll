import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface SalaryReport {
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
}

interface PrintReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reports: SalaryReport[];
  month: string;
  year: string;
}

export function PrintReport({
  open,
  onOpenChange,
  reports,
  month,
  year,
}: PrintReportProps) {
  const handlePrint = () => {
    const printContent = document.getElementById("report-content");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      onOpenChange(false);
    }
  };

  const totalBaseSalary = reports.reduce(
    (sum, report) => sum + report.baseSalary,
    0,
  );
  const totalIncentives = reports.reduce(
    (sum, report) => sum + report.incentives,
    0,
  );
  const totalBonuses = reports.reduce((sum, report) => sum + report.bonuses, 0);
  const totalOvertime = reports.reduce(
    (sum, report) => sum + report.overtime,
    0,
  );
  const totalAdditions = reports.reduce(
    (sum, report) => sum + report.totalAdditions,
    0,
  );
  const totalDeductions = reports.reduce(
    (sum, report) => sum + report.totalDeductions,
    0,
  );
  const totalNetSalary = reports.reduce(
    (sum, report) => sum + report.netSalary,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            تقرير الرواتب الشهري
          </DialogTitle>
        </DialogHeader>

        <div id="report-content" className="p-4 border rounded-md">
          <div className="text-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold">شركتك</h2>
            <p className="text-xs text-muted-foreground">القاهرة، مصر</p>
            <p className="text-xs mt-1">
              تقرير الرواتب: {month} {year}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border p-2 text-right">الموظف</th>
                  <th className="border p-2 text-right">الراتب الأساسي</th>
                  <th className="border p-2 text-right">الحوافز</th>
                  <th className="border p-2 text-right">المكافآت</th>
                  <th className="border p-2 text-right">الأوفرتايم</th>
                  <th className="border p-2 text-right">إجمالي الإضافات</th>
                  <th className="border p-2 text-right">الغيابات (أيام)</th>
                  <th className="border p-2 text-right">أيام الجزاءات</th>
                  <th className="border p-2 text-right">الخصومات</th>
                  <th className="border p-2 text-right">السلف</th>
                  <th className="border p-2 text-right">المشتريات</th>
                  <th className="border p-2 text-right">إجمالي الخصومات</th>
                  <th className="border p-2 text-right">صافي الراتب</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="hover:bg-muted/20">
                    <td className="border p-2 text-right">
                      {report.employeeName}
                    </td>
                    <td className="border p-2 text-right">
                      {report.baseSalary} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.incentives} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.bonuses} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.overtime} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.totalAdditions} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.absences || 0}
                    </td>
                    <td className="border p-2 text-right">
                      {report.penaltyDays || 0}
                    </td>
                    <td className="border p-2 text-right">
                      {report.deductions} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.advances} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.purchases} ج.م
                    </td>
                    <td className="border p-2 text-right">
                      {report.totalDeductions} ج.م
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {report.netSalary} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-bold">
                  <td className="border p-2 text-right">الإجمالي</td>
                  <td className="border p-2 text-right">
                    {totalBaseSalary} ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {totalIncentives} ج.م
                  </td>
                  <td className="border p-2 text-right">{totalBonuses} ج.م</td>
                  <td className="border p-2 text-right">{totalOvertime} ج.م</td>
                  <td className="border p-2 text-right">
                    {totalAdditions} ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {reports.reduce(
                      (sum, report) => sum + (report.absences || 0),
                      0,
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {reports.reduce(
                      (sum, report) => sum + (report.penaltyDays || 0),
                      0,
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {reports.reduce(
                      (sum, report) => sum + report.deductions,
                      0,
                    )}{" "}
                    ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {reports.reduce((sum, report) => sum + report.advances, 0)}{" "}
                    ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {reports.reduce((sum, report) => sum + report.purchases, 0)}{" "}
                    ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {totalDeductions} ج.م
                  </td>
                  <td className="border p-2 text-right">
                    {totalNetSalary} ج.م
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <p>تاريخ الإصدار: {new Date().toLocaleDateString("ar-EG")}</p>
            <p>© {new Date().getFullYear()} شركتك</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="ml-2 h-4 w-4" />
            طباعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
