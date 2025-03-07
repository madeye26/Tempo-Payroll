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
  data: SalaryData[];
}

export function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
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
                          className="w-5 bg-primary rounded-t"
                          style={{
                            height: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="w-5 bg-destructive rounded-t"
                          style={{
                            height: `${(item.totalDeductions / maxValue) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="w-5 bg-amber-500 rounded-t"
                          style={{
                            height: `${(item.totalAdvances / maxValue) * 100}%`,
                          }}
                        ></div>
                      </>
                    )}
                    {chartType === "line" && index > 0 && (
                      <div className="w-full h-full relative">
                        <div
                          className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary rounded-full"
                          style={{
                            bottom: `${(item.totalSalaries / maxValue) * 100}%`,
                          }}
                        ></div>
                        {index < data.length - 1 && (
                          <div
                            className="absolute bottom-0 left-1/2 w-full h-0.5 bg-primary"
                            style={{
                              bottom: `${(item.totalSalaries / maxValue) * 100}%`,
                              transform: "rotate(30deg)",
                              transformOrigin: "left bottom",
                            }}
                          ></div>
                        )}
                      </div>
                    )}
                    {chartType === "area" && (
                      <div
                        className="w-full bg-primary/20 rounded-t"
                        style={{
                          height: `${(item.totalSalaries / maxValue) * 100}%`,
                        }}
                      ></div>
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
