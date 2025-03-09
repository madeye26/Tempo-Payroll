import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Users,
  FileText,
  Calculator,
  Database,
  Settings as SettingsIcon,
  HelpCircle,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const settingsOptions = [
    {
      title: "إدارة المستخدمين",
      description: "إضافة وتعديل وحذف المستخدمين وإدارة الصلاحيات",
      icon: <Users className="h-8 w-8" />,
      path: "/settings/users",
      permission: "manage_users",
    },
    {
      title: "سجل النشاطات",
      description: "عرض سجل نشاطات المستخدمين في النظام",
      icon: <FileText className="h-8 w-8" />,
      path: "/settings/activity-logs",
      permission: "manage_settings",
    },
    {
      title: "معادلات الرواتب",
      description: "تعديل معادلات حساب الرواتب والخصومات",
      icon: <Calculator className="h-8 w-8" />,
      path: "/settings/formulas",
      permission: "manage_settings",
    },
    {
      title: "اختبار الاتصال",
      description: "اختبار الاتصال بقاعدة البيانات",
      icon: <Database className="h-8 w-8" />,
      path: "/test-connection",
      permission: "manage_settings",
    },
    {
      title: "إعدادات النظام",
      description: "تعديل إعدادات النظام العامة",
      icon: <SettingsIcon className="h-8 w-8" />,
      path: "/settings/system",
      permission: "manage_settings",
    },
    {
      title: "النسخ الاحتياطي",
      description: "إنشاء واستعادة النسخ الاحتياطية للبيانات",
      icon: <FileText className="h-8 w-8" />,
      path: "/settings/backup",
      permission: "manage_settings",
    },
    {
      title: "المساعدة",
      description: "دليل استخدام النظام والأسئلة الشائعة",
      icon: <HelpCircle className="h-8 w-8" />,
      path: "/settings/help",
      permission: "view_dashboard",
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        الإعدادات
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map(
          (option) =>
            hasPermission(option.permission) && (
              <Card
                key={option.path}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(option.path)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            ),
        )}
      </div>
    </div>
  );
}
