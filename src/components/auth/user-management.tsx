import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Trash2,
  UserPlus,
  Search,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/auth-service";
import { useAuth } from "@/lib/hooks/use-auth";
import { logActivity } from "@/lib/activity-logger";
import { Switch } from "@/components/ui/switch";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "accountant" | "viewer";
  created_at: string;
  is_active?: boolean;
  last_login?: string;
  login_count?: number;
  avatar?: string;
  permissions?: string[];
}

const userSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  role: z.enum(["admin", "manager", "accountant", "viewer"]),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().optional(),
  avatar: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserManagement() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      password: "",
      is_active: true,
      avatar: "",
      permissions: [],
    },
  });

  // Fetch users function
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await authService.getUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        console.error("Error fetching users:", result.message);
        toast({
          title: "خطأ",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("password", ""); // Don't set password when editing
    setValue("is_active", user.is_active !== false); // Default to true if undefined
    setValue("avatar", user.avatar || "");
    setValue("permissions", user.permissions || []);
    setDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    reset({
      name: "",
      email: "",
      role: "viewer",
      password: "",
      is_active: true,
      avatar: "",
      permissions: [],
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      let result;

      if (editingUser) {
        // Update existing user
        result = await authService.updateUser(editingUser.id, {
          name: data.name,
          role: data.role,
          password: data.password || undefined,
          is_active: data.is_active,
          avatar: data.avatar,
          permissions: data.permissions,
        });

        if (result.success) {
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
        }
      } else {
        // Create new user
        result = await authService.createUser({
          email: data.email,
          password: data.password || "password123", // Default password if not provided
          name: data.name,
          role: data.role,
          is_active: data.is_active,
          avatar: data.avatar,
          permissions: data.permissions,
        });

        if (result.success) {
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

      if (result.success) {
        // Refresh the users list
        fetchUsers();
        setDialogOpen(false);
        reset();
      } else {
        toast({
          title: "خطأ",
          description: result.message,
          variant: "destructive",
        });
      }
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
      const userToDeleteName =
        users.find((u) => u.id === userToDelete)?.name || "";

      const result = await authService.deleteUser(userToDelete);

      if (result.success) {
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

        // Refresh the users list
        fetchUsers();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } else {
        toast({
          title: "خطأ",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء حذف المستخدم: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    if (!currentUser) return;

    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const result = await authService.updateUser(userId, {
        is_active: !currentStatus,
      });

      if (result.success) {
        logActivity(
          "setting",
          "update",
          `تم ${currentStatus ? "تعطيل" : "تفعيل"} المستخدم ${user.name}`,
          currentUser.id,
          { userId },
        );

        toast({
          title: "تم التحديث بنجاح",
          description: `تم ${currentStatus ? "تعطيل" : "تفعيل"} المستخدم بنجاح`,
        });

        // Refresh the users list
        fetchUsers();
      } else {
        toast({
          title: "خطأ",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء تحديث حالة المستخدم: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "الاسم",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                }
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span>{user.name}</span>
          </div>
        );
      },
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
      accessorKey: "is_active",
      header: "الحالة",
      cell: ({ row }) => {
        const isActive = row.original.is_active !== false; // Default to true if undefined
        return (
          <Badge
            className={
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {isActive ? "نشط" : "معطل"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "last_login",
      header: "آخر تسجيل دخول",
      cell: ({ row }) => {
        const lastLogin = row.original.last_login;
        if (!lastLogin) return "لم يسجل الدخول بعد";

        const date = new Date(lastLogin);
        return (
          date.toLocaleDateString("ar-EG") +
          " " +
          date.toLocaleTimeString("ar-EG")
        );
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
      header: "الإجراءات",
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = currentUser?.id === user.id;
        const isAdmin = currentUser?.role === "admin";
        const isActive = user.is_active !== false; // Default to true if undefined

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleUserStatus(user.id, isActive)}
              disabled={!isAdmin || isCurrentUser}
              title={isActive ? "تعطيل المستخدم" : "تفعيل المستخدم"}
            >
              {isActive ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditUser(user)}
              disabled={!isAdmin && !isCurrentUser}
              title="تعديل المستخدم"
            >
              <Edit className="h-4 w-4" />
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
              title="حذف المستخدم"
            >
              <Trash2 className="h-4 w-4" />
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block mb-2">
            إدارة المستخدمين
          </h2>
          <p className="text-muted-foreground">
            إضافة وتعديل وحذف المستخدمين وإدارة الصلاحيات
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="shadow-sm hover:shadow-md transition-all duration-300"
        >
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن مستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 pr-9"
          />
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredUsers} searchKey="name" />
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

            <div className="space-y-2">
              <Label>صورة المستخدم (URL)</Label>
              <Input
                {...register("avatar")}
                placeholder="https://example.com/avatar.jpg"
                className="text-right"
                dir="ltr"
              />
              <div className="flex justify-center mt-2">
                <div className="h-16 w-16 rounded-full overflow-hidden border">
                  <img
                    src={
                      watch("avatar") ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${watch("name")}`
                    }
                    alt="صورة المستخدم"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>الصلاحيات</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                {[
                  { id: "view_dashboard", label: "عرض لوحة التحكم" },
                  { id: "manage_employees", label: "إدارة الموظفين" },
                  { id: "manage_salaries", label: "إدارة الرواتب" },
                  { id: "manage_advances", label: "إدارة السلف" },
                  { id: "manage_attendance", label: "إدارة الحضور" },
                  { id: "view_reports", label: "عرض التقارير" },
                  { id: "export_data", label: "تصدير البيانات" },
                  { id: "manage_settings", label: "إدارة الإعدادات" },
                  { id: "manage_users", label: "إدارة المستخدمين" },
                ].map((permission) => {
                  const permissions = watch("permissions") || [];
                  const isChecked = permissions.includes(permission.id);
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 space-x-reverse"
                    >
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const currentPermissions = [
                            ...(watch("permissions") || []),
                          ];
                          if (e.target.checked) {
                            setValue("permissions", [
                              ...currentPermissions,
                              permission.id,
                            ]);
                          } else {
                            setValue(
                              "permissions",
                              currentPermissions.filter(
                                (p) => p !== permission.id,
                              ),
                            );
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                ملاحظة: الصلاحيات تعتمد على الدور أيضاً
              </p>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is-active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is-active">المستخدم نشط</Label>
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
