import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MonthlyVariables() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">المتغيرات الشهرية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>الحوافز</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>المكافآت</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>الخصومات</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>الغياب</Label>
          <Input type="number" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>السلف</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>المشتريات</Label>
          <Input type="number" placeholder="0.00" />
        </div>
      </div>
    </div>
  );
}
