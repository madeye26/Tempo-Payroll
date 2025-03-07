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
      <DialogContent className="max-w-3xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            قسيمة الراتب
          </DialogTitle>
        </DialogHeader>

        <div id="payslip-content" className="p-6 border rounded-md">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">شركتك</h2>
              <p className="text-sm text-muted-foreground">القاهرة، مصر</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                قسيمة راتب: {employeeData.month} {employeeData.year}
              </p>
              <p className="text-sm text-muted-foreground">
                تاريخ الإصدار: {new Date().toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>

          <div className="mb-6 border-b pb-4">
            <h3 className="font-semibold mb-2">بيانات الموظف</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">الاسم</p>
                <p>{employeeData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المنصب</p>
                <p>{employeeData.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">القسم</p>
                <p>{employeeData.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الفترة</p>
                <p>
                  {employeeData.month} {employeeData.year}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">تفاصيل الراتب</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <h4 className="font-medium">الإضافات</h4>
                <div className="flex justify-between mt-2">
                  <span>الراتب الأساسي</span>
                  <span>{employeeData.baseSalary} ج.م</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>الحوافز</span>
                  <span>{employeeData.incentives} ج.م</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>المكافآت</span>
                  <span>{employeeData.bonuses} ج.م</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>الأوفرتايم</span>
                  <span>{employeeData.overtime} ج.م</span>
                </div>
                <div className="flex justify-between mt-2 font-semibold border-t pt-2">
                  <span>إجمالي الإضافات</span>
                  <span>{employeeData.totalAdditions} ج.م</span>
                </div>
              </div>

              <div className="border-b pb-2">
                <h4 className="font-medium">الخصومات</h4>
                <div className="flex justify-between mt-2">
                  <span>الخصومات العامة</span>
                  <span>{employeeData.deductions} ج.م</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>السلف</span>
                  <span>{employeeData.advances} ج.م</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>المشتريات</span>
                  <span>{employeeData.purchases} ج.م</span>
                </div>
                <div className="flex justify-between mt-2 font-semibold border-t pt-2">
                  <span>إجمالي الخصومات</span>
                  <span>{employeeData.totalDeductions} ج.م</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">صافي الراتب</span>
              <span className="text-lg font-bold">
                {employeeData.netSalary} ج.م
              </span>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>هذه الوثيقة تم إنشاؤها إلكترونياً ولا تحتاج إلى توقيع</p>
            <p>© {new Date().getFullYear()} شركتك - جميع الحقوق محفوظة</p>
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
