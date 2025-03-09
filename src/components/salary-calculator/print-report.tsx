import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";

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
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;

    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html dir="rtl">
            <head>
              <title>تقرير الرواتب - ${month} ${year}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  direction: rtl;
                  max-width: 1200px;
                  margin: 0 auto;
                }
                .report {
                  border: 1px solid #ccc;
                  padding: 20px;
                  width: 100%;
                  box-sizing: border-box;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #333;
                  padding-bottom: 10px;
                }
                .company-name {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .report-title {
                  font-size: 18px;
                  margin-bottom: 5px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                  font-size: 14px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: right;
                }
                th {
                  background-color: #f2f2f2;
                  font-weight: bold;
                }
                .summary {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 20px;
                  border-top: 2px solid #333;
                  padding-top: 10px;
                }
                .summary-item {
                  text-align: center;
                  width: 25%;
                }
                .summary-label {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .summary-value {
                  font-size: 16px;
                }
                .signature-section {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 40px;
                }
                .signature-box {
                  width: 40%;
                }
                .signature-line {
                  border-top: 1px solid #333;
                  margin-top: 40px;
                  padding-top: 5px;
                  text-align: center;
                }
                @media print {
                  body {
                    padding: 0;
                    margin: 0;
                  }
                  .report {
                    border: none;
                    padding: 0;
                  }
                  .no-print {
                    display: none;
                  }
                  table {
                    page-break-inside: auto;
                  }
                  tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                  }
                }
              </style>
            </head>
            <body>
              ${printContent}
              <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #0891b2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  طباعة
                </button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Get company name from system settings or use default
  const systemSettings = JSON.parse(
    localStorage.getItem("system_settings") || "{}",
  );
  const companyName = systemSettings.companyName || "شركتك";
  const companyAddress = systemSettings.companyAddress || "القاهرة، مصر";

  // Calculate totals
  const totalSalaries = reports.reduce(
    (sum, report) => sum + report.netSalary,
    0,
  );
  const totalIncentives = reports.reduce(
    (sum, report) => sum + report.incentives,
    0,
  );
  const totalDeductions = reports.reduce(
    (sum, report) => sum + report.totalDeductions,
    0,
  );
  const totalEmployees = reports.length;

  // Format date
  const formattedDate = `${month} ${year}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl overflow-y-auto max-h-[90vh]"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>تقرير الرواتب الشهري</DialogTitle>
          <DialogDescription>
            تقرير الرواتب لشهر {formattedDate}.
          </DialogDescription>
        </DialogHeader>

        <div ref={printRef} className="report bg-white p-6 border rounded-md">
          <div className="header">
            <div className="company-name">{companyName}</div>
            <div className="report-title">تقرير الرواتب الشهري</div>
            <div>{companyAddress}</div>
            <div>الفترة: {formattedDate}</div>
          </div>

          <div className="overflow-x-auto">
            <table style={{ maxWidth: "100%" }}>
              <thead>
                <tr>
                  <th>اسم الموظف</th>
                  <th>الراتب الأساسي</th>
                  <th>الحوافز</th>
                  <th>المكافآت</th>
                  <th>الأوفرتايم</th>
                  <th>إجمالي الإضافات</th>
                  <th>الغيابات</th>
                  <th>الجزاءات</th>
                  <th>الخصومات</th>
                  <th>السلف</th>
                  <th>المشتريات</th>
                  <th>إجمالي الخصومات</th>
                  <th>صافي الراتب</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.employeeName}</td>
                    <td>{report.baseSalary.toLocaleString()} ج.م</td>
                    <td>{report.incentives.toLocaleString()} ج.م</td>
                    <td>{report.bonuses.toLocaleString()} ج.م</td>
                    <td>{report.overtime.toLocaleString()} ج.م</td>
                    <td>{report.totalAdditions.toLocaleString()} ج.م</td>
                    <td>{report.absences}</td>
                    <td>{report.penaltyDays}</td>
                    <td>{report.deductions.toLocaleString()} ج.م</td>
                    <td>{report.advances.toLocaleString()} ج.م</td>
                    <td>{report.purchases.toLocaleString()} ج.م</td>
                    <td>{report.totalDeductions.toLocaleString()} ج.م</td>
                    <td>{report.netSalary.toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <strong>الإجمالي</strong>
                  </td>
                  <td>
                    <strong>
                      {reports
                        .reduce((sum, r) => sum + r.totalAdditions, 0)
                        .toLocaleString()}{" "}
                      ج.م
                    </strong>
                  </td>
                  <td colSpan={5}></td>
                  <td>
                    <strong>{totalDeductions.toLocaleString()} ج.م</strong>
                  </td>
                  <td>
                    <strong>{totalSalaries.toLocaleString()} ج.م</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="summary">
            <div className="summary-item">
              <div className="summary-label">إجمالي الموظفين</div>
              <div className="summary-value">{totalEmployees}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">إجمالي الرواتب</div>
              <div className="summary-value">
                {totalSalaries.toLocaleString()} ج.م
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">إجمالي الحوافز</div>
              <div className="summary-value">
                {totalIncentives.toLocaleString()} ج.م
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">إجمالي الخصومات</div>
              <div className="summary-value">
                {totalDeductions.toLocaleString()} ج.م
              </div>
            </div>
          </div>

          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-line">إعداد</div>
            </div>
            <div className="signature-box">
              <div className="signature-line">اعتماد</div>
            </div>
          </div>
        </div>

        <DialogFooter>
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
