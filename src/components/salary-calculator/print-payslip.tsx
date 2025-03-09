import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface PayslipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeData: {
    name: string;
    position: string;
    department: string;
    month: string;
    year: string;
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
  };
}

export function PrintPayslip({
  open,
  onOpenChange,
  employeeData,
}: PayslipProps) {
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
              <title>قسيمة راتب - ${employeeData.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  direction: rtl;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .payslip {
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
                .payslip-title {
                  font-size: 18px;
                  margin-bottom: 5px;
                }
                .employee-info {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .info-group {
                  width: 48%;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                  padding: 5px 0;
                  border-bottom: 1px dashed #eee;
                }
                .info-label {
                  font-weight: bold;
                }
                .salary-details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .details-column {
                  width: 48%;
                }
                .details-title {
                  font-weight: bold;
                  margin-bottom: 10px;
                  padding-bottom: 5px;
                  border-bottom: 1px solid #333;
                }
                .details-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                  padding: 5px 0;
                  border-bottom: 1px dashed #eee;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 10px;
                  padding-top: 10px;
                  border-top: 1px solid #333;
                  font-weight: bold;
                }
                .net-salary {
                  text-align: center;
                  margin-top: 20px;
                  padding: 10px;
                  background-color: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                }
                .net-salary-label {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .net-salary-value {
                  font-size: 24px;
                  font-weight: bold;
                  color: #0891b2;
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
                  .payslip {
                    border: none;
                    padding: 0;
                  }
                  .no-print {
                    display: none;
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

  // Get month name in Arabic
  const getMonthName = (monthNumber: string) => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const index = parseInt(monthNumber) - 1;
    return months[index] || monthNumber;
  };

  // Format date
  const formattedDate = `${getMonthName(employeeData.month)} ${employeeData.year}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl overflow-y-auto max-h-[90vh]"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>قسيمة راتب</DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="payslip bg-white p-6 border rounded-md">
          <div className="header">
            <div className="company-name">{companyName}</div>
            <div className="payslip-title">قسيمة راتب</div>
            <div>{companyAddress}</div>
            <div>الفترة: {formattedDate}</div>
          </div>

          <div className="employee-info">
            <div className="info-group">
              <div className="info-row">
                <div className="info-label">اسم الموظف:</div>
                <div>{employeeData.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">المنصب:</div>
                <div>{employeeData.position}</div>
              </div>
            </div>
            <div className="info-group">
              <div className="info-row">
                <div className="info-label">القسم:</div>
                <div>{employeeData.department}</div>
              </div>
              <div className="info-row">
                <div className="info-label">تاريخ الراتب:</div>
                <div>{formattedDate}</div>
              </div>
            </div>
          </div>

          <div className="salary-details">
            <div className="details-column">
              <div className="details-title">الإضافات</div>
              <div className="details-row">
                <div>الراتب الأساسي</div>
                <div>{employeeData.baseSalary.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>الحوافز</div>
                <div>{employeeData.incentives.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>المكافآت</div>
                <div>{employeeData.bonuses.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>الأوفرتايم</div>
                <div>{employeeData.overtime.toLocaleString()} ج.م</div>
              </div>
              <div className="total-row">
                <div>إجمالي الإضافات</div>
                <div>{employeeData.totalAdditions.toLocaleString()} ج.م</div>
              </div>
            </div>
            <div className="details-column">
              <div className="details-title">الخصومات</div>
              <div className="details-row">
                <div>الخصومات</div>
                <div>{employeeData.deductions.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>السلف</div>
                <div>{employeeData.advances.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>المشتريات</div>
                <div>{employeeData.purchases.toLocaleString()} ج.م</div>
              </div>
              <div className="details-row">
                <div>خصومات أخرى</div>
                <div>0 ج.م</div>
              </div>
              <div className="total-row">
                <div>إجمالي الخصومات</div>
                <div>{employeeData.totalDeductions.toLocaleString()} ج.م</div>
              </div>
            </div>
          </div>

          <div className="net-salary">
            <div className="net-salary-label">صافي الراتب</div>
            <div className="net-salary-value">
              {employeeData.netSalary.toLocaleString()} ج.م
            </div>
          </div>

          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-line">توقيع الموظف</div>
            </div>
            <div className="signature-box">
              <div className="signature-line">توقيع المدير</div>
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
