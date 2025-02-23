import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeSearch() {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">بحث عن موظف</h2>
      <Select>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="اختر موظف" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">أحمد محمد</SelectItem>
          <SelectItem value="2">فاطمة أحمد</SelectItem>
          <SelectItem value="3">محمد علي</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
