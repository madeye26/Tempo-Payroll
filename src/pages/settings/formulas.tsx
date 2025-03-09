import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/use-auth";
import { Calculator, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function FormulasPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  // Default formulas
  const [salaryFormula, setSalaryFormula] = useState(
    "baseSalary + monthlyIncentives + bonuses + overtime",
  );
  const [deductionsFormula, setDeductionsFormula] = useState(
    "absences * dailyRate + penalties + advances + purchases",
  );
  const [netSalaryFormula, setNetSalaryFormula] = useState(
    "totalSalary - totalDeductions",
  );
  const [dailyRateFormula, setDailyRateFormula] = useState(
    "baseSalary / workingDays",
  );
  const [overtimeFormula, setOvertimeFormula] = useState(
    "overtimeHours * (dailyRate / 8) * 1.5",
  );

  // Variables explanation
  const variables = [
    { name: "baseSalary", description: "الراتب الأساسي للموظف" },
    { name: "monthlyIncentives", description: "الحوافز الشهرية" },
    { name: "bonuses", description: "المكافآت" },
    { name: "overtime", description: "قيمة الأوفرتايم" },
    { name: "overtimeHours", description: "عدد ساعات الأوفرتايم" },
    { name: "absences", description: "عدد أيام الغياب" },
    { name: "penalties", description: "قيمة الجزاءات" },
    { name: "advances", description: "قيمة السلف" },
    { name: "purchases", description: "قيمة المشتريات" },
    { name: "dailyRate", description: "قيمة اليوم الواحد" },
    {
      name: "workingDays",
      description: "عدد أيام العمل في الشهر (عادة 30 يوم)",
    },
    { name: "totalSalary", description: "إجمالي الراتب" },
    { name: "totalDeductions", description: "إجمالي الخصومات" },
  ];

  const handleSave = () => {
    // Save formulas to localStorage
    const formulas = {
      salaryFormula,
      deductionsFormula,
      netSalaryFormula,
      dailyRateFormula,
      overtimeFormula,
    };
    localStorage.setItem("salary_formulas", JSON.stringify(formulas));

    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ معادلات الرواتب بنجاح",
    });
  };

  const handleReset = () => {
    // Reset to default formulas
    setSalaryFormula("baseSalary + monthlyIncentives + bonuses + overtime");
    setDeductionsFormula(
      "absences * dailyRate + penalties + advances + purchases",
    );
    setNetSalaryFormula("totalSalary - totalDeductions");
    setDailyRateFormula("baseSalary / workingDays");
    setOvertimeFormula("overtimeHours * (dailyRate / 8) * 1.5");

    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين معادلات الرواتب إلى القيم الافتراضية",
    });
  };

  if (!hasPermission("manage_settings")) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">غير مصرح</h1>
        <p className="mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        <Button onClick={() => window.history.back()}>العودة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          معادلات الرواتب
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave}>
            <Save className="ml-2 h-4 w-4" />
            حفظ
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>معادلة إجمالي الراتب</Label>
            <Textarea
              value={salaryFormula}
              onChange={(e) => setSalaryFormula(e.target.value)}
              className="font-mono text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>معادلة إجمالي الخصومات</Label>
            <Textarea
              value={deductionsFormula}
              onChange={(e) => setDeductionsFormula(e.target.value)}
              className="font-mono text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>معادلة صافي الراتب</Label>
            <Textarea
              value={netSalaryFormula}
              onChange={(e) => setNetSalaryFormula(e.target.value)}
              className="font-mono text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>معادلة قيمة اليوم الواحد</Label>
            <Textarea
              value={dailyRateFormula}
              onChange={(e) => setDailyRateFormula(e.target.value)}
              className="font-mono text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>معادلة الأوفرتايم</Label>
            <Textarea
              value={overtimeFormula}
              onChange={(e) => setOvertimeFormula(e.target.value)}
              className="font-mono text-right"
              dir="ltr"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">المتغيرات المتاحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variables.map((variable) => (
            <div key={variable.name} className="flex items-start gap-2">
              <div className="p-1 bg-primary/10 rounded text-primary">
                <Calculator className="h-4 w-4" />
              </div>
              <div>
                <p className="font-mono font-medium">{variable.name}</p>
                <p className="text-sm text-muted-foreground">
                  {variable.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
