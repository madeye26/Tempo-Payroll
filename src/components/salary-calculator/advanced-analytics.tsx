import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalaryData {
  month: string;
  year: number;
  totalSalaries: number;
  totalDeductions: number;
  totalAdvances: number;
  employeeCount: number;
  averageSalary: number;
}

interface AdvancedAnalyticsProps {
  reports: any[];
}

export function AdvancedAnalytics({ reports }: AdvancedAnalyticsProps) {
  // Process reports to create data for charts
  const data = processReports(reports);

  // Function to process reports into chart data
  function processReports(reports: any[]) {
    // Group reports by month and year
    const groupedData: Record<string, SalaryData> = {};
    reports.forEach((report) => {
      const key = `${report.year}-${report.month}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          month: report.month,
          year: report.year,
          totalSalaries: 0,
          totalDeductions: 0,
          totalAdvances: 0,
          employeeCount: 0,
          averageSalary: 0,
        };
      }
      groupedData[key].totalSalaries += report.netSalary;
      groupedData[key].totalDeductions += report.totalDeductions;
      groupedData[key].totalAdvances += report.advances;
      groupedData[key].employeeCount += 1;
    });

    // Calculate average salary for each month
    Object.values(groupedData).forEach((data) => {
      data.averageSalary =
        data.employeeCount > 0 ? data.totalSalaries / data.employeeCount : 0;
    });

    return Object.values(groupedData);
  }
  const [period, setPeriod] = useState("year");
  const [chartType, setChartType] = useState("bar");

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.totalSalaries, item.totalDeductions)),
  );

  // Calculate year-over-year growth
  const calculateYoYGrowth = () => {
    if (data.length < 13) return 0;
    const currentMonth = data[data.length - 1];
    const lastYear = data[data.length - 13];
    return (
      ((currentMonth.totalSalaries - lastYear.totalSalaries) /
        lastYear.totalSalaries) *
      100
    );
  };

  // Calculate month-over-month growth
  const calculateMoMGrowth = () => {
    if (data.length < 2) return 0;
    const currentMonth = data[data.length - 1];
    const lastMonth = data[data.length - 2];
    return (
      ((currentMonth.totalSalaries - lastMonth.totalSalaries) /
        lastMonth.totalSalaries) *
      100
    );
  };

  // Calculate average salary trend
  const averageSalaryTrend = data.map((item) => item.averageSalary);
  const averageSalaryGrowth =
    averageSalaryTrend.length > 1
      ? ((averageSalaryTrend[averageSalaryTrend.length - 1] -
          averageSalaryTrend[0]) /
          averageSalaryTrend[0]) *
        100
      : 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">الشهر الحالي</SelectItem>
              <SelectItem value="quarter">الربع الحالي</SelectItem>
              <SelectItem value="year">السنة الحالية</SelectItem>
              <SelectItem value="all">كل البيانات</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="نوع الرسم البياني" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">أعمدة</SelectItem>
              <SelectItem value="line">خط</SelectItem>
              <SelectItem value="area">مساحة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <h3 className="text-lg font-semibold">تحليلات متقدمة للرواتب</h3>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="trends">اتجاهات الرواتب</TabsTrigger>
          <TabsTrigger value="distribution">توزيع الرواتب</TabsTrigger>
          <TabsTrigger value="forecasting">التنبؤ المستقبلي</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 space-y-2 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-muted-foreground">النمو السنوي</p>
              <p className="text-2xl font-bold">
                {calculateYoYGrowth().toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                مقارنة بالعام السابق
              </p>
            </Card>
            <Card className="p-4 space-y-2 bg-green-50 dark:bg-green-900/20">
              <p className="text-muted-foreground">النمو الشهري</p>
              <p className="text-2xl font-bold">
                {calculateMoMGrowth().toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                مقارنة بالشهر السابق
              </p>
            </Card>
            <Card className="p-4 space-y-2 bg-purple-50 dark:bg-purple-900/20">
              <p className="text-muted-foreground">متوسط الراتب</p>
              <p className="text-2xl font-bold">
                {averageSalaryGrowth.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">نمو متوسط الراتب</p>
            </Card>
          </div>

          <div className="h-[400px] w-full">
            <div className="flex h-full items-end gap-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex justify-between items-end h-[350px]">
                    {chartType === "bar" && (
                      <>
                        <div
                          className="w-5 bg-gradient-to-t from-primary/80 to-primary rounded-t shadow-lg transition-all duration-300 hover:w-6 hover:from-primary/90 hover:to-primary relative group"
                          style={{
                            height: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalSalaries.toLocaleString()} ج.م
                          </div>
                        </div>
                        <div
                          className="w-5 bg-gradient-to-t from-destructive/80 to-destructive rounded-t shadow-lg transition-all duration-300 hover:w-6 hover:from-destructive/90 hover:to-destructive relative group"
                          style={{
                            height: `${(item.totalDeductions / maxValue) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalDeductions.toLocaleString()} ج.م
                          </div>
                        </div>
                        <div
                          className="w-5 bg-gradient-to-t from-amber-500/80 to-amber-500 rounded-t shadow-lg transition-all duration-300 hover:w-6 hover:from-amber-500/90 hover:to-amber-500 relative group"
                          style={{
                            height: `${(item.totalAdvances / maxValue) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalAdvances.toLocaleString()} ج.م
                          </div>
                        </div>
                      </>
                    )}
                    {chartType === "line" && (
                      <div className="w-full h-full relative">
                        {/* Salary line */}
                        <div
                          className="absolute bottom-0 left-1/2 w-3 h-3 bg-primary rounded-full shadow-md z-10 transform -translate-x-1/2 transition-all duration-300 hover:w-4 hover:h-4 hover:bg-primary-foreground hover:border-2 hover:border-primary"
                          style={{
                            bottom: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalSalaries.toLocaleString()} ج.م
                          </div>
                        </div>

                        {/* Deductions line */}
                        <div
                          className="absolute bottom-0 left-1/2 w-3 h-3 bg-destructive rounded-full shadow-md z-10 transform -translate-x-1/2 transition-all duration-300 hover:w-4 hover:h-4 hover:bg-destructive-foreground hover:border-2 hover:border-destructive"
                          style={{
                            bottom: `${(item.totalDeductions / maxValue) * 100}%`,
                            left: "75%",
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalDeductions.toLocaleString()} ج.م
                          </div>
                        </div>

                        {/* Advances line */}
                        <div
                          className="absolute bottom-0 left-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-md z-10 transform -translate-x-1/2 transition-all duration-300 hover:w-4 hover:h-4 hover:bg-amber-300 hover:border-2 hover:border-amber-500"
                          style={{
                            bottom: `${(item.totalAdvances / maxValue) * 100}%`,
                            left: "25%",
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalAdvances.toLocaleString()} ج.م
                          </div>
                        </div>

                        {/* Connection lines */}
                        {index < data.length - 1 && (
                          <>
                            <div
                              className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-primary to-primary/70 shadow-sm"
                              style={{
                                bottom: `${(item.totalSalaries / maxValue) * 100}%`,
                                width: "100%",
                                transformOrigin: "left bottom",
                                transform: `rotate(${
                                  Math.atan2(
                                    (data[index + 1].totalSalaries / maxValue) *
                                      100 -
                                      (item.totalSalaries / maxValue) * 100,
                                    100,
                                  ) *
                                  (180 / Math.PI)
                                }deg)`,
                              }}
                            ></div>

                            <div
                              className="absolute bottom-0 left-3/4 h-0.5 bg-gradient-to-r from-destructive to-destructive/70 shadow-sm"
                              style={{
                                bottom: `${(item.totalDeductions / maxValue) * 100}%`,
                                width: "100%",
                                transformOrigin: "left bottom",
                                transform: `rotate(${
                                  Math.atan2(
                                    (data[index + 1].totalDeductions /
                                      maxValue) *
                                      100 -
                                      (item.totalDeductions / maxValue) * 100,
                                    100,
                                  ) *
                                  (180 / Math.PI)
                                }deg)`,
                              }}
                            ></div>

                            <div
                              className="absolute bottom-0 left-1/4 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/70 shadow-sm"
                              style={{
                                bottom: `${(item.totalAdvances / maxValue) * 100}%`,
                                width: "100%",
                                transformOrigin: "left bottom",
                                transform: `rotate(${
                                  Math.atan2(
                                    (data[index + 1].totalAdvances / maxValue) *
                                      100 -
                                      (item.totalAdvances / maxValue) * 100,
                                    100,
                                  ) *
                                  (180 / Math.PI)
                                }deg)`,
                              }}
                            ></div>
                          </>
                        )}
                      </div>
                    )}
                    {chartType === "area" && (
                      <div className="w-full h-full relative">
                        <div
                          className="w-full bg-gradient-to-t from-primary/30 to-primary/5 rounded-t absolute bottom-0 transition-all duration-300 hover:from-primary/40 hover:to-primary/10"
                          style={{
                            height: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="w-full bg-gradient-to-t from-destructive/30 to-destructive/5 rounded-t absolute bottom-0 transition-all duration-300 hover:from-destructive/40 hover:to-destructive/10"
                          style={{
                            height: `${(item.totalDeductions / maxValue) * 100}%`,
                            opacity: 0.7,
                          }}
                        ></div>
                        <div
                          className="w-full bg-gradient-to-t from-amber-500/30 to-amber-500/5 rounded-t absolute bottom-0 transition-all duration-300 hover:from-amber-500/40 hover:to-amber-500/10"
                          style={{
                            height: `${(item.totalAdvances / maxValue) * 100}%`,
                            opacity: 0.5,
                          }}
                        ></div>

                        {/* Data point */}
                        <div
                          className="absolute left-1/2 w-3 h-3 bg-primary rounded-full shadow-md transform -translate-x-1/2 z-10 transition-all duration-300 hover:w-4 hover:h-4"
                          style={{
                            bottom: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded shadow-md text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.totalSalaries.toLocaleString()} ج.م
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">إجمالي الرواتب</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-sm">إجمالي الخصومات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm">إجمالي السلف</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              رسم بياني لتوزيع الرواتب حسب الأقسام والمناصب
            </p>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              تنبؤات مستقبلية للرواتب بناءً على البيانات التاريخية
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
