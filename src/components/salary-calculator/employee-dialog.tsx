import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { useAuth } from "@/lib/hooks/use-auth";

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
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

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

  // Update form values when employee prop changes or dialog opens
  useEffect(() => {
    if (employee && open) {
      console.log("Setting form values for employee:", employee);
      form.reset({
        name: employee.name || "",
        monthly_incentives: employee.monthly_incentives?.toString() || "0",
        position: employee.position || "",
        department: employee.department || "",
        base_salary: employee.base_salary?.toString() || "",
        join_date: employee.join_date || new Date().toISOString().split("T")[0],
      });
    } else if (!employee && open) {
      // Reset form when adding a new employee
      form.reset({
        name: "",
        monthly_incentives: "0",
        position: "",
        department: "",
        base_salary: "",
        join_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [employee, form, open]);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Attempting to save employee data:", data);
      console.log("Supabase client available:", !!supabase);

      // Prepare the employee data
      const employeeData = {
        name: data.name,
        monthly_incentives: parseFloat(data.monthly_incentives),
        position: data.position,
        department: data.department,
        base_salary: parseFloat(data.base_salary),
        join_date: data.join_date,
        status: "active",
      };

      let savedEmployee;

      if (supabase) {
        try {
          if (employee?.id) {
            console.log("Updating existing employee with ID:", employee.id);
            const { data: result, error } = await supabase
              .from("employees")
              .update(employeeData)
              .eq("id", employee.id)
              .select();

            if (error) {
              console.error("Error updating employee:", error);
              throw error;
            }

            savedEmployee = result?.[0] || null;
            console.log("Employee updated successfully:", result);

            // Log activity
            if (currentUser) {
              logActivity(
                "employee",
                "update",
                `تم تحديث بيانات الموظف ${data.name}`,
                currentUser.id,
                { employeeId: employee.id },
              );
            }

            toast({
              title: "تم التحديث بنجاح",
              description: "تم تحديث بيانات الموظف بنجاح",
            });
          } else {
            console.log("Inserting new employee");
            const { data: result, error } = await supabase
              .from("employees")
              .insert([employeeData])
              .select();

            if (error) {
              console.error("Error inserting employee:", error);
              throw error;
            }

            savedEmployee = result?.[0] || null;
            console.log("Employee inserted successfully:", result);

            // Log activity
            if (currentUser && savedEmployee) {
              logActivity(
                "employee",
                "create",
                `تم إضافة موظف جديد ${data.name}`,
                currentUser.id,
                { employeeId: savedEmployee.id },
              );
            }

            toast({
              title: "تمت الإضافة بنجاح",
              description: "تم إضافة الموظف الجديد بنجاح",
            });
          }
        } catch (supabaseError) {
          console.error(
            "Supabase operation failed, falling back to localStorage:",
            supabaseError,
          );
          // Fall back to localStorage if Supabase operation fails
          savedEmployee = await saveToLocalStorage();
        }
      } else {
        // Save to localStorage for persistence
        savedEmployee = await saveToLocalStorage();
      }

      async function saveToLocalStorage() {
        const savedEmployees = JSON.parse(
          localStorage.getItem("employees") || "[]",
        );
        const newEmployee = {
          ...employeeData,
          id: employee?.id || Date.now().toString(),
          created_at: new Date().toISOString(),
        };

        if (employee?.id) {
          // Update existing employee
          const updatedEmployees = savedEmployees.map((emp: any) =>
            emp.id === employee.id ? { ...emp, ...employeeData } : emp,
          );
          localStorage.setItem("employees", JSON.stringify(updatedEmployees));

          // Log activity
          if (currentUser) {
            logActivity(
              "employee",
              "update",
              `تم تحديث بيانات الموظف ${data.name}`,
              currentUser.id,
              { employeeId: employee.id },
            );
          }

          toast({
            title: "تم التحديث بنجاح",
            description: "تم تحديث بيانات الموظف بنجاح",
          });
        } else {
          // Add new employee
          savedEmployees.push(newEmployee);
          localStorage.setItem("employees", JSON.stringify(savedEmployees));

          // Log activity
          if (currentUser) {
            logActivity(
              "employee",
              "create",
              `تم إضافة موظف جديد ${data.name}`,
              currentUser.id,
              { employeeId: newEmployee.id },
            );
          }

          toast({
            title: "تمت الإضافة بنجاح",
            description: "تم إضافة الموظف الجديد بنجاح",
          });
        }

        return newEmployee;
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

      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حفظ بيانات الموظف: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
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
