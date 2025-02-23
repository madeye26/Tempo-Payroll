import { Card } from "@/components/ui/card";

export function SalarySummary() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">ملخص الراتب</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2">
          <p className="text-muted-foreground">المجموع الكلي</p>
          <p className="text-2xl font-bold">0.00 ج.م</p>
        </Card>
        <Card className="p-4 space-y-2">
          <p className="text-muted-foreground">إجمالي الخصومات</p>
          <p className="text-2xl font-bold text-destructive">0.00 ج.م</p>
        </Card>
        <Card className="p-4 space-y-2">
          <p className="text-muted-foreground">صافي الراتب</p>
          <p className="text-2xl font-bold text-primary">0.00 ج.م</p>
        </Card>
      </div>
    </div>
  );
}
