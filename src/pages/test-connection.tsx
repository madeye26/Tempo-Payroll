import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  testSupabaseConnection,
  testEmployeeInsert,
} from "@/lib/test-supabase-connection";

export default function TestConnectionPage() {
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [insertResult, setInsertResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [envVariables, setEnvVariables] = useState({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "Not set",
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
      ? "[Hidden]"
      : "Not set",
  });

  // Auto-test connection on page load
  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestInsert = async () => {
    setLoading(true);
    try {
      const result = await testEmployeeInsert();
      setInsertResult(result);
    } catch (error) {
      setInsertResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        اختبار الاتصال بقاعدة البيانات
      </h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">متغيرات البيئة</h2>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between p-2 bg-muted/20 rounded">
            <span className="font-mono">VITE_SUPABASE_URL</span>
            <span className="font-mono">{envVariables.VITE_SUPABASE_URL}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded">
            <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>
            <span className="font-mono">
              {envVariables.VITE_SUPABASE_ANON_KEY}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={handleTestConnection} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="ml-2" />
                جاري الاختبار...
              </>
            ) : (
              "اختبار الاتصال"
            )}
          </Button>
          <Button
            onClick={handleTestInsert}
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="ml-2" />
                جاري الاختبار...
              </>
            ) : (
              "اختبار إضافة موظف"
            )}
          </Button>
        </div>

        {connectionResult && (
          <div
            className={`p-4 rounded-md mb-4 ${connectionResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <h3 className="font-semibold mb-2">نتيجة اختبار الاتصال</h3>
            <p>{connectionResult.message}</p>
            {connectionResult.error && (
              <pre className="mt-2 p-2 bg-black/10 rounded overflow-auto text-xs">
                {JSON.stringify(connectionResult.error, null, 2)}
              </pre>
            )}
          </div>
        )}

        {insertResult && (
          <div
            className={`p-4 rounded-md ${insertResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <h3 className="font-semibold mb-2">نتيجة اختبار الإضافة</h3>
            <p>{insertResult.message}</p>
            {insertResult.data && (
              <pre className="mt-2 p-2 bg-black/10 rounded overflow-auto text-xs">
                {JSON.stringify(insertResult.data, null, 2)}
              </pre>
            )}
            {insertResult.error && (
              <pre className="mt-2 p-2 bg-black/10 rounded overflow-auto text-xs">
                {JSON.stringify(insertResult.error, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">حل مشاكل الاتصال</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">
              1. تأكد من تكوين متغيرات البيئة
            </h3>
            <p className="text-muted-foreground">
              تأكد من أن متغيرات البيئة VITE_SUPABASE_URL و
              VITE_SUPABASE_ANON_KEY تم تعيينها بشكل صحيح.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">2. تأكد من وجود الجداول</h3>
            <p className="text-muted-foreground">
              تأكد من أن جدول employees موجود في قاعدة البيانات وأن له الأعمدة
              الصحيحة.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">3. تأكد من صلاحيات الوصول</h3>
            <p className="text-muted-foreground">
              تأكد من أن سياسات RLS تسمح بالإدراج في جدول employees.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">4. تحقق من سجلات الخطأ</h3>
            <p className="text-muted-foreground">
              افتح وحدة تحكم المتصفح للاطلاع على أي أخطاء مفصلة.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
