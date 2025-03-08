import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalaryChartProps {
  data: {
    month: string;
    totalSalaries: number;
    totalDeductions: number;
  }[];
}

export function SalaryChart({ data }: SalaryChartProps) {
  const [period, setPeriod] = React.useState("year");

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.totalSalaries, item.totalDeductions)),
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">الشهر الحالي</SelectItem>
            <SelectItem value="quarter">الربع الحالي</SelectItem>
            <SelectItem value="year">السنة الحالية</SelectItem>
          </SelectContent>
        </Select>
        <h3 className="text-lg font-semibold">تقرير الرواتب</h3>
      </div>

      <div className="h-[300px] w-full">
        <div className="flex h-full items-end gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full flex justify-between items-end h-[250px] relative group">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/5 rounded-t pointer-events-none">
                  <div className="bg-background/90 p-2 rounded shadow-md text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{item.totalSalaries.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>{item.totalDeductions.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
                <div
                  className="w-5 bg-gradient-to-t from-primary/80 to-primary rounded-t shadow-lg transition-all duration-300 hover:w-6 group-hover:from-primary/90 group-hover:to-primary"
                  style={{
                    height: `${(item.totalSalaries / maxValue) * 100}%`,
                  }}
                ></div>
                <div
                  className="w-5 bg-gradient-to-t from-destructive/80 to-destructive rounded-t shadow-lg transition-all duration-300 hover:w-6 group-hover:from-destructive/90 group-hover:to-destructive"
                  style={{
                    height: `${(item.totalDeductions / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium">{item.month}</span>
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
      </div>
    </Card>
  );
}
