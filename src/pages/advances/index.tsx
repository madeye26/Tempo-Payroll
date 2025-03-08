import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEmployees } from "@/lib/hooks/use-employees";
import { Edit, Trash2, Plus, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface Advance {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  requestDate: string;
  expectedRepaymentDate: string;
  actualRepaymentDate?: string;
  status: "pending" | "paid" | "delayed";
  remainingAmount?: number;
}

export default function AdvancesPage() {
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amount, setAmount] = useState("");
  const [expectedRepaymentDate, setExpectedRepaymentDate] = useState("");

  const [advances, setAdvances] = useState<Advance[]>([]);

  // Fetch advances from localStorage or initialize with employee data
  useEffect(() => {
    const savedAdvances = localStorage.getItem("advances");
    if (savedAdvances) {
      setAdvances(JSON.parse(savedAdvances));
    } else if (employees.length > 0) {
      const initialAdvances = [];
      if (employees[0]) {
        initialAdvances.push({
          id: "1",
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          amount: 1000,
          requestDate: "2024-05-01",
          expectedRepaymentDate: "2024-06-01",
          status: "pending",
          remainingAmount: 1000,
        });

        initialAdvances.push({
          id: "3",
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          amount: 800,
          requestDate: "2024-05-10",
          expectedRepaymentDate: "2024-06-10",
          status: "pending",
          remainingAmount: 800,
        });
      }

      if (employees[1]) {
        initialAdvances.push({
          id: "2",
          employeeId: employees[1].id,
          employeeName: employees[1].name,
          amount: 500,
          requestDate: "2024-04-15",
          expectedRepaymentDate: "2024-05-15",
          status: "paid",
          actualRepaymentDate: "2024-05-15",
          remainingAmount: 0,
        });
      }

      setAdvances(initialAdvances);
      localStorage.setItem("advances", JSON.stringify(initialAdvances));
    }
  }, [employees]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [advanceToDelete, setAdvanceToDelete] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<"pending" | "paid" | "delayed">(
    "pending",
  );
  const [actualRepaymentDate, setActualRepaymentDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find((e) => e.id === selectedEmployee);
    if (!employee) return;

    const newAdvance: Advance = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: employee.name,
      amount: parseFloat(amount),
      requestDate: new Date().toISOString().split("T")[0],
      expectedRepaymentDate,
      status: "pending",
    };

    const updatedAdvances = [...advances, newAdvance];
    setAdvances(updatedAdvances);
    localStorage.setItem("advances", JSON.stringify(updatedAdvances));

    setSelectedEmployee("");
    setAmount("");
    setExpectedRepaymentDate("");
  };

  const handleUpdateStatus = () => {
    if (!editingAdvance) return;

    const updatedAdvances = advances.map((advance) => {
      if (advance.id === editingAdvance.id) {
        // If marking as paid, update the status and record payment date
        return {
          ...advance,
          status: newStatus,
          actualRepaymentDate:
            newStatus === "paid"
              ? actualRepaymentDate
              : advance.actualRepaymentDate,
        };
      }
      return advance;
    });

    setAdvances(updatedAdvances);
    localStorage.setItem("advances", JSON.stringify(updatedAdvances));

    setEditDialogOpen(false);
    setEditingAdvance(null);
    setNewStatus("pending");
    setActualRepaymentDate("");
  };

  const handleDelete = () => {
    if (!advanceToDelete) return;

    const updatedAdvances = advances.filter(
      (advance) => advance.id !== advanceToDelete,
    );

    setAdvances(updatedAdvances);
    localStorage.setItem("advances", JSON.stringify(updatedAdvances));

    setDeleteDialogOpen(false);
    setAdvanceToDelete(null);
  };

  const columns: ColumnDef<Advance>[] = [
    {
      accessorKey: "employeeName",
      header: "اسم الموظف",
    },
    {
      accessorKey: "amount",
      header: "المبلغ",
      cell: ({ row }) => `${row.getValue("amount")} ج.م`,
    },
    {
      accessorKey: "requestDate",
      header: "تاريخ الطلب",
    },
    {
      accessorKey: "expectedRepaymentDate",
      header: "تاريخ السداد المتوقع",
    },
    {
      id: "remainingAmount",
      header: "المبلغ المتبقي",
      cell: ({ row }) => {
        const advance = row.original;
        const remainingAmount =
          advance.remainingAmount !== undefined
            ? advance.remainingAmount
            : advance.status === "paid"
              ? 0
              : advance.amount;
        return `${remainingAmount} ج.م`;
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${status === "paid" ? "bg-green-100 text-green-800" : status === "delayed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {status === "paid"
              ? "مدفوعة"
              : status === "delayed"
                ? "مؤجلة"
                : "قيد الانتظار"}
          </span>
        );
      },
    },
    {
      id: "actualRepaymentDate",
      header: "تاريخ السداد الفعلي",
      cell: ({ row }) => {
        const advance = row.original;
        return advance.actualRepaymentDate || "--";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const advance = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingAdvance(advance);
                setNewStatus(advance.status);
                setEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setAdvanceToDelete(advance.id);
                setDeleteDialogOpen(true);
              }}
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
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        إدارة السلف
      </h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">إضافة سلفة جديدة</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الموظف</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر موظف" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>مبلغ السلفة</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label>تاريخ السداد المتوقع</Label>
              <Input
                type="date"
                value={expectedRepaymentDate}
                onChange={(e) => setExpectedRepaymentDate(e.target.value)}
                className="text-right"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Plus className="ml-2 h-4 w-4" />
              إضافة السلفة
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">السلف الحالية</h2>
        <DataTable columns={columns} data={advances} searchKey="employeeName" />
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تحديث حالة السلفة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={newStatus}
                onValueChange={(value: "pending" | "paid" | "delayed") =>
                  setNewStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="paid">مدفوعة</SelectItem>
                  <SelectItem value="delayed">مؤجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStatus === "paid" && (
              <div className="space-y-2">
                <Label>تاريخ السداد الفعلي</Label>
                <Input
                  type="date"
                  value={actualRepaymentDate}
                  onChange={(e) => setActualRepaymentDate(e.target.value)}
                  className="text-right"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleUpdateStatus}>تحديث</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه السلفة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف بيانات السلفة بشكل دائم.
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
