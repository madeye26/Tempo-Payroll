import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

const employeeSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  monthly_incentives: z.string().transform(Number).pipe(z.number().min(0)),
  position: z.string().optional(),
  department: z.string().optional(),
  base_salary: z.string().transform(Number).pipe(z.number().min(0)),
  join_date: z.string().min(1, "تاريخ الانضمام مطلوب"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: EmployeeFormData & { id?: string };
  onSuccess?: () => void;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || "",
      monthly_incentives: employee?.monthly_incentives?.toString() || "0",
      position: employee?.position || "",
      department: employee?.department || "",
      base_salary: employee?.base_salary?.toString() || "",
      join_date: employee?.join_date || new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Attempting to save employee data:", data);
      console.log("Supabase client available:", !!supabase);

      if (supabase) {
        if (employee?.id) {
          console.log("Updating existing employee with ID:", employee.id);
          const { data: result, error } = await supabase
            .from("employees")
            .update(data)
            .eq("id", employee.id)
            .select();

          if (error) {
            console.error("Error updating employee:", error);
            throw error;
          }

          console.log("Employee updated successfully:", result);
        } else {
          console.log("Inserting new employee");
          const { data: result, error } = await supabase
            .from("employees")
            .insert([data])
            .select();

          if (error) {
            console.error("Error inserting employee:", error);
            throw error;
          }

          console.log("Employee inserted successfully:", result);
        }
      } else {
        // Save to localStorage for persistence
        const savedEmployees = JSON.parse(
          localStorage.getItem("employees") || "[]",
        );
        const newEmployee = {
          ...data,
          id: employee?.id || Date.now().toString(),
          created_at: new Date().toISOString(),
          status: "active",
        };

        if (employee?.id) {
          // Update existing employee
          const updatedEmployees = savedEmployees.map((emp: any) =>
            emp.id === employee.id ? newEmployee : emp,
          );
          localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        } else {
          // Add new employee
          savedEmployees.push(newEmployee);
          localStorage.setItem("employees", JSON.stringify(savedEmployees));
        }

        console.log("Mock save (Supabase not available):", data);
      }

      onOpenChange(false);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Error saving employee:", error);
      form.setError("root", {
        type: "manual",
        message: `حدث خطأ أثناء حفظ بيانات الموظف: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        dir="rtl"
        aria-describedby="employee-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>
            {employee?.id ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
          </DialogTitle>
          <DialogDescription id="employee-dialog-description">
            {employee?.id
              ? "قم بتعديل بيانات الموظف"
              : "قم بإدخال بيانات الموظف الجديد"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>الاسم</Label>
            <Input {...form.register("name")} className="text-right" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>الحوافز الشهرية</Label>
            <Input
              {...form.register("monthly_incentives")}
              type="number"
              className="text-right"
              placeholder="0"
            />
            {form.formState.errors.monthly_incentives && (
              <p className="text-sm text-red-500">
                {form.formState.errors.monthly_incentives.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>المنصب</Label>
            <Input {...form.register("position")} className="text-right" />
            {form.formState.errors.position && (
              <p className="text-sm text-red-500">
                {form.formState.errors.position.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>القسم</Label>
            <Input {...form.register("department")} className="text-right" />
            {form.formState.errors.department && (
              <p className="text-sm text-red-500">
                {form.formState.errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>الراتب الأساسي</Label>
            <Input
              {...form.register("base_salary")}
              type="number"
              className="text-right"
            />
            {form.formState.errors.base_salary && (
              <p className="text-sm text-red-500">
                {form.formState.errors.base_salary.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>تاريخ الانضمام</Label>
            <Input
              {...form.register("join_date")}
              type="date"
              className="text-right"
            />
            {form.formState.errors.join_date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.join_date.message}
              </p>
            )}
          </div>

          {form.formState.errors.root && (
            <div className="mb-4">
              <ErrorMessage
                message={
                  form.formState.errors.root.message || "حدث خطأ غير متوقع"
                }
              />
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  جاري الحفظ...
                </>
              ) : employee?.id ? (
                "تحديث"
              ) : (
                "إضافة"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
