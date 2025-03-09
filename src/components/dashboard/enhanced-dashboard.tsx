import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./stats-card";
import { RecentActivities } from "./recent-activities";
import { SalaryChart } from "./salary-chart";
import { EmployeeStatus } from "./employee-status";
import {
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import { useEmployees } from "@/lib/hooks/use-employees";
import { supabase } from "@/lib/supabase";
import { FadeIn, SlideIn, AnimatedList } from "@/components/ui/animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnhancedDashboard() {
  const { employees } = useEmployees();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Get real activity logs from localStorage
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Get activity logs from localStorage
    const storedLogs = localStorage.getItem("activity_logs");
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs);
        // Convert to the format needed for RecentActivities component
        const formattedActivities = parsedLogs
          .slice(0, 5) // Get only the 5 most recent activities
          .map((log: any) => {
            // Determine type based on log type
            let activityType: "salary" | "advance" | "attendance" | "employee" =
              "salary";
            switch (log.type) {
              case "salary":
                activityType = "salary";
                break;
              case "advance":
                activityType = "advance";
                break;
              case "attendance":
                activityType = "attendance";
                break;
              case "employee":
                activityType = "employee";
                break;
              default:
                activityType = "salary";
            }

            // Determine status based on log action
            let activityStatus: "success" | "pending" | "error" = "success";
            if (log.action === "create" || log.action === "update") {
              activityStatus = "success";
            } else if (log.action === "delete") {
              activityStatus = "error";
            } else {
              activityStatus = "pending";
            }

            // Calculate relative time
            const logDate = new Date(log.created_at);
            const now = new Date();
            const diffMs = now.getTime() - logDate.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            let timestamp = "";
            if (diffMins < 60) {
              timestamp = `منذ ${diffMins} دقيقة`;
            } else if (diffHours < 24) {
              timestamp = `منذ ${diffHours} ساعة`;
            } else {
              timestamp = `منذ ${diffDays} يوم`;
            }

            return {
              id: log.id,
              title: log.description.split(" ").slice(0, 3).join(" "),
              description: log.description,
              timestamp,
              type: activityType,
              status: activityStatus,
            };
          });

        setActivities(formattedActivities);
      } catch (error) {
        console.error("Error parsing activity logs:", error);
        setActivities([]);
      }
    }
  }, []);

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

  // Additional stats for the enhanced dashboard
  const [advancedStats, setAdvancedStats] = useState({
    averageSalary: 0,
    highestPaidEmployee: "",
    lowestPaidEmployee: "",
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departmentBreakdown: [] as { department: string; count: number }[],
  });

  useEffect(() => {
    // Calculate advanced stats
    const savedSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");

    // Average salary
    const averageSalary =
      savedSalaries.length > 0
        ? savedSalaries.reduce(
            (sum: number, salary: any) =>
              sum + (parseFloat(salary.netSalary) || 0),
            0,
          ) / savedSalaries.length
        : 0;

    // Highest and lowest paid employees
    let highestPaid = { name: "", salary: 0 };
    let lowestPaid = { name: "", salary: Number.MAX_VALUE };

    savedSalaries.forEach((salary: any) => {
      const netSalary = parseFloat(salary.netSalary) || 0;
      if (netSalary > highestPaid.salary) {
        highestPaid = { name: salary.employeeName, salary: netSalary };
      }
      if (netSalary < lowestPaid.salary && netSalary > 0) {
        lowestPaid = { name: salary.employeeName, salary: netSalary };
      }
    });

    // Employee status counts
    const activeEmployees = employees.filter(
      (e) => e.status === "active",
    ).length;
    const inactiveEmployees = employees.length - activeEmployees;

    // Department breakdown
    const departments: Record<string, number> = {};
    employees.forEach((employee) => {
      const dept = employee.department || "غير محدد";
      departments[dept] = (departments[dept] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(departments).map(
      ([department, count]) => ({
        department,
        count,
      }),
    );

    setAdvancedStats({
      averageSalary,
      highestPaidEmployee: highestPaid.name,
      lowestPaidEmployee: lowestPaid.name,
      totalEmployees: employees.length,
      activeEmployees,
      inactiveEmployees,
      departmentBreakdown,
    });
  }, [employees]);

  return (
    <div className="space-y-8" dir="rtl">
      <FadeIn>
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block mb-2">
          لوحة التحكم
        </h1>
      </FadeIn>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="employees">الموظفين</TabsTrigger>
          <TabsTrigger value="finances">المالية</TabsTrigger>
          <TabsTrigger value="attendance">الحضور</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SlideIn>
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
          </SlideIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <SlideIn direction="left" className="lg:col-span-2">
              <SalaryChart data={chartData} />
            </SlideIn>
            <SlideIn direction="right">
              <EmployeeStatus employees={employeeStatusData} />
            </SlideIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <SlideIn direction="up" className="lg:col-span-2">
              <RecentActivities activities={activities} />
            </SlideIn>
            <SlideIn direction="up">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-right">
                  المهام القادمة
                </h3>
                <AnimatedList staggerDelay={0.1}>
                  {[
                    {
                      title: "دفع رواتب الشهر الحالي",
                      date: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0,
                      ),
                    },
                    {
                      title: "مراجعة طلبات الإجازات المعلقة",
                      date: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() + 3,
                      ),
                    },
                    {
                      title: "تقييم أداء الموظفين",
                      date: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() + 7,
                      ),
                    },
                    {
                      title: "تحديث بيانات الموظفين",
                      date: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() + 5,
                      ),
                    },
                  ].map((task, index) => (
                    <li key={index} className="pb-2 border-b mb-3">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.date.toLocaleDateString("ar-EG")}
                      </p>
                    </li>
                  ))}
                </AnimatedList>
              </Card>
            </SlideIn>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي الموظفين"
                value={advancedStats.totalEmployees.toString()}
                icon={<Users className="h-8 w-8" />}
                trend="up"
                trendValue="5% من الشهر الماضي"
              />
              <StatsCard
                title="الموظفين النشطين"
                value={advancedStats.activeEmployees.toString()}
                icon={<Users className="h-8 w-8" />}
                trend="up"
                trendValue="3% من الشهر الماضي"
              />
              <StatsCard
                title="متوسط الراتب"
                value={`${Math.round(advancedStats.averageSalary).toLocaleString()} ج.م`}
                icon={<CreditCard className="h-8 w-8" />}
                trend="up"
                trendValue="2% من الشهر الماضي"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  توزيع الموظفين حسب القسم
                </h3>
                <div className="space-y-4">
                  {advancedStats.departmentBreakdown.map((dept, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{dept.department}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full"
                            style={{
                              width: `${(dept.count / advancedStats.totalEmployees) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm">{dept.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  أعلى وأقل الرواتب
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">
                      أعلى راتب
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {advancedStats.highestPaidEmployee || "غير متوفر"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">
                      أقل راتب
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {advancedStats.lowestPaidEmployee || "غير متوفر"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finances">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">تحليل الرواتب</h2>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">شهري</SelectItem>
                  <SelectItem value="quarter">ربع سنوي</SelectItem>
                  <SelectItem value="year">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="إجمالي الرواتب"
                value={`${dashboardStats.totalSalaries.toLocaleString()} ج.م`}
                icon={<CreditCard className="h-8 w-8" />}
                trend="up"
                trendValue="5% من الفترة السابقة"
              />
              <StatsCard
                title="متوسط الراتب"
                value={`${Math.round(advancedStats.averageSalary).toLocaleString()} ج.م`}
                icon={<BarChart3 className="h-8 w-8" />}
                trend="up"
                trendValue="2% من الفترة السابقة"
              />
              <StatsCard
                title="إجمالي السلف"
                value={`${(dashboardStats.pendingAdvances * 1000).toLocaleString()} ج.م`}
                icon={<TrendingUp className="h-8 w-8" />}
                trend="down"
                trendValue="3% من الفترة السابقة"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                تحليل الرواتب حسب الشهر
              </h3>
              <SalaryChart data={chartData} />
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="ml-2 h-4 w-4" />
                تصدير التقرير
              </Button>
              <Button>
                <BarChart3 className="ml-2 h-4 w-4" />
                تحليل متقدم
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="الحضور اليوم"
                value={`${Math.round((employeeStatusData.filter((e: any) => e.status === "present").length / (employeeStatusData.length || 1)) * 100)}%`}
                icon={<Users className="h-8 w-8" />}
                trend="up"
                trendValue="2% من الأمس"
              />
              <StatsCard
                title="الإجازات الحالية"
                value={dashboardStats.currentLeaves.toString()}
                icon={<Calendar className="h-8 w-8" />}
                trend="neutral"
                trendValue="نفس الأسبوع الماضي"
              />
              <StatsCard
                title="التأخيرات"
                value={employeeStatusData
                  .filter((e: any) => e.status === "late")
                  .length.toString()}
                icon={<Clock className="h-8 w-8" />}
                trend="down"
                trendValue="5% من الأسبوع الماضي"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                حالة الموظفين اليوم
              </h3>
              <EmployeeStatus employees={employeeStatusData} />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Clock icon component for attendance tab
function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
