import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

const employeeSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  position: z.string().min(2, "المنصب مطلوب"),
  department: z.string().min(2, "القسم مطلوب"),
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
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {
      name: "",
      email: "",
      position: "",
      department: "",
      base_salary: "",
      join_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (supabase) {
        if (employee?.id) {
          await supabase.from("employees").update(data).eq("id", employee.id);
        } else {
          await supabase.from("employees").insert([data]);
        }
      } else {
        console.log("Mock save:", data);
      }
      onOpenChange(false);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {employee?.id ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
          </DialogTitle>
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
            <Label>البريد الإلكتروني</Label>
            <Input
              {...form.register("email")}
              type="email"
              className="text-right"
              dir="ltr"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
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

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">{employee?.id ? "تحديث" : "إضافة"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
