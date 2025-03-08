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

interface PrintPayslipProps {
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
}: PrintPayslipProps) {
  const handlePrint = () => {
    const printContent = document.getElementById("payslip-content");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            قسيمة الراتب
          </DialogTitle>
        </DialogHeader>

        <div id="payslip-content" className="p-4 border rounded-md text-sm">
          <div className="text-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold">شركتك</h2>
            <p className="text-xs text-muted-foreground">القاهرة، مصر</p>
            <p className="text-xs mt-1">
              قسيمة راتب: {employeeData.month} {employeeData.year}
            </p>
          </div>

          <div className="mb-3 border-b pb-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="font-medium">الاسم:</span>
              <span>{employeeData.name}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-medium">المنصب:</span>
              <span>{employeeData.position}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-medium">القسم:</span>
              <span>{employeeData.department}</span>
            </div>
          </div>

          <div className="mb-3 text-xs">
            <h3 className="font-semibold mb-1 border-b">الإضافات</h3>
            <div className="flex justify-between mb-1">
              <span>الراتب الأساسي</span>
              <span>{employeeData.baseSalary} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>الحوافز</span>
              <span>{employeeData.incentives} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>المكافآت</span>
              <span>{employeeData.bonuses} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>الأوفرتايم</span>
              <span>{employeeData.overtime} ج.م</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>إجمالي الإضافات</span>
              <span>{employeeData.totalAdditions} ج.م</span>
            </div>
          </div>

          <div className="mb-3 text-xs">
            <h3 className="font-semibold mb-1 border-b">الخصومات</h3>
            <div className="flex justify-between mb-1">
              <span>الخصومات العامة</span>
              <span>{employeeData.deductions} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>السلف</span>
              <span>{employeeData.advances} ج.م</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>المشتريات</span>
              <span>{employeeData.purchases} ج.م</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>إجمالي الخصومات</span>
              <span>{employeeData.totalDeductions} ج.م</span>
            </div>
          </div>

          <div className="bg-muted p-2 rounded-md mb-3">
            <div className="flex justify-between items-center">
              <span className="font-bold">صافي الراتب</span>
              <span className="font-bold">{employeeData.netSalary} ج.م</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-2">
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
