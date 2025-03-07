import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus, Copy } from "lucide-react";
import { SalaryFormulaEditor } from "@/components/salary-calculator/salary-formula-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface SalaryFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: Record<string, string>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FormulasPage() {
  const [formulas, setFormulas] = useState<SalaryFormula[]>([
    {
      id: "1",
      name: "الصيغة الأساسية",
      description: "صيغة حساب الراتب الأساسية مع مراعاة عدد أيام الشهر",
      formula:
        "baseSalary + (baseSalary / daysInMonth * workDays) + allowances - deductions",
      variables: {
        baseSalary: "الراتب الأساسي",
        daysInMonth: "عدد أيام الشهر",
        workDays: "أيام العمل",
        allowances: "البدلات",
        deductions: "الخصومات",
      },
      isDefault: true,
      createdAt: "2024-05-01T10:00:00Z",
      updatedAt: "2024-05-01T10:00:00Z",
    },
    {
      id: "2",
      name: "صيغة مع الأوفرتايم",
      description: "صيغة تتضمن حساب الأوفرتايم بمعدل 1.5",
      formula:
        "baseSalary + (baseSalary / daysInMonth * workDays) + allowances + (overtimeHours * hourlyRate * 1.5) - deductions",
      variables: {
        baseSalary: "الراتب الأساسي",
        daysInMonth: "عدد أيام الشهر",
        workDays: "أيام العمل",
        allowances: "البدلات",
        overtimeHours: "ساعات الأوفرتايم",
        hourlyRate: "معدل الساعة",
        deductions: "الخصومات",
      },
      isDefault: false,
      createdAt: "2024-05-15T14:30:00Z",
      updatedAt: "2024-05-15T14:30:00Z",
    },
  ]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<SalaryFormula | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formulaToDelete, setFormulaToDelete] = useState<string | null>(null);

  const handleSaveFormula = (formula: SalaryFormula) => {
    const now = new Date().toISOString();
    const updatedFormula = {
      ...formula,
      updatedAt: now,
      createdAt: formula.createdAt || now,
    };

    if (formula.isDefault) {
      // Make sure only one formula is default
      setFormulas(
        formulas.map((f) => ({
          ...f,
          isDefault: f.id === formula.id,
        })),
      );
    } else if (editingFormula?.isDefault && !formula.isDefault) {
      // If we're removing default status, make sure at least one formula is default
      const hasAnotherDefault = formulas.some(
        (f) => f.id !== formula.id && f.isDefault,
      );
      if (!hasAnotherDefault && formulas.length > 0) {
        updatedFormula.isDefault = true;
      }
    }

    if (editingFormula) {
      setFormulas(
        formulas.map((f) => (f.id === formula.id ? updatedFormula : f)),
      );
    } else {
      setFormulas([...formulas, updatedFormula]);
    }
  };

  const handleDelete = () => {
    if (!formulaToDelete) return;

    const formulaToRemove = formulas.find((f) => f.id === formulaToDelete);
    const updatedFormulas = formulas.filter((f) => f.id !== formulaToDelete);

    // If we're deleting the default formula, make another one default
    if (formulaToRemove?.isDefault && updatedFormulas.length > 0) {
      updatedFormulas[0].isDefault = true;
    }

    setFormulas(updatedFormulas);
    setDeleteDialogOpen(false);
    setFormulaToDelete(null);
  };

  const handleDuplicate = (formula: SalaryFormula) => {
    const newFormula = {
      ...formula,
      id: Date.now().toString(),
      name: `${formula.name} (نسخة)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFormulas([...formulas, newFormula]);
  };

  const columns: ColumnDef<SalaryFormula>[] = [
    {
      accessorKey: "name",
      header: "اسم الصيغة",
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.getValue("name")}</span>
          {row.original.isDefault && (
            <Badge className="mr-2 bg-green-100 text-green-800">افتراضي</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "الوصف",
    },
    {
      accessorKey: "formula",
      header: "الصيغة",
      cell: ({ row }) => (
        <code className="bg-muted p-1 rounded text-xs">
          {row.getValue("formula")}
        </code>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "آخر تحديث",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return date.toLocaleDateString("ar-EG");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const formula = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDuplicate(formula)}
              title="نسخ"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingFormula(formula);
                setEditorOpen(true);
              }}
              title="تعديل"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFormulaToDelete(formula.id);
                setDeleteDialogOpen(true);
              }}
              title="حذف"
              disabled={formulas.length <= 1} // Prevent deleting the last formula
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          صيغ حساب الرواتب
        </h1>
        <Button
          onClick={() => {
            setEditingFormula(null);
            setEditorOpen(true);
          }}
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة صيغة جديدة
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={formulas} searchKey="name" />
      </Card>

      <SalaryFormulaEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveFormula}
        initialFormula={editingFormula || undefined}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الصيغة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الصيغة بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
