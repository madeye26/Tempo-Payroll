import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useState } from "react";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Advance {
  id: string;
  employeeName: string;
  amount: number;
  reason: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

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
    accessorKey: "reason",
    header: "السبب",
  },
  {
    accessorKey: "date",
    header: "التاريخ",
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
            ? "تمت الموافقة"
            : status === "rejected"
              ? "مرفوض"
              : "قيد الانتظار"}
        </span>
      );
    },
  },
];

export function AdvancesTab() {
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement advance submission
    console.log({ selectedEmployee, amount, reason });
  };

  const [advances] = useState<Advance[]>([
    {
      id: "1",
      employeeName: "أحمد محمد",
      amount: 1000,
      reason: "مصاريف طبية",
      date: "2024-02-18",
      status: "approved",
    },
    {
      id: "2",
      employeeName: "فاطمة علي",
      amount: 500,
      reason: "مصاريف دراسية",
      date: "2024-02-17",
      status: "pending",
    },
  ]);

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-right">تسجيل سلفة جديدة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-right block">الموظف</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="text-right">
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
          <Label className="text-right block">قيمة السلفة</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-right"
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-right block">السبب</Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-right"
            placeholder="سبب السلفة"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">تسجيل السلفة</Button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-right mb-4">السلف السابقة</h3>
        <DataTable columns={columns} data={advances} searchKey="employeeName" />
      </div>
    </Card>
  );
}
