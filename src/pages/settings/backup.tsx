import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataBackup } from "@/components/ui/data-backup";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function BackupPage() {
  const { hasPermission } = useAuth();

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
      <PageHeader
        title="النسخ الاحتياطي واستعادة البيانات"
        description="إنشاء نسخة احتياطية من بيانات النظام أو استعادة البيانات من نسخة احتياطية سابقة"
      />

      <DataBackup />
    </div>
  );
}
