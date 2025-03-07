import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BackupRestore } from "@/components/salary-calculator/backup-restore";

export default function SettingsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        الإعدادات
      </h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          <TabsTrigger value="company">بيانات الشركة</TabsTrigger>
          <TabsTrigger value="salary">إعدادات الرواتب</TabsTrigger>
          <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">الإعدادات العامة</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الوضع الداكن</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل الوضع الداكن للتطبيق
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل الإشعارات داخل التطبيق
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تنبيهات البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال تنبيهات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">بيانات الشركة</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الشركة</Label>
                  <Input defaultValue="شركتك" className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    defaultValue="info@example.com"
                    className="text-right"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    defaultValue="+20123456789"
                    className="text-right"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input defaultValue="القاهرة، مصر" className="text-right" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>شعار الشركة</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://api.dicebear.com/7.x/initials/svg?seed=شركتك&backgroundColor=0891b2"
                      alt="Company Logo"
                      className="h-16 w-16 rounded-md"
                    />
                    <Button variant="outline">تغيير الشعار</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">إعدادات الرواتب</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عدد أيام العمل في الشهر</Label>
                  <Input
                    defaultValue="30"
                    className="text-right"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>عدد ساعات العمل في اليوم</Label>
                  <Input
                    defaultValue="8"
                    className="text-right"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>معامل الأوفرتايم</Label>
                  <Input
                    defaultValue="1.5"
                    className="text-right"
                    type="number"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحد الأقصى لساعات الأوفرتايم شهرياً</Label>
                  <Input
                    defaultValue="40"
                    className="text-right"
                    type="number"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>حفظ التغييرات</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/settings/formulas")}
            >
              إدارة صيغ حساب الرواتب
            </Button>
            <h2 className="text-xl font-semibold">
              النسخ الاحتياطي واستعادة البيانات
            </h2>
          </div>

          <div className="mt-4">
            <BackupRestore
              onBackup={async () => {
                // Mock data for backup
                return {
                  employees: [],
                  salaries: [],
                  settings: {},
                  timestamp: new Date().toISOString(),
                };
              }}
              onRestore={async (data) => {
                console.log("Restoring data:", data);
                return true;
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
