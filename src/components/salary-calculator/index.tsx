import { Card } from "@/components/ui/card";
import { EmployeeSearch } from "./employee-search";
import { MonthlyVariables } from "./monthly-variables";
import { SalarySummary } from "./salary-summary";

export default function SalaryCalculator() {
  return (
    <div dir="rtl" className="min-h-screen bg-background p-6 space-y-4">
      <Card className="p-6 space-y-6">
        <EmployeeSearch />
        <MonthlyVariables />
        <SalarySummary />
      </Card>
    </div>
  );
}
