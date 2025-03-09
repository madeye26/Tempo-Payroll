import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/salary-calculator/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar as CalendarIcon,
  FileDown,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { getActivityLogs, ActivityLog } from "@/lib/activity-logger";
import { useAuth } from "@/lib/hooks/use-auth.tsx";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DataExport } from "@/components/ui/data-export";

export default function ActivityLogsPage() {
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Filters
  const [userFilter, setUserFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (userFilter) filters.userId = userFilter;
      if (typeFilter) filters.type = typeFilter;
      if (actionFilter) filters.action = actionFilter;
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();

      const { logs: fetchedLogs, total } = await getActivityLogs(
        page,
        limit,
        filters,
      );
      setLogs(fetchedLogs);
      setTotalLogs(total);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Listen for activity-logged events
    const handleActivityLogged = () => {
      fetchLogs();
    };

    window.addEventListener("activity-logged", handleActivityLogged);

    return () => {
      window.removeEventListener("activity-logged", handleActivityLogged);
    };
  }, [page, limit, userFilter, typeFilter, actionFilter, startDate, endDate]);

  const handleClearFilters = () => {
    setUserFilter("");
    setTypeFilter("");
    setActionFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "auth":
        return "تسجيل الدخول";
      case "employee":
        return "الموظفين";
      case "salary":
        return "الرواتب";
      case "advance":
        return "السلف";
      case "attendance":
        return "الحضور";
      case "report":
        return "التقارير";
      case "setting":
        return "الإعدادات";
      default:
        return type;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create":
        return "إنشاء";
      case "update":
        return "تعديل";
      case "delete":
        return "حذف";
      case "view":
        return "عرض";
      case "login":
        return "تسجيل دخول";
      case "logout":
        return "تسجيل خروج";
      case "export":
        return "تصدير";
      default:
        return action;
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "view":
        return "bg-gray-100 text-gray-800";
      case "login":
        return "bg-purple-100 text-purple-800";
      case "logout":
        return "bg-orange-100 text-orange-800";
      case "export":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "created_at",
      header: "التاريخ والوقت",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div>
            <div>{date.toLocaleDateString("ar-EG")}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString("ar-EG")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user_name",
      header: "المستخدم",
      cell: ({ row }) => {
        const userName = row.getValue("user_name") as string;
        const userEmail = row.original.user_email;
        return (
          <div>
            <div>{userName}</div>
            <div className="text-xs text-muted-foreground">{userEmail}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "النوع",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return getTypeLabel(type);
      },
    },
    {
      accessorKey: "action",
      header: "الإجراء",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return (
          <Badge className={getActionBadgeClass(action)}>
            {getActionLabel(action)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }) => row.getValue("description"),
    },
  ];

  if (!hasPermission("manage_settings")) {
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
          سجل النشاطات
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="ml-2 h-4 w-4" />
            {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </Button>
          <Button variant="outline" onClick={fetchLogs}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
          <DataExport
            data={logs}
            filename={`activity-logs-${format(new Date(), "yyyy-MM-dd")}`}
          />
        </div>
      </div>

      {showFilters && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">فلترة النتائج</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>نوع النشاط</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأنواع</SelectItem>
                  <SelectItem value="auth">تسجيل الدخول</SelectItem>
                  <SelectItem value="employee">الموظفين</SelectItem>
                  <SelectItem value="salary">الرواتب</SelectItem>
                  <SelectItem value="advance">السلف</SelectItem>
                  <SelectItem value="attendance">الحضور</SelectItem>
                  <SelectItem value="report">التقارير</SelectItem>
                  <SelectItem value="setting">الإعدادات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الإجراء</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الإجراءات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الإجراءات</SelectItem>
                  <SelectItem value="create">إنشاء</SelectItem>
                  <SelectItem value="update">تعديل</SelectItem>
                  <SelectItem value="delete">حذف</SelectItem>
                  <SelectItem value="view">عرض</SelectItem>
                  <SelectItem value="login">تسجيل دخول</SelectItem>
                  <SelectItem value="logout">تسجيل خروج</SelectItem>
                  <SelectItem value="export">تصدير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"w-full justify-start text-right"}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: ar })
                    ) : (
                      <span>اختر تاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"w-full justify-start text-right"}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP", { locale: ar })
                    ) : (
                      <span>اختر تاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">سجل النشاطات</h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        ) : logs.length > 0 ? (
          <>
            <DataTable columns={columns} data={logs} searchKey="description" />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                إجمالي النتائج: {totalLogs}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page * limit >= totalLogs}
                >
                  التالي
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد نشاطات مسجلة
          </div>
        )}
      </Card>
    </div>
  );
}
