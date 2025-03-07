import React from "react";
import { Card } from "@/components/ui/card";
import { StatsCard } from "./dashboard/stats-card";
import { RecentActivities } from "./dashboard/recent-activities";
import { SalaryChart } from "./dashboard/salary-chart";
import { EmployeeStatus } from "./dashboard/employee-status";
import { Users, CreditCard, Calendar, TrendingUp } from "lucide-react";
import { useEmployees } from "@/lib/hooks/use-employees";

const Home = () => {
  const { employees } = useEmployees();

  // Mock data for dashboard
  const activities = [
    {
      id: "1",
      title: "تم إضافة راتب جديد",
      description: "تم إضافة راتب شهر مايو لأحمد محمد",
      timestamp: "منذ 2 ساعة",
      type: "salary" as const,
      status: "success" as const,
    },
    {
      id: "2",
      title: "طلب سلفة جديد",
      description: "قدم فاطمة علي طلب سلفة بقيمة 1000 ج.م",
      timestamp: "منذ 5 ساعات",
      type: "advance" as const,
      status: "pending" as const,
    },
    {
      id: "3",
      title: "طلب إجازة",
      description: "قدم محمد علي طلب إجازة لمدة 3 أيام",
      timestamp: "منذ يوم",
      type: "attendance" as const,
      status: "pending" as const,
    },
    {
      id: "4",
      title: "تم إضافة موظف جديد",
      description: "تم إضافة خالد أحمد كمهندس برمجيات",
      timestamp: "منذ 3 أيام",
      type: "employee" as const,
      status: "success" as const,
    },
  ];

  const chartData = [
    { month: "يناير", totalSalaries: 25000, totalDeductions: 5000 },
    { month: "فبراير", totalSalaries: 27000, totalDeductions: 5500 },
    { month: "مارس", totalSalaries: 26000, totalDeductions: 4800 },
    { month: "أبريل", totalSalaries: 28000, totalDeductions: 6000 },
    { month: "مايو", totalSalaries: 30000, totalDeductions: 6200 },
    { month: "يونيو", totalSalaries: 29000, totalDeductions: 5800 },
  ];

  const employeeStatusData = employees.slice(0, 5).map((employee) => ({
    id: employee.id,
    name: employee.name,
    position: employee.position,
    status: ["present", "absent", "leave", "late"][
      Math.floor(Math.random() * 4)
    ] as "present" | "absent" | "leave" | "late",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
  }));

  return (
    <div className="space-y-8" dir="rtl">
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block mb-2">
        لوحة التحكم
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي الموظفين"
          value={employees.length}
          icon={<Users className="h-8 w-8" />}
          trend="up"
          trendValue="2% من الشهر الماضي"
        />
        <StatsCard
          title="إجمالي الرواتب"
          value="30,000 ج.م"
          icon={<CreditCard className="h-8 w-8" />}
          trend="up"
          trendValue="5% من الشهر الماضي"
        />
        <StatsCard
          title="السلف المعلقة"
          value="3"
          icon={<TrendingUp className="h-8 w-8" />}
          trend="down"
          trendValue="10% من الشهر الماضي"
        />
        <StatsCard
          title="الإجازات الحالية"
          value="2"
          icon={<Calendar className="h-8 w-8" />}
          trend="neutral"
          trendValue="نفس الشهر الماضي"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalaryChart data={chartData} />
        </div>
        <div>
          <EmployeeStatus employees={employeeStatusData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities activities={activities} />
        </div>
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-right">
              المهام القادمة
            </h3>
            <ul className="space-y-3 text-right">
              <li className="pb-2 border-b">
                <p className="font-medium">دفع رواتب شهر يونيو</p>
                <p className="text-sm text-muted-foreground">25 يونيو 2024</p>
              </li>
              <li className="pb-2 border-b">
                <p className="font-medium">مراجعة طلبات الإجازات</p>
                <p className="text-sm text-muted-foreground">20 يونيو 2024</p>
              </li>
              <li className="pb-2 border-b">
                <p className="font-medium">تقييم أداء الموظفين</p>
                <p className="text-sm text-muted-foreground">30 يونيو 2024</p>
              </li>
              <li>
                <p className="font-medium">تحديث بيانات الموظفين</p>
                <p className="text-sm text-muted-foreground">15 يونيو 2024</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
