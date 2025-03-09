import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SystemSettingsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  // System settings
  const [companyName, setCompanyName] = useState("شركتك");
  const [companyAddress, setCompanyAddress] = useState("القاهرة، مصر");
  const [workingDays, setWorkingDays] = useState("30");
  const [workingHours, setWorkingHours] = useState("11");
  const [defaultCurrency, setDefaultCurrency] = useState("ج.م");
  const [roundSalaries, setRoundSalaries] = useState(true);
  const [roundingMethod, setRoundingMethod] = useState("nearest5");

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("system_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCompanyName(settings.companyName || "شركتك");
      setCompanyAddress(settings.companyAddress || "القاهرة، مصر");
      setWorkingDays(settings.workingDays || "30");
      setWorkingHours(settings.workingHours || "11");
      setDefaultCurrency(settings.defaultCurrency || "ج.م");
      setRoundSalaries(settings.roundSalaries !== false);
      setRoundingMethod(settings.roundingMethod || "nearest5");
    }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      companyName,
      companyAddress,
      workingDays,
      workingHours,
      defaultCurrency,
      roundSalaries,
      roundingMethod,
    };
    localStorage.setItem("system_settings", JSON.stringify(settings));

    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات النظام بنجاح",
    });
  };

  const handleReset = () => {
    // Reset to default settings
    setCompanyName("شركتك");
    setCompanyAddress("القاهرة، مصر");
    setWorkingDays("30");
    setWorkingHours("11");
    setDefaultCurrency("ج.م");
    setRoundSalaries(true);
    setRoundingMethod("nearest5");

    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين إعدادات النظام إلى القيم الافتراضية",
    });
  };

  if (!hasPermission("manage_settings")) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">غير مصرح</h1>
        <p className="mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        <Button onClick={() => window.history.back()}>العودة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
          إعدادات النظام
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave}>
            <Save className="ml-2 h-4 w-4" />
            حفظ
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">إعدادات الشركة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>اسم الشركة</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label>عنوان الشركة</Label>
            <Input
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="text-right"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">إعدادات الرواتب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>عدد أيام العمل في الشهر</Label>
            <Input
              type="number"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label>عدد ساعات العمل في اليوم</Label>
            <Input
              type="number"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label>العملة الافتراضية</Label>
            <Input
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label>طريقة تقريب الرواتب</Label>
            <Select
              value={roundingMethod}
              onValueChange={setRoundingMethod}
              disabled={!roundSalaries}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest5">أقرب 5 وحدات</SelectItem>
                <SelectItem value="nearest10">أقرب 10 وحدات</SelectItem>
                <SelectItem value="up5">لأعلى 5 وحدات</SelectItem>
                <SelectItem value="down5">لأسفل 5 وحدات</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="round-salaries"
              checked={roundSalaries}
              onCheckedChange={setRoundSalaries}
            />
            <Label htmlFor="round-salaries">تقريب الرواتب</Label>
          </div>
        </div>
      </Card>
    </div>
  );
}
