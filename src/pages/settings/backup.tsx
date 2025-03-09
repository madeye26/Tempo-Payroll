import React from "react";
import { DataBackup } from "@/components/ui/data-backup";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/animations";
import { PageHeader } from "@/components/ui/page-header";

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
        description="قم بإنشاء نسخة احتياطية من بيانات النظام أو استعادة البيانات من نسخة احتياطية سابقة"
      />

      <FadeIn delay={0.2}>
        <p className="text-muted-foreground">
          قم بإنشاء نسخة احتياطية من بيانات النظام أو استعادة البيانات من نسخة
          احتياطية سابقة. يتضمن ذلك بيانات الموظفين والرواتب والسلف والإجازات
          وإعدادات النظام.
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <DataBackup />
      </FadeIn>

      <FadeIn delay={0.4}>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="font-semibold mb-2">ملاحظات هامة</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>قم بإنشاء نسخة احتياطية بشكل دوري للحفاظ على بياناتك.</li>
            <li>
              عند استيراد البيانات، سيتم استبدال جميع البيانات الحالية بالبيانات
              المستوردة.
            </li>
            <li>تأكد من أن ملف النسخة الاحتياطية صالح قبل الاستيراد.</li>
            <li>
              يمكنك استعادة البيانات من النسخة الاحتياطية السابقة في حالة حدوث
              أي مشكلة أثناء الاستيراد.
            </li>
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
