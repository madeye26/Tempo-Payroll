import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeDialog } from "@/components/salary-calculator/employee-dialog";
import { useEmployees } from "@/lib/hooks/use-employees";
import { Edit, Trash2, UserPlus, Search, Award } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import { PerformanceEvaluation } from "@/components/salary-calculator/performance-evaluation";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  base_salary: number;
  join_date: string;
  status?: "active" | "inactive";
  rating?: number;
}

export default function EmployeesPage() {
  const { employees, loading, refetch } = useEmployees();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [employeeToEvaluate, setEmployeeToEvaluate] = useState<Employee | null>(
    null,
  );
  const [employeeRatings, setEmployeeRatings] = useState<
    Record<string, number>
  >({});

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      if (supabase) {
        await supabase.from("employees").delete().eq("id", employeeToDelete);
      } else {
        console.log("Mock delete employee:", employeeToDelete);
      }
      refetch();
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSaveEvaluation = (data: any) => {
    console.log("Saving evaluation:", data);
    // In a real app, this would save to the database
    setEmployeeRatings({
      ...employeeRatings,
      [data.employeeId]: data.overallRating,
    });
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "اسم الموظف",
    },
    {
      accessorKey: "position",
      header: "المنصب",
    },
    {
      accessorKey: "department",
      header: "القسم",
    },
    {
      accessorKey: "base_salary",
      header: "الراتب الأساسي",
      cell: ({ row }) => `${row.getValue("base_salary")} ج.م`,
    },
    {
      accessorKey: "join_date",
      header: "تاريخ الانضمام",
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        return (
          <Badge
            className={
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        );
      },
    },
    {
      id: "rating",
      header: "التقييم",
      cell: ({ row }) => {
        const employeeId = row.original.id;
        const rating = employeeRatings[employeeId] || 0;
        return rating > 0 ? (
          <div className="flex items-center">
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-yellow-500 ml-1">★</span>
          </div>
        ) : (
          <span className="text-muted-foreground">لا يوجد</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEmployeeToEvaluate(employee);
                setEvaluationDialogOpen(true);
              }}
              title="تقييم الأداء"
            >
              <Award className="h-4 w-4 text-yellow-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingEmployee(employee);
                setDialogOpen(true);
              }}
              title="تعديل"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEmployeeToDelete(employee.id);
                setDeleteDialogOpen(true);
              }}
              title="حذف"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          إدارة الموظفين
        </h1>
        <Button
          onClick={() => {
            setEditingEmployee(null);
            setDialogOpen(true);
          }}
        >
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة موظف جديد
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={employees} searchKey="name" />
      </Card>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee || undefined}
        onSuccess={() => {
          setEditingEmployee(null);
          refetch();
        }}
      />

      {employeeToEvaluate && (
        <PerformanceEvaluation
          open={evaluationDialogOpen}
          onOpenChange={setEvaluationDialogOpen}
          employeeId={employeeToEvaluate.id}
          employeeName={employeeToEvaluate.name}
          onSave={handleSaveEvaluation}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الموظف؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات الموظف بشكل
              دائم.
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
