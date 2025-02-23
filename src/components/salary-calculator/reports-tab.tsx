import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmployees } from "@/lib/hooks/use-employees";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ReportsTab() {
  const { employees } = useEmployees();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button>تصدير التقرير</Button>
        <h2 className="text-2xl font-bold">تقارير الرواتب</h2>
      </div>

      <div className="flex justify-end space-x-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="اختر موظف" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">تقارير قياسية</TabsTrigger>
          <TabsTrigger value="detailed">تقارير مفصلة</TabsTrigger>
          <TabsTrigger value="payslips">قسائم الرواتب</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-right mb-4">
              التقارير القياسية
            </h3>
            {/* TODO: Add standard reports content */}
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-right mb-4">
              التقارير المفصلة
            </h3>
            {/* TODO: Add detailed reports content */}
          </Card>
        </TabsContent>

        <TabsContent value="payslips" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-right mb-4">
              قسائم الرواتب
            </h3>
            {/* TODO: Add payslips content */}
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
