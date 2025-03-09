import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { UserManagement } from "@/components/auth/user-management";

export default function UsersPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة المستخدمين"
        description="إضافة وتعديل وحذف المستخدمين وإدارة الصلاحيات"
      />

      <UserManagement />
    </div>
  );
}
