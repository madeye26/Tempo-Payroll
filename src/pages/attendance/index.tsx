import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEmployees } from "@/lib/hooks/use-employees";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AttendanceLog } from "@/components/attendance/attendance-log";

interface Absence {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: "sick" | "annual" | "unpaid" | "other";
  status: "approved" | "pending" | "rejected";
}

export default function AttendancePage() {
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"sick" | "annual" | "unpaid" | "other">(
    "annual",
  );

  const [absences, setAbsences] = useState<Absence[]>([]);

  // Fetch absences from localStorage or initialize with employee data
  useEffect(() => {
    const savedAbsences = localStorage.getItem("absences");
    if (savedAbsences) {
      setAbsences(JSON.parse(savedAbsences));
    } else if (employees.length > 0) {
      const initialAbsences = [];
      if (employees[0]) {
        initialAbsences.push({
          id: "1",
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          startDate: "2024-05-01",
          endDate: "2024-05-05",
          reason: "إجازة سنوية",
          type: "annual",
          status: "approved",
        });
      }
      if (employees[1]) {
        initialAbsences.push({
          id: "2",
          employeeId: employees[1].id,
          employeeName: employees[1].name,
          startDate: "2024-05-10",
          endDate: "2024-05-12",
          reason: "إجازة مرضية",
          type: "sick",
          status: "pending",
        });
      }
      setAbsences(initialAbsences);
      localStorage.setItem("absences", JSON.stringify(initialAbsences));
    }
  }, [employees]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<
    "approved" | "pending" | "rejected"
  >("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find((e) => e.id === selectedEmployee);
    if (!employee || !startDate || !endDate) return;

    const newAbsence: Absence = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: employee.name,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      reason,
      type,
      status: "pending",
    };

    const updatedAbsences = [...absences, newAbsence];
    setAbsences(updatedAbsences);
    localStorage.setItem("absences", JSON.stringify(updatedAbsences));

    setSelectedEmployee("");
    setStartDate(new Date());
    setEndDate(new Date());
    setReason("");
    setType("annual");
  };

  const handleUpdateStatus = () => {
    if (!editingAbsence) return;

    const updatedAbsences = absences.map((absence) =>
      absence.id === editingAbsence.id
        ? { ...absence, status: newStatus }
        : absence,
    );

    setAbsences(updatedAbsences);
    localStorage.setItem("absences", JSON.stringify(updatedAbsences));

    setEditDialogOpen(false);
    setEditingAbsence(null);
    setNewStatus("pending");
  };

  const handleDelete = () => {
    if (!absenceToDelete) return;

    const updatedAbsences = absences.filter(
      (absence) => absence.id !== absenceToDelete,
    );

    setAbsences(updatedAbsences);
    localStorage.setItem("absences", JSON.stringify(updatedAbsences));

    setDeleteDialogOpen(false);
    setAbsenceToDelete(null);
  };

  const columns: ColumnDef<Absence>[] = [
    {
      accessorKey: "employeeName",
      header: "اسم الموظف",
    },
    {
      accessorKey: "startDate",
      header: "تاريخ البداية",
    },
    {
      accessorKey: "endDate",
      header: "تاريخ النهاية",
    },
    {
      accessorKey: "type",
      header: "نوع الإجازة",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span>
            {type === "sick"
              ? "مرضية"
              : type === "annual"
                ? "سنوية"
                : type === "unpaid"
                  ? "غير مدفوعة"
                  : "أخرى"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${status === "approved" ? "bg-green-100 text-green-800" : status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {status === "approved"
              ? "موافق"
              : status === "rejected"
                ? "مرفوض"
                : "قيد الانتظار"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const absence = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingAbsence(absence);
                setNewStatus(absence.status);
                setEditDialogOpen(true);
              }}
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setAbsenceToDelete(absence.id);
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
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        إدارة الإجازات والغياب
      </h1>

      <Tabs defaultValue="absences" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="absences">الإجازات</TabsTrigger>
          <TabsTrigger value="attendance">سجل الحضور</TabsTrigger>
        </TabsList>

        <TabsContent value="absences" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">طلب إجازة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label>نوع الإجازة</Label>
                  <Select
                    value={type}
                    onValueChange={(
                      value: "sick" | "annual" | "unpaid" | "other",
                    ) => setType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">إجازة سنوية</SelectItem>
                      <SelectItem value="sick">إجازة مرضية</SelectItem>
                      <SelectItem value="unpaid">إجازة غير مدفوعة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>تاريخ البداية</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-right"}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>تاريخ النهاية</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-right"}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>سبب الإجازة</Label>
                  <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  <Plus className="ml-2 h-4 w-4" />
                  تقديم طلب الإجازة
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">طلبات الإجازات</h2>
            <DataTable
              columns={columns}
              data={absences}
              searchKey="employeeName"
            />
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6 mt-6">
          <AttendanceLog />
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تحديث حالة الإجازة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingAbsence && (
              <div className="mb-4">
                <p className="font-medium">
                  الموظف: {editingAbsence.employeeName}
                </p>
                <p className="text-sm text-muted-foreground">
                  من {editingAbsence.startDate} إلى {editingAbsence.endDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  السبب: {editingAbsence.reason}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={newStatus}
                onValueChange={(value: "approved" | "pending" | "rejected") =>
                  setNewStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="approved">موافق</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذه الإجازة؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف بيانات الإجازة بشكل
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
