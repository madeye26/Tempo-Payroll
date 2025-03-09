import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Download, Upload, Save, FileUp, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Get all data from localStorage
  const exportData = () => {
    setIsExporting(true);
    try {
      // Collect all data from localStorage
      const data: Record<string, any> = {};
      const keys = [
        "employees",
        "salaries",
        "advances",
        "absences",
        "users",
        "activity_logs",
        "system_settings",
        "mock_auth_users",
      ];

      keys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch (e) {
            data[key] = value;
          }
        }
      });

      // Create a JSON file
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `salary-system-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "تم تصدير البيانات بنجاح",
        description: "تم حفظ ملف النسخة الاحتياطية",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "خطأ في تصدير البيانات",
        description: `حدث خطأ أثناء تصدير البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  // Import data from file
  const importData = async () => {
    if (!importFile) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "يرجى اختيار ملف النسخة الاحتياطية أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Read the file
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);

      // Validate the data structure
      const requiredKeys = ["employees", "users"];
      const missingKeys = requiredKeys.filter((key) => !data[key]);

      if (missingKeys.length > 0) {
        throw new Error(
          `الملف غير صالح. البيانات المفقودة: ${missingKeys.join(", ")}`,
        );
      }

      // Backup current data before importing
      const currentData: Record<string, string> = {};
      Object.keys(data).forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          currentData[key] = value;
        }
      });

      // Store backup in case we need to restore
      localStorage.setItem(
        "_backup_before_import",
        JSON.stringify(currentData),
      );

      // Import the data
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });

      toast({
        title: "تم استيراد البيانات بنجاح",
        description:
          "تم استعادة البيانات من النسخة الاحتياطية. قد تحتاج إلى إعادة تحميل الصفحة لرؤية التغييرات.",
      });

      // Reset file input
      setImportFile(null);
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "خطأ في استيراد البيانات",
        description: `حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Restore data from backup
  const restoreFromBackup = () => {
    try {
      const backup = localStorage.getItem("_backup_before_import");
      if (!backup) {
        toast({
          title: "لا توجد نسخة احتياطية",
          description: "لم يتم العثور على نسخة احتياطية للاستعادة منها",
          variant: "destructive",
        });
        return;
      }

      const backupData = JSON.parse(backup);
      Object.keys(backupData).forEach((key) => {
        localStorage.setItem(key, backupData[key]);
      });

      toast({
        title: "تم استعادة البيانات بنجاح",
        description: "تم استعادة البيانات من النسخة الاحتياطية السابقة",
      });
    } catch (error) {
      console.error("Error restoring from backup:", error);
      toast({
        title: "خطأ في استعادة البيانات",
        description: `حدث خطأ أثناء استعادة البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        النسخ الاحتياطي واستعادة البيانات
      </h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">تصدير البيانات</h3>
          <p className="text-muted-foreground">
            قم بتصدير جميع بيانات النظام كملف JSON للنسخ الاحتياطي. يتضمن ذلك
            بيانات الموظفين والرواتب والسلف والإجازات وإعدادات النظام.
          </p>
          <Button onClick={exportData} disabled={isExporting}>
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" className="ml-2" />
                جاري التصدير...
              </>
            ) : (
              <>
                <FileDown className="ml-2 h-4 w-4" />
                تصدير البيانات
              </>
            )}
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">استيراد البيانات</h3>
          <p className="text-muted-foreground">
            قم باستيراد البيانات من ملف نسخة احتياطية سابقة. سيؤدي ذلك إلى
            استبدال البيانات الحالية.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">اختر ملف النسخة الاحتياطية</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={importData}
                disabled={!importFile || isImporting}
              >
                {isImporting ? (
                  <>
                    <LoadingSpinner size="sm" className="ml-2" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <FileUp className="ml-2 h-4 w-4" />
                    استيراد البيانات
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={restoreFromBackup}
                disabled={!localStorage.getItem("_backup_before_import")}
              >
                استعادة من النسخة الاحتياطية السابقة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
