import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SalaryCalculator from "./SalaryCalculator";
import { AdvancesTab } from "./advances-tab";
import { ReportsTab } from "./reports-tab";

export function SalaryTabs() {
  return (
    <Tabs defaultValue="salary" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="salary">الراتب الشهري</TabsTrigger>
        <TabsTrigger value="advances">السلف</TabsTrigger>
        <TabsTrigger value="reports">تقارير الرواتب</TabsTrigger>
      </TabsList>
      <TabsContent value="salary">
        <SalaryCalculator />
      </TabsContent>
      <TabsContent value="advances">
        <AdvancesTab />
      </TabsContent>
      <TabsContent value="reports">
        <ReportsTab />
      </TabsContent>
    </Tabs>
  );
}
