import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEmployees } from "@/lib/hooks/use-employees";
import { Clock, Edit, Trash2, Check, X } from "lucide-react";
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
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/lib/supabase";

interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: "present" | "absent" | "leave" | "late";
  notes: string | null;
}

export function AttendanceLog() {
  const { employees, loading } = useEmployees();
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Form state for editing
  const [formState, setFormState] = useState({
    employee_id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    check_in: "",
    check_out: "",
    status: "present" as "present" | "absent" | "leave" | "late",
    notes: "",
  });

  // Fetch attendance records
  const fetchAttendanceRecords = async () => {
    setLoadingRecords(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("attendance")
          .select(
            `
            id,
            employee_id,
            date,
            check_in,
            check_out,
            status,
            notes,
            employees(name)
          `,
          )
          .eq("date", selectedDate);

        if (error) {
          console.error("Error fetching attendance records:", error);
          return;
        }

        // Transform data to include employee name
        const formattedData = data.map((record) => ({
          id: record.id,
          employee_id: record.employee_id,
          employee_name: record.employees?.name || "Unknown",
          date: record.date,
          check_in: record.check_in,
          check_out: record.check_out,
          status: record.status,
          notes: record.notes,
        }));

        setAttendanceRecords(formattedData);
      } else {
        // Mock data if no supabase connection
        console.log("Using mock attendance data");
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Error in fetchAttendanceRecords:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status change
  const handleStatusChange = (
    value: "present" | "absent" | "leave" | "late",
  ) => {
    setFormState((prev) => ({ ...prev, status: value }));
  };

  // Handle employee selection
  const handleEmployeeChange = (value: string) => {
    setFormState((prev) => ({ ...prev, employee_id: value }));
  };

  // Save attendance record
  const handleSaveRecord = async () => {
    try {
      if (!supabase) {
        console.log("Mock save attendance record:", formState);
        setEditDialogOpen(false);
        return;
      }

      const recordData = {
        employee_id: formState.employee_id,
        date: formState.date,
        check_in: formState.check_in || null,
        check_out: formState.check_out || null,
        status: formState.status,
        notes: formState.notes || null,
      };

      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from("attendance")
          .update(recordData)
          .eq("id", editingRecord.id);

        if (error) {
          console.error("Error updating attendance record:", error);
          alert(`Error updating record: ${error.message}`);
          return;
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from("attendance")
          .insert([recordData]);

        if (error) {
          console.error("Error creating attendance record:", error);
          alert(`Error creating record: ${error.message}`);
          return;
        }
      }

      // Refresh data
      fetchAttendanceRecords();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error in handleSaveRecord:", error);
      alert(
        `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Delete attendance record
  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;

    try {
      if (supabase) {
        const { error } = await supabase
          .from("attendance")
          .delete()
          .eq("id", recordToDelete);

        if (error) {
          console.error("Error deleting attendance record:", error);
          alert(`Error deleting record: ${error.message}`);
          return;
        }
      } else {
        console.log("Mock delete attendance record:", recordToDelete);
      }

      // Refresh data
      fetchAttendanceRecords();
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error("Error in handleDeleteRecord:", error);
      alert(
        `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Open edit dialog for new record
  const handleAddRecord = () => {
    setFormState({
      employee_id: "",
      date: selectedDate,
      check_in: "",
      check_out: "",
      status: "present",
      notes: "",
    });
    setEditingRecord(null);
    setEditDialogOpen(true);
  };

  // Open edit dialog for existing record
  const handleEditRecord = (record: AttendanceRecord) => {
    setFormState({
      employee_id: record.employee_id,
      date: record.date,
      check_in: record.check_in || "",
      check_out: record.check_out || "",
      status: record.status,
      notes: record.notes || "",
    });
    setEditingRecord(record);
    setEditDialogOpen(true);
  };

  // Table columns
  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "employee_name",
      header: "اسم الموظف",
    },
    {
      accessorKey: "date",
      header: "التاريخ",
    },
    {
      accessorKey: "check_in",
      header: "وقت الحضور",
      cell: ({ row }) => row.getValue("check_in") || "--",
    },
    {
      accessorKey: "check_out",
      header: "وقت الانصراف",
      cell: ({ row }) => row.getValue("check_out") || "--",
    },
    {
      id: "delay_hours",
      header: "ساعات التأخير",
      cell: ({ row }) => {
        const checkIn = row.getValue("check_in") as string | null;
        if (!checkIn) return "--";

        // Standard work start time (8:00 AM)
        const standardStartTime = new Date();
        standardStartTime.setHours(8, 0, 0, 0);

        // Parse check-in time
        const [hours, minutes] = checkIn.split(":").map(Number);
        const actualCheckIn = new Date();
        actualCheckIn.setHours(hours, minutes, 0, 0);

        // Calculate delay in minutes
        if (actualCheckIn <= standardStartTime) return "0";

        const delayMinutes = Math.floor(
          (actualCheckIn.getTime() - standardStartTime.getTime()) / (1000 * 60),
        );
        const delayHours = (delayMinutes / 60).toFixed(2);
        return delayHours;
      },
    },
    {
      id: "overtime_hours",
      header: "ساعات إضافية",
      cell: ({ row }) => {
        const checkIn = row.getValue("check_in") as string | null;
        const checkOut = row.getValue("check_out") as string | null;

        if (!checkIn || !checkOut) return "--";

        // Standard work hours (11 hours)
        const standardWorkHours = 11;

        // Parse check-in and check-out times
        const [inHours, inMinutes] = checkIn.split(":").map(Number);
        const [outHours, outMinutes] = checkOut.split(":").map(Number);

        const checkInTime = new Date();
        checkInTime.setHours(inHours, inMinutes, 0, 0);

        const checkOutTime = new Date();
        checkOutTime.setHours(outHours, outMinutes, 0, 0);

        // Calculate total work hours
        const totalMinutes = Math.floor(
          (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60),
        );
        const totalHours = totalMinutes / 60;

        // Calculate overtime
        if (totalHours <= standardWorkHours) return "0";

        const overtimeHours = (totalHours - standardWorkHours).toFixed(2);
        return overtimeHours;
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${status === "present" ? "bg-green-100 text-green-800" : status === "absent" ? "bg-red-100 text-red-800" : status === "leave" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {status === "present"
              ? "حاضر"
              : status === "absent"
                ? "غائب"
                : status === "leave"
                  ? "إجازة"
                  : "متأخر"}
          </span>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "ملاحظات",
      cell: ({ row }) => row.getValue("notes") || "--",
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditRecord(record)}
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setRecordToDelete(record.id);
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

  if (loading || loadingRecords) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={handleAddRecord}>
          <Clock className="ml-2 h-4 w-4" />
          تسجيل حضور جديد
        </Button>
        <div className="flex items-center gap-4">
          <Label>التاريخ:</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-auto"
          />
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">سجل الحضور والانصراف</h2>
        {attendanceRecords.length > 0 ? (
          <DataTable
            columns={columns}
            data={attendanceRecords}
            searchKey="employee_name"
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد سجلات حضور لهذا اليوم
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "تعديل سجل الحضور" : "تسجيل حضور جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>الموظف</Label>
              <Select
                value={formState.employee_id}
                onValueChange={handleEmployeeChange}
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
              <Label>التاريخ</Label>
              <Input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>وقت الحضور</Label>
                <Input
                  type="time"
                  name="check_in"
                  value={formState.check_in}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>وقت الانصراف</Label>
                <Input
                  type="time"
                  name="check_out"
                  value={formState.check_out}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={formState.status}
                onValueChange={(
                  value: "present" | "absent" | "leave" | "late",
                ) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">حاضر</SelectItem>
                  <SelectItem value="absent">غائب</SelectItem>
                  <SelectItem value="leave">إجازة</SelectItem>
                  <SelectItem value="late">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Input
                name="notes"
                value={formState.notes}
                onChange={handleInputChange}
                placeholder="أي ملاحظات إضافية"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveRecord}>
              {editingRecord ? "تحديث" : "تسجيل"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا السجل؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف سجل الحضور بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecord}
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
