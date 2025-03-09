import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableResponsive } from "@/components/ui/data-table-responsive";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, UserPlus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/use-auth";
import { logActivity } from "@/lib/activity-logger";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "accountant" | "viewer";
  created_at: string;
}

const userSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  role: z.enum(["admin", "manager", "accountant", "viewer"]),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      password: "",
    },
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;
          setUsers(data || []);
        } else {
          // Mock data
          const mockUsers = [
            {
              id: "1",
              name: "المدير",
              email: "admin@example.com",
              role: "admin",
              created_at: "2024-01-01T00:00:00.000Z",
            },
            {
              id: "2",
              name: "مدير الموارد البشرية",
              email: "manager@example.com",
              role: "manager",
              created_at: "2024-01-02T00:00:00.000Z",
            },
            {
              id: "3",
              name: "المحاسب",
              email: "accountant@example.com",
              role: "accountant",
              created_at: "2024-01-03T00:00:00.000Z",
            },
            {
              id: "4",
              name: "مستخدم عادي",
              email: "viewer@example.com",
              role: "viewer",
              created_at: "2024-01-04T00:00:00.000Z",
            },
          ];
          setUsers(mockUsers as User[]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("password", ""); // Don't set password when editing
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    reset();
    setDialogOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      if (supabase) {
        if (editingUser) {
          // Update existing user
          const updateData = {
            name: data.name,
            role: data.role,
          };

          const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", editingUser.id);

          if (error) throw error;

          // Update password if provided
          if (data.password) {
            // In a real app, you would use Supabase Auth Admin API to update password
            console.log("Would update password for user", editingUser.id);
          }

          logActivity(
            "setting",
            "update",
            `تم تحديث بيانات المستخدم ${data.name}`,
            currentUser.id,
            { userId: editingUser.id },
          );

          toast({
            title: "تم التحديث بنجاح",
            description: "تم تحديث بيانات المستخدم بنجاح",
          });
        } else {
          // Use mock implementation instead of Supabase Auth API
          console.log("Creating user with mock implementation");
          const newUserId = Date.now().toString();
          const mockAuthData = {
            user: {
              id: newUserId,
              email: data.email,
            },
          };
          const authData = mockAuthData;
          const authError = null;

          // Also add to mock auth users
          const mockAuthUsers = JSON.parse(
            localStorage.getItem("mock_auth_users") || "[]",
          );
          mockAuthUsers.push({
            id: newUserId,
            email: data.email,
            password: data.password,
            role: data.role,
            name: data.name,
          });
          localStorage.setItem(
            "mock_auth_users",
            JSON.stringify(mockAuthUsers),
          );

          if (authError) throw authError;

          if (authData.user) {
            const { error } = await supabase.from("users").insert([
              {
                id: authData.user.id,
                name: data.name,
                email: data.email,
                role: data.role,
              },
            ]);

            if (error) throw error;

            logActivity(
              "setting",
              "create",
              `تم إنشاء مستخدم جديد ${data.name}`,
              currentUser.id,
            );

            toast({
              title: "تم الإنشاء بنجاح",
              description: "تم إنشاء المستخدم الجديد بنجاح",
            });
          }
        }
      } else {
        // Mock implementation
        if (editingUser) {
          // Update existing user
          const updatedUsers = users.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: data.name, role: data.role }
              : u,
          );
          setUsers(updatedUsers);
          localStorage.setItem("users", JSON.stringify(updatedUsers));

          logActivity(
            "setting",
            "update",
            `تم تحديث بيانات المستخدم ${data.name}`,
            currentUser.id,
            { userId: editingUser.id },
          );

          toast({
            title: "تم التحديث بنجاح",
            description: "تم تحديث بيانات المستخدم بنجاح",
          });
        } else {
          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            role: data.role,
            created_at: new Date().toISOString(),
          };
          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          localStorage.setItem("users", JSON.stringify(updatedUsers));

          // Also add to mock auth users
          const mockAuthUsers = JSON.parse(
            localStorage.getItem("mock_auth_users") || "[]",
          );
          mockAuthUsers.push({
            id: newUser.id,
            email: data.email,
            password: data.password,
            role: data.role,
            name: data.name,
          });
          localStorage.setItem(
            "mock_auth_users",
            JSON.stringify(mockAuthUsers),
          );

          logActivity(
            "setting",
            "create",
            `تم إنشاء مستخدم جديد ${data.name}`,
            currentUser.id,
          );

          toast({
            title: "تم الإنشاء بنجاح",
            description: "تم إنشاء المستخدم الجديد بنجاح",
          });
        }
      }

      setDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حفظ المستخدم: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete || !currentUser) return;

    try {
      if (supabase) {
        // Delete user from database
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userToDelete);

        if (error) throw error;

        // In a real app, you would also delete the user from Supabase Auth
        // using the Admin API
      } else {
        // Mock implementation
        const updatedUsers = users.filter((u) => u.id !== userToDelete);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }

      const userToDeleteName =
        users.find((u) => u.id === userToDelete)?.name || "";
      logActivity(
        "setting",
        "delete",
        `تم حذف المستخدم ${userToDeleteName}`,
        currentUser.id,
        { userId: userToDelete },
      );

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المستخدم بنجاح",
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حذف المستخدم: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "الاسم",
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
    },
    {
      accessorKey: "role",
      header: "الدور",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        let badgeClass = "";
        let roleLabel = "";

        switch (role) {
          case "admin":
            badgeClass = "bg-red-100 text-red-800";
            roleLabel = "مدير النظام";
            break;
          case "manager":
            badgeClass = "bg-blue-100 text-blue-800";
            roleLabel = "مدير";
            break;
          case "accountant":
            badgeClass = "bg-green-100 text-green-800";
            roleLabel = "محاسب";
            break;
          case "viewer":
            badgeClass = "bg-gray-100 text-gray-800";
            roleLabel = "مستخدم عادي";
            break;
        }

        return <Badge className={badgeClass}>{roleLabel}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "تاريخ الإنشاء",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleDateString("ar-EG");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = currentUser?.id === user.id;
        const isAdmin = currentUser?.role === "admin";

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditUser(user)}
              disabled={!isAdmin && !isCurrentUser}
            >
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setUserToDelete(user.id);
                setDeleteDialogOpen(true);
              }}
              disabled={!isAdmin || isCurrentUser}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  if (!hasPermission("manage_users")) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">غير مصرح</h1>
        <p className="mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        <Button onClick={() => window.history.back()}>العودة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          إدارة المستخدمين
        </h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        ) : (
          <DataTableResponsive
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="بحث عن مستخدم..."
          />
        )}
      </Card>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "قم بتعديل بيانات المستخدم"
                : "قم بإدخال بيانات المستخدم الجديد"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input {...register("name")} className="text-right" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input
                {...register("email")}
                className="text-right"
                disabled={!!editingUser}
                dir="ltr"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>الدور</Label>
              <Select
                defaultValue={editingUser?.role || "viewer"}
                onValueChange={(value) => setValue("role", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير النظام</SelectItem>
                  <SelectItem value="manager">مدير</SelectItem>
                  <SelectItem value="accountant">محاسب</SelectItem>
                  <SelectItem value="viewer">مستخدم عادي</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                {editingUser ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
              </Label>
              <Input
                {...register("password")}
                type="password"
                className="text-right"
                dir="ltr"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
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
                ) : editingUser ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا المستخدم؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم وجميع بياناته
              بشكل دائم.
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
