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
import { Search, UserPlus } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  basicSalary: number;
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
  const { employees, loading } = useEmployees();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex flex-col space-y-6">
        {/* Search and Add Employee Row */}
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              <Select
                defaultValue={selectedEmployee?.id}
                onValueChange={onEmployeeSelect}
              >
                <SelectTrigger className="w-full pr-10 text-right">
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

        {/* Employee Details Grid */}
        {selectedEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                value={selectedEmployee.position}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">القسم</Label>
              <Input
                value={selectedEmployee.department}
                readOnly
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الراتب الأساسي</Label>
              <Input
                value={`${selectedEmployee.basicSalary} ج.م`}
                readOnly
                className="text-right"
              />
            </div>
          </div>
        )}
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee || undefined}
        onSuccess={() => {
          setEditingEmployee(null);
        }}
      />
    </Card>
  );
};

export default EmployeeSection;
