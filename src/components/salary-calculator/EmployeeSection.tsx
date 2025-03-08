import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Edit2 } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position?: string;
  department?: string;
  base_salary: number;
  monthly_incentives?: number;
  join_date?: string;
  email?: string;
  status?: string;
}

import { useState } from "react";
import { EmployeeDialog } from "./employee-dialog";
import { useEmployees } from "@/lib/hooks/use-employees";

interface EmployeeSectionProps {
  selectedEmployee?: Employee;
  onEmployeeSelect?: (employeeId: string) => void;
}

const EmployeeSection = ({
  selectedEmployee,
  onEmployeeSelect = () => {},
}: EmployeeSectionProps) => {
  const { employees, loading, refetch } = useEmployees();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm">
      <div className="flex flex-col space-y-6">
        {/* Search and Add Employee Row */}
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="بحث عن موظف..."
                className="pl-10 text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingEmployee(null);
              setDialogOpen(true);
            }}
            className="mr-4 bg-primary hover:bg-primary/90"
          >
            <UserPlus className="ml-2 h-5 w-5" />
            إضافة موظف جديد
          </Button>
        </div>

        {/* Employee Selection */}
        <div className="w-full">
          <Select
            defaultValue={selectedEmployee?.id}
            onValueChange={onEmployeeSelect}
          >
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="اختر موظف" />
            </SelectTrigger>
            <SelectContent>
              {filteredEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Details Grid */}
        {selectedEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-right block">اسم الموظف</Label>
              <Input
                value={selectedEmployee.name}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">المنصب</Label>
              <Input
                value={selectedEmployee.position || ""}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">القسم</Label>
              <Input
                value={selectedEmployee.department || ""}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الراتب الأساسي</Label>
              <Input
                value={`${selectedEmployee.base_salary} ج.م`}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الحوافز الشهرية</Label>
              <Input
                value={`${selectedEmployee.monthly_incentives || 0} ج.م`}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">تاريخ الانضمام</Label>
              <Input
                value={selectedEmployee.join_date || ""}
                readOnly
                className="text-right"
              />
            </div>
          </div>
        )}

        {/* Edit Button */}
        {selectedEmployee && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setEditingEmployee(selectedEmployee);
                setDialogOpen(true);
              }}
            >
              <Edit2 className="ml-2 h-4 w-4" />
              تعديل البيانات
            </Button>
          </div>
        )}
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee || undefined}
        onSuccess={() => {
          setEditingEmployee(null);
          refetch();
        }}
      />
    </Card>
  );
};

export default EmployeeSection;
