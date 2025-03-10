import React, { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { LoadingSpinner } from "./loading-spinner";
import { useToast } from "./use-toast";
import { Download, Upload, Save, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

export function DataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Get all data from localStorage
      const data = {
        employees: JSON.parse(localStorage.getItem("employees") || "[]"),
        advances: JSON.parse(localStorage.getItem("advances") || "[]"),
        absences: JSON.parse(localStorage.getItem("absences") || "[]"),
        salaries: JSON.parse(localStorage.getItem("salaries") || "[]"),
        users: JSON.parse(localStorage.getItem("users") || "[]"),
        mock_auth_users: JSON.parse(
          localStorage.getItem("mock_auth_users") || "[]",
        ),
        activity_logs: JSON.parse(
          localStorage.getItem("activity_logs") || "[]",
        ),
        system_settings: JSON.parse(
          localStorage.getItem("system_settings") || "{}",
        ),
        // Add metadata
        metadata: {
          version: "1.0",
          timestamp: new Date().toISOString(),
          device: navigator.userAgent,
          exportedBy:
            JSON.parse(localStorage.getItem("auth_user") || "{}")?.name ||
            "Unknown",
        },
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(data, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `salary-system-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات النظام بنجاح",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء تصدير البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    if (importFile) {
      setConfirmDialogOpen(true);
    } else {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف للاستيراد",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      // Read the file
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);

      // Validate the data structure
      if (!data.employees || !data.advances || !data.users) {
        throw new Error("الملف غير صالح أو لا يحتوي على البيانات المطلوبة");
      }

      // Create a backup of current data before importing
      const currentData = {
        employees: JSON.parse(localStorage.getItem("employees") || "[]"),
        advances: JSON.parse(localStorage.getItem("advances") || "[]"),
        absences: JSON.parse(localStorage.getItem("absences") || "[]"),
        salaries: JSON.parse(localStorage.getItem("salaries") || "[]"),
        users: JSON.parse(localStorage.getItem("users") || "[]"),
        activity_logs: JSON.parse(
          localStorage.getItem("activity_logs") || "[]",
        ),
        system_settings: JSON.parse(
          localStorage.getItem("system_settings") || "{}",
        ),
      };
      localStorage.setItem(
        "_backup_before_import",
        JSON.stringify(currentData),
      );

      // Import the data
      localStorage.setItem("employees", JSON.stringify(data.employees));
      localStorage.setItem("advances", JSON.stringify(data.advances));
      localStorage.setItem("absences", JSON.stringify(data.absences || []));
      localStorage.setItem("salaries", JSON.stringify(data.salaries || []));
      localStorage.setItem("users", JSON.stringify(data.users));

      // Import mock auth users if available
      if (data.mock_auth_users) {
        localStorage.setItem(
          "mock_auth_users",
          JSON.stringify(data.mock_auth_users),
        );
      }

      localStorage.setItem(
        "activity_logs",
        JSON.stringify(data.activity_logs || []),
      );

      if (data.system_settings) {
        localStorage.setItem(
          "system_settings",
          JSON.stringify(data.system_settings),
        );
      }

      // Log the import activity
      const currentUser = JSON.parse(
        localStorage.getItem("auth_user") || "null",
      );
      if (currentUser) {
        try {
          const { logActivity } = await import("@/lib/activity-logger");
          logActivity(
            "setting",
            "import",
            `تم استيراد بيانات النظام من نسخة احتياطية`,
            currentUser.id,
            { timestamp: new Date().toISOString() },
          );
        } catch (error) {
          console.error("Failed to log import activity", error);
        }
      }

      toast({
        title: "تم الاستيراد بنجاح",
        description:
          "تم استيراد بيانات النظام بنجاح. قم بتحديث الصفحة لرؤية التغييرات.",
      });

      // Close the dialog
      setConfirmDialogOpen(false);
      setImportFile(null);

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء استيراد البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleRestoreBackup = () => {
    try {
      // Check if there's a backup
      const backupData = localStorage.getItem("_backup_before_import");
      if (!backupData) {
        toast({
          title: "خطأ",
          description: "لا توجد نسخة احتياطية للاستعادة",
          variant: "destructive",
        });
        return;
      }

      // Parse the backup data
      const data = JSON.parse(backupData);

      // Restore the data
      localStorage.setItem("employees", JSON.stringify(data.employees));
      localStorage.setItem("advances", JSON.stringify(data.advances));
      localStorage.setItem("absences", JSON.stringify(data.absences || []));
      localStorage.setItem("salaries", JSON.stringify(data.salaries || []));
      localStorage.setItem("users", JSON.stringify(data.users));
      localStorage.setItem(
        "activity_logs",
        JSON.stringify(data.activity_logs || []),
      );

      if (data.system_settings) {
        localStorage.setItem(
          "system_settings",
          JSON.stringify(data.system_settings),
        );
      }

      toast({
        title: "تم الاستعادة بنجاح",
        description:
          "تم استعادة بيانات النظام من النسخة الاحتياطية بنجاح. قم بتحديث الصفحة لرؤية التغييرات.",
      });

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء استعادة النسخة الاحتياطية: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">تصدير البيانات</h2>
        <p className="text-muted-foreground mb-4">
          قم بتصدير جميع بيانات النظام إلى ملف JSON. يمكنك استخدام هذا الملف
          لاستعادة البيانات لاحقاً.
        </p>
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <LoadingSpinner size="sm" className="ml-2" />
              جاري التصدير...
            </>
          ) : (
            <>
              <Download className="ml-2 h-4 w-4" />
              تصدير البيانات
            </>
          )}
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">استيراد البيانات</h2>
        <p className="text-muted-foreground mb-4">
          قم باستيراد بيانات النظام من ملف JSON تم تصديره مسبقاً. سيتم استبدال
          جميع البيانات الحالية بالبيانات المستوردة.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>اختر ملف الاستيراد</Label>
            <Input
              type="file"
              accept=".json"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="text-right"
            />
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleImportClick}
              disabled={isImporting || !importFile}
            >
              {isImporting ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  جاري الاستيراد...
                </>
              ) : (
                <>
                  <Upload className="ml-2 h-4 w-4" />
                  استيراد البيانات
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRestoreBackup}
              disabled={!localStorage.getItem("_backup_before_import")}
            >
              <Save className="ml-2 h-4 w-4" />
              استعادة النسخة الاحتياطية السابقة
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد استيراد البيانات</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة. هذا
                  الإجراء لا يمكن التراجع عنه.
                </span>
              </div>
              <p>
                سيتم إنشاء نسخة احتياطية من البيانات الحالية قبل الاستيراد يمكنك
                استعادتها في حالة حدوث أي مشكلة.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImport}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isImporting ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  جاري الاستيراد...
                </>
              ) : (
                "تأكيد الاستيراد"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
