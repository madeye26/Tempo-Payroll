import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SalarySummaryProps {
  totalSalary?: number;
  totalDeductions?: number;
  netSalary?: number;
  onSave?: () => void;
  loading?: boolean;
}

const SalarySummary = ({
  totalSalary = 5000,
  totalDeductions = 1000,
  netSalary = 4000,
  onSave = () => console.log("Save clicked"),
  loading = false,
}: SalarySummaryProps) => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-lg">
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-right">ملخص الراتب</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 text-right">
          <div className="space-y-2">
            <p className="text-gray-600">المجموع الكلي</p>
            <p className="text-2xl font-bold">{totalSalary} ج.م</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">إجمالي الخصومات</p>
            <p className="text-2xl font-bold text-red-600">
              {totalDeductions} ج.م
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">صافي الراتب</p>
            <p className="text-2xl font-bold text-green-600">{netSalary} ج.م</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-4">
          <Button
            onClick={onSave}
            className="min-w-[120px] bg-primary"
            disabled={loading}
          >
            حفظ
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SalarySummary;
