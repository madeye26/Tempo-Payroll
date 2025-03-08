import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, FileText } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  baseSalary: number;
  monthlyIncentives: number;
  bonus: number;
  overtimeHours: number;
  overtimeValue: number;
  purchases: number;
  advances: number;
  absences: number;
  hourlyDeductions: number;
  penaltyDays: number;
  penalties: number;
  netSalary: number;
  date: string;
}

export default function SalaryHistory() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load salaries from localStorage
  useEffect(() => {
    const savedSalaries = localStorage.getItem("salaries");
    if (savedSalaries) {
      setSalaries(JSON.parse(savedSalaries));
    }
  }, []);

  const handleDelete = () => {
    if (!salaryToDelete) return;

    const updatedSalaries = salaries.filter(
      (salary) =>
        salary.date &&
        new Date(salary.date).getTime().toString() !== salaryToDelete,
    );

    setSalaries(updatedSalaries);
    localStorage.setItem("salaries", JSON.stringify(updatedSalaries));
    setDeleteDialogOpen(false);
    setSalaryToDelete(null);
  };

  const handleEdit = (salaryId: string) => {
    // Navigate to the salary calculator with the salary ID to edit
    navigate(`/salaries?edit=${salaryId}`);
  };

  const columns: ColumnDef<SalaryRecord>[] = [
    {
      accessorKey: "employeeName",
      header: "اسم الموظف",
    },
    {
      accessorKey: "month",
      header: "الشهر",
    },
    {
      accessorKey: "year",
      header: "السنة",
    },
    {
      accessorKey: "baseSalary",
      header: "الراتب الأساسي",
      cell: ({ row }) => `${row.getValue("baseSalary")} ج.م`,
    },
    {
      accessorKey: "netSalary",
      header: "صافي الراتب",
      cell: ({ row }) => `${row.getValue("netSalary")} ج.م`,
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const salary = row.original;
        const salaryId = salary.date
          ? new Date(salary.date).getTime().toString()
          : "";
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(salaryId)}
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setSalaryToDelete(salaryId);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">سجل الرواتب</h1>
        <Button variant="outline" onClick={() => navigate("/salaries")}>
          <FileText className="ml-2 h-4 w-4" />
          حساب راتب جديد
        </Button>
      </div>

      <Card className="p-6">
        {salaries.length > 0 ? (
          <DataTable
            columns={columns}
            data={salaries}
            searchKey="employeeName"
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد رواتب محفوظة بعد
          </div>
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الراتب؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف بيانات الراتب بشكل دائم.
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
