import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

export function UserDebug() {
  const { user } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  const handleShowLocalStorage = () => {
    const data = {
      authUser: JSON.parse(localStorage.getItem("auth_user") || "null"),
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      mockAuthUsers: JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      ),
    };
    setLocalStorageData(data);
  };

  return (
    <Card className="p-6" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">معلومات المستخدم الحالي</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">المستخدم الحالي:</h3>
        {user ? (
          <div className="bg-muted p-3 rounded">
            <p>
              <strong>الاسم:</strong> {user.name}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {user.email}
            </p>
            <p>
              <strong>الدور:</strong> {user.role}
            </p>
            <p>
              <strong>المعرف:</strong> {user.id}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">لم يتم تسجيل الدخول</p>
        )}
      </div>

      <Button onClick={handleShowLocalStorage} variant="outline">
        عرض بيانات التخزين المحلي
      </Button>

      {localStorageData && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">بيانات التخزين المحلي:</h3>

          <div className="mt-2">
            <h4 className="font-medium">المستخدم المصادق:</h4>
            <pre
              className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs"
              dir="ltr"
            >
              {JSON.stringify(localStorageData.authUser, null, 2)}
            </pre>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">المستخدمون:</h4>
            <pre
              className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs"
              dir="ltr"
            >
              {JSON.stringify(localStorageData.users, null, 2)}
            </pre>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">مستخدمو المصادقة:</h4>
            <pre
              className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs"
              dir="ltr"
            >
              {JSON.stringify(localStorageData.mockAuthUsers, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
