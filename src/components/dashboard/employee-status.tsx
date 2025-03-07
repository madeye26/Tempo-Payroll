import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeStatusProps {
  employees: {
    id: string;
    name: string;
    position: string;
    status: "present" | "absent" | "leave" | "late";
    avatar?: string;
  }[];
}

export function EmployeeStatus({ employees }: EmployeeStatusProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">حاضر</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">غائب</Badge>;
      case "leave":
        return <Badge className="bg-blue-100 text-blue-800">إجازة</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">متأخر</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-right">
        حالة الموظفين اليوم
      </h3>
      <div className="space-y-4">
        {employees.map((employee) => (
          <div key={employee.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-right">{employee.name}</p>
                <p className="text-sm text-muted-foreground text-right">
                  {employee.position}
                </p>
              </div>
            </div>
            {getStatusBadge(employee.status)}
          </div>
        ))}
      </div>
    </Card>
  );
}
