import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save, Calculator, Info, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SalaryFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: Record<string, string>;
  isDefault: boolean;
}

interface SalaryFormulaEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formula: SalaryFormula) => void;
  initialFormula?: SalaryFormula;
}

export function SalaryFormulaEditor({
  open,
  onOpenChange,
  onSave,
  initialFormula,
}: SalaryFormulaEditorProps) {
  const [formula, setFormula] = useState<SalaryFormula>(
    initialFormula || {
      id: Date.now().toString(),
      name: "",
      description: "",
      formula:
        "baseSalary + (baseSalary / daysInMonth * workDays) + allowances - deductions",
      variables: {
        baseSalary: "الراتب الأساسي",
        daysInMonth: "عدد أيام الشهر",
        workDays: "أيام العمل",
        allowances: "البدلات",
        deductions: "الخصومات",
      },
      isDefault: false,
    },
  );

  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableLabel, setNewVariableLabel] = useState("");
  const [testValues, setTestValues] = useState<Record<string, number>>({
    baseSalary: 5000,
    daysInMonth: 30,
    workDays: 22,
    allowances: 1000,
    deductions: 500,
  });
  const [testResult, setTestResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariable = () => {
    if (!newVariableName || !newVariableLabel) return;

    setFormula({
      ...formula,
      variables: {
        ...formula.variables,
        [newVariableName]: newVariableLabel,
      },
    });

    setTestValues({
      ...testValues,
      [newVariableName]: 0,
    });

    setNewVariableName("");
    setNewVariableLabel("");
  };

  const handleRemoveVariable = (name: string) => {
    const { [name]: _, ...restVariables } = formula.variables;
    const { [name]: __, ...restTestValues } = testValues;

    setFormula({
      ...formula,
      variables: restVariables,
    });

    setTestValues(restTestValues);
  };

  const handleTestFormula = () => {
    try {
      // Create a function from the formula string
      const formulaFunction = new Function(
        ...Object.keys(testValues),
        `return ${formula.formula};`,
      );

      // Execute the function with test values
      const result = formulaFunction(...Object.values(testValues));
      setTestResult(result);
      setError(null);
    } catch (err) {
      setError("خطأ في الصيغة. تأكد من استخدام المتغيرات بشكل صحيح.");
      setTestResult(null);
    }
  };

  const handleSave = () => {
    if (!formula.name || !formula.formula) return;

    // Test the formula before saving
    try {
      const formulaFunction = new Function(
        ...Object.keys(testValues),
        `return ${formula.formula};`,
      );
      formulaFunction(...Object.values(testValues));
      onSave(formula);
      onOpenChange(false);
    } catch (err) {
      setError("لا يمكن حفظ الصيغة. يوجد خطأ في الصيغة.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>محرر صيغة حساب الراتب</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم الصيغة</Label>
              <Input
                value={formula.name}
                onChange={(e) =>
                  setFormula({ ...formula, name: e.target.value })
                }
                className="text-right"
                placeholder="مثال: صيغة الراتب الأساسية"
              />
            </div>

            <div className="space-y-2">
              <Label>وصف الصيغة</Label>
              <Textarea
                value={formula.description}
                onChange={(e) =>
                  setFormula({ ...formula, description: e.target.value })
                }
                className="text-right"
                placeholder="وصف مختصر للصيغة والغرض منها"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-right">
                        استخدم المتغيرات المعرفة في الصيغة. يمكنك استخدام
                        العمليات الحسابية (+, -, *, /) والدوال الرياضية مثل
                        Math.round().
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Label>الصيغة</Label>
              </div>
              <Textarea
                value={formula.formula}
                onChange={(e) =>
                  setFormula({ ...formula, formula: e.target.value })
                }
                className="text-right font-mono"
                dir="ltr"
                rows={4}
              />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">المتغيرات</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المتغير (بالإنجليزية)</Label>
                  <Input
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                    className="text-right"
                    placeholder="variable_name"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label>وصف المتغير (بالعربية)</Label>
                  <Input
                    value={newVariableLabel}
                    onChange={(e) => setNewVariableLabel(e.target.value)}
                    className="text-right"
                    placeholder="وصف المتغير"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddVariable}
                disabled={!newVariableName || !newVariableLabel}
                variant="outline"
                size="sm"
              >
                إضافة متغير
              </Button>

              <div className="mt-2">
                {Object.entries(formula.variables).map(([name, label]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-2 bg-muted/20 rounded mb-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariable(name)}
                      className="text-destructive"
                    >
                      حذف
                    </Button>
                    <div className="text-right">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">اختبار الصيغة</h3>

              <div className="space-y-4">
                {Object.entries(testValues).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setTestValues({
                          ...testValues,
                          [name]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="text-right"
                    />
                    <Label className="w-40 text-right">
                      {formula.variables[name] || name}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  {testResult !== null && (
                    <div className="text-lg font-bold">
                      النتيجة: {testResult.toFixed(2)}
                    </div>
                  )}
                  {error && (
                    <div className="text-destructive text-sm">{error}</div>
                  )}
                </div>
                <Button onClick={handleTestFormula}>
                  <Calculator className="ml-2 h-4 w-4" />
                  اختبار الصيغة
                </Button>
              </div>
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">معلومات إضافية</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-right">
                    يمكنك استخدام متغير <code>daysInMonth</code> للإشارة إلى عدد
                    أيام الشهر (28 أو 29 أو 30 أو 31).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-right">
                    استخدم <code>Math.round(x)</code> لتقريب الأرقام إلى أقرب
                    عدد صحيح.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-right">
                    يمكنك استخدام <code>Math.max(x, y)</code> للحصول على القيمة
                    الأكبر و <code>Math.min(x, y)</code> للقيمة الأصغر.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formula.isDefault}
                  onChange={(e) =>
                    setFormula({ ...formula, isDefault: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDefault" className="mr-2">
                  استخدام هذه الصيغة كصيغة افتراضية
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formula.name || !formula.formula}
          >
            <Save className="ml-2 h-4 w-4" />
            حفظ الصيغة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
