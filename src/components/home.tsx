import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatsCard } from "./dashboard/stats-card";
import { RecentActivities } from "./dashboard/recent-activities";
import { SalaryChart } from "./dashboard/salary-chart";
import { EmployeeStatus } from "./dashboard/employee-status";
import { Users, CreditCard, Calendar, TrendingUp } from "lucide-react";
import { useEmployees } from "@/lib/hooks/use-employees";
import { supabase } from "@/lib/supabase";

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

  const [chartData, setChartData] = useState([
    { month: "يناير", totalSalaries: 25000, totalDeductions: 5000 },
    { month: "فبراير", totalSalaries: 27000, totalDeductions: 5500 },
    { month: "مارس", totalSalaries: 26000, totalDeductions: 4800 },
    { month: "أبريل", totalSalaries: 28000, totalDeductions: 6000 },
    { month: "مايو", totalSalaries: 30000, totalDeductions: 6200 },
    { month: "يونيو", totalSalaries: 29000, totalDeductions: 5800 },
  ]);

  // Fetch salary data from database
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from("salary_components")
            .select("*")
            .order("year", { ascending: true })
            .order("month", { ascending: true });

          if (error) {
            console.error("Error fetching salary data:", error);
            return;
          }

          if (data && data.length > 0) {
            // Process the data to match the chart format
            const processedData = [];
            const months = [
              "يناير",
              "فبراير",
              "مارس",
              "أبريل",
              "مايو",
              "يونيو",
              "يوليو",
              "أغسطس",
              "سبتمبر",
              "أكتوبر",
              "نوفمبر",
              "ديسمبر",
            ];

            // Group by month and year
            const groupedData = {};
            data.forEach((item) => {
              const key = `${item.year}-${item.month}`;
              if (!groupedData[key]) {
                groupedData[key] = {
                  month: months[parseInt(item.month) - 1] || item.month,
                  year: item.year,
                  totalSalaries: 0,
                  totalDeductions: 0,
                };
              }

              // Sum up the values
              groupedData[key].totalSalaries +=
                item.net_salary + (item.deductions || 0);
              groupedData[key].totalDeductions += item.deductions || 0;
            });

            // Convert to array and sort
            const chartData = Object.values(groupedData);
            chartData.sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return months.indexOf(a.month) - months.indexOf(b.month);
            });

            // Take the last 6 months or all if less than 6
            const recentData = chartData.slice(-6);
            if (recentData.length > 0) {
              setChartData(recentData);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchSalaryData:", error);
      }
    };

    fetchSalaryData();
  }, [supabase]);

  // Get employee status from attendance records for today
  const [employeeStatusData, setEmployeeStatusData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        if (supabase) {
          const today = new Date().toISOString().split("T")[0];
          const { data, error } = await supabase
            .from("attendance")
            .select(
              `
              id,
              employee_id,
              status,
              employees(id, name, position)
            `,
            )
            .eq("date", today);

          if (error) {
            console.error("Error fetching attendance:", error);
            return;
          }

          // If we have attendance data, use it
          if (data && data.length > 0) {
            const statusData = data.map((record) => ({
              id: record.employee_id,
              name: record.employees?.name || "Unknown",
              position: record.employees?.position || "Employee",
              status: record.status,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.employees?.name || record.employee_id}`,
            }));
            setEmployeeStatusData(statusData);
          } else {
            // If no attendance data, use a consistent status for each employee
            const statusData = employees.slice(0, 5).map((employee, index) => ({
              id: employee.id,
              name: employee.name,
              position: employee.position || "Employee",
              status: ["present", "present", "leave", "late"][index % 4] as
                | "present"
                | "absent"
                | "leave"
                | "late",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
            }));
            setEmployeeStatusData(statusData);
          }
        } else {
          // Fallback for when supabase is not available
          const statusData = employees.slice(0, 5).map((employee, index) => ({
            id: employee.id,
            name: employee.name,
            position: employee.position || "Employee",
            status: ["present", "present", "leave", "late"][index % 4] as
              | "present"
              | "absent"
              | "leave"
              | "late",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
          }));
          setEmployeeStatusData(statusData);
        }
      } catch (error) {
        console.error("Error in fetchAttendanceData:", error);
        // Fallback
        const statusData = employees.slice(0, 5).map((employee, index) => ({
          id: employee.id,
          name: employee.name,
          position: employee.position || "Employee",
          status: ["present", "present", "leave", "late"][index % 4] as
            | "present"
            | "absent"
            | "leave"
            | "late",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
        }));
        setEmployeeStatusData(statusData);
      }
    };

    if (employees.length > 0) {
      fetchAttendanceData();
    }
  }, [employees, supabase]);

  // Calculate dashboard stats from real data
  const [dashboardStats, setDashboardStats] = useState({
    totalSalaries: 0,
    pendingAdvances: 0,
    currentLeaves: 0,
  });

  useEffect(() => {
    // Calculate total salaries
    const savedSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");
    const totalSalaries = savedSalaries.reduce(
      (sum: number, salary: any) => sum + (parseFloat(salary.netSalary) || 0),
      0,
    );

    // Calculate pending advances
    const savedAdvances = JSON.parse(localStorage.getItem("advances") || "[]");
    const pendingAdvances = savedAdvances.filter(
      (adv: any) => adv.status === "pending",
    ).length;

    // Calculate current leaves
    const savedAbsences = JSON.parse(localStorage.getItem("absences") || "[]");
    const currentLeaves = savedAbsences.filter((absence: any) => {
      const today = new Date().toISOString().split("T")[0];
      return (
        absence.startDate <= today &&
        absence.endDate >= today &&
        absence.status === "approved"
      );
    }).length;

    setDashboardStats({
      totalSalaries,
      pendingAdvances,
      currentLeaves,
    });
  }, []);

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
          trendValue={`${employees.length > 0 ? Math.round((employees.length / 10) * 100) : 0}% من الشهر الماضي`}
        />
        <StatsCard
          title="إجمالي الرواتب"
          value={`${dashboardStats.totalSalaries.toLocaleString()} ج.م`}
          icon={<CreditCard className="h-8 w-8" />}
          trend="up"
          trendValue="5% من الشهر الماضي"
        />
        <StatsCard
          title="السلف المعلقة"
          value={dashboardStats.pendingAdvances.toString()}
          icon={<TrendingUp className="h-8 w-8" />}
          trend={dashboardStats.pendingAdvances > 2 ? "down" : "up"}
          trendValue={`${dashboardStats.pendingAdvances > 2 ? "10% من الشهر الماضي" : "5% من الشهر الماضي"}`}
        />
        <StatsCard
          title="الإجازات الحالية"
          value={dashboardStats.currentLeaves.toString()}
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
