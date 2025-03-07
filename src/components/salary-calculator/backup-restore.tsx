import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Save, Upload, Download, Clock, Database } from "lucide-react";

interface BackupRestoreProps {
  onBackup?: () => Promise<any>;
  onRestore?: (data: any) => Promise<boolean>;
}

export function BackupRestore({ onBackup, onRestore }: BackupRestoreProps) {
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStatus, setBackupStatus] = useState<
    "idle" | "progress" | "success" | "error"
  >("idle");
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreStatus, setRestoreStatus] = useState<
    "idle" | "progress" | "success" | "error"
  >("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupTime, setBackupTime] = useState("00:00");
  const [backupRetention, setBackupRetention] = useState("7");

  const handleBackup = async () => {
    setBackupStatus("progress");
    setBackupProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setBackupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Actual backup logic
      if (onBackup) {
        const data = await onBackup();
        // Create and download backup file
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Ensure progress completes
      setTimeout(() => {
        clearInterval(interval);
        setBackupProgress(100);
        setBackupStatus("success");
      }, 3000);
    } catch (error) {
      console.error("Backup failed:", error);
      setBackupStatus("error");
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    setRestoreStatus("progress");
    setRestoreProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setRestoreProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      // Read file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          // Actual restore logic
          if (onRestore) {
            const success = await onRestore(data);
            if (!success) throw new Error("Restore failed");
          }

          // Ensure progress completes
          setTimeout(() => {
            clearInterval(interval);
            setRestoreProgress(100);
            setRestoreStatus("success");
          }, 3000);
        } catch (error) {
          console.error("Restore failed:", error);
          clearInterval(interval);
          setRestoreStatus("error");
        }
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Restore failed:", error);
      setRestoreStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = () => {
    // Save backup settings
    console.log("Backup settings saved:", {
      autoBackupEnabled,
      backupFrequency,
      backupTime,
      backupRetention,
    });
    // In a real app, this would save to the database or local storage
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-right">
        النسخ الاحتياطي واستعادة البيانات
      </h2>

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="backup">نسخ احتياطي</TabsTrigger>
          <TabsTrigger value="restore">استعادة البيانات</TabsTrigger>
          <TabsTrigger value="settings">إعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-6">
          <div className="space-y-4">
            <p className="text-muted-foreground text-right">
              قم بإنشاء نسخة احتياطية من جميع بيانات النظام. يمكنك استخدام هذه
              النسخة لاستعادة البيانات في حالة حدوث أي مشكلة.
            </p>

            <div className="flex justify-end">
              <Button
                onClick={handleBackup}
                disabled={backupStatus === "progress"}
              >
                <Download className="ml-2 h-4 w-4" />
                إنشاء نسخة احتياطية
              </Button>
            </div>

            {backupStatus !== "idle" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {backupStatus === "progress"
                      ? "جاري إنشاء النسخة الاحتياطية..."
                      : backupStatus === "success"
                        ? "تم إنشاء النسخة الاحتياطية بنجاح"
                        : "حدث خطأ أثناء إنشاء النسخة الاحتياطية"}
                  </span>
                  <span className="text-sm font-medium">{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="h-2" />
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2 text-right">
                النسخ الاحتياطية السابقة
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <div className="text-right">
                    <p className="font-medium">نسخة احتياطية كاملة</p>
                    <p className="text-sm text-muted-foreground">
                      2024-06-01 12:30
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <div className="text-right">
                    <p className="font-medium">نسخة احتياطية كاملة</p>
                    <p className="text-sm text-muted-foreground">
                      2024-05-25 08:15
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="restore" className="space-y-6">
          <div className="space-y-4">
            <p className="text-muted-foreground text-right">
              استعادة البيانات من نسخة احتياطية سابقة. سيتم استبدال جميع
              البيانات الحالية بالبيانات من النسخة الاحتياطية.
            </p>

            <div className="space-y-2">
              <Label className="text-right block">
                اختر ملف النسخة الاحتياطية
              </Label>
              <div className="flex gap-4">
                <Button
                  onClick={handleRestore}
                  disabled={!selectedFile || restoreStatus === "progress"}
                >
                  <Upload className="ml-2 h-4 w-4" />
                  استعادة البيانات
                </Button>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="text-right"
                />
              </div>
            </div>

            {restoreStatus !== "idle" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {restoreStatus === "progress"
                      ? "جاري استعادة البيانات..."
                      : restoreStatus === "success"
                        ? "تم استعادة البيانات بنجاح"
                        : "حدث خطأ أثناء استعادة البيانات"}
                  </span>
                  <span className="text-sm font-medium">
                    {restoreProgress}%
                  </span>
                </div>
                <Progress value={restoreProgress} className="h-2" />
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-4">
              <h3 className="font-medium mb-2 text-right text-yellow-800 dark:text-yellow-200">
                تحذير
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 text-right">
                استعادة البيانات ستؤدي إلى استبدال جميع البيانات الحالية. تأكد
                من أن لديك نسخة احتياطية حديثة قبل المتابعة.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={autoBackupEnabled}
                  onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="autoBackup" className="mr-2">
                  تفعيل النسخ الاحتياطي التلقائي
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right block">
                  تكرار النسخ الاحتياطي
                </Label>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="hourly">كل ساعة</option>
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-right block">وقت النسخ الاحتياطي</Label>
                <Input
                  type="time"
                  value={backupTime}
                  onChange={(e) => setBackupTime(e.target.value)}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">
                  الاحتفاظ بالنسخ الاحتياطية (أيام)
                </Label>
                <Input
                  type="number"
                  value={backupRetention}
                  onChange={(e) => setBackupRetention(e.target.value)}
                  className="text-right"
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">
                  مكان تخزين النسخ الاحتياطية
                </Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="local">التخزين المحلي</option>
                  <option value="cloud">التخزين السحابي</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveSettings}>
                <Save className="ml-2 h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2 text-right">
                سجل النسخ الاحتياطي
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 bg-muted/20 rounded">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="text-right">
                    <p className="font-medium">تم إنشاء نسخة احتياطية بنجاح</p>
                    <p className="text-sm text-muted-foreground">
                      2024-06-01 12:30
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-muted/20 rounded">
                  <Database className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="text-right">
                    <p className="font-medium">تم استعادة البيانات بنجاح</p>
                    <p className="text-sm text-muted-foreground">
                      2024-05-28 09:45
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
