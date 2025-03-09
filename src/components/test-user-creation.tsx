import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth-service";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function TestUserCreation() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateUser = async () => {
    if (!email || !password || !name) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTestResult(null);

    try {
      // Use the auth service to create the user
      const result = await authService.createUser({
        email,
        password,
        name,
        role,
      });

      if (result.success) {
        setTestResult({
          success: true,
          message: "User created successfully",
          user: result.user,
        });

        toast({
          title: "تم إنشاء المستخدم بنجاح",
          description: `يمكنك الآن تسجيل الدخول باستخدام ${email} / ${password}`,
        });

        // Clear form
        setEmail("");
        setPassword("");
        setName("");
      } else {
        setTestResult({
          success: false,
          message: result.message,
        });

        toast({
          title: "خطأ",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });

      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء إنشاء المستخدم: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور للاختبار",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTestResult(null);

    try {
      // Use the auth service to test login
      const result = await authService.login(email, password);

      if (result.success) {
        setTestResult({
          success: true,
          message: `Login successful for user: ${result.user.name} (${result.user.role})`,
          user: result.user,
        });

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `تم تسجيل الدخول بنجاح للمستخدم: ${result.user.name}`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Login failed: ${result.message}`,
        });

        toast({
          title: "فشل تسجيل الدخول",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing login:", error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });

      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء اختبار تسجيل الدخول: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowUsers = () => {
    try {
      const mockAuthUsers = JSON.parse(
        localStorage.getItem("mock_auth_users") || "[]",
      );
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      setTestResult({
        success: true,
        mockAuthUsers,
        users,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  return (
    <Card className="p-6" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">اختبار إنشاء مستخدم جديد</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>البريد الإلكتروني</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            dir="ltr"
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label>كلمة المرور</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label>الاسم</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label>الدور</Label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-md text-right"
          >
            <option value="admin">مدير النظام</option>
            <option value="manager">مدير</option>
            <option value="accountant">محاسب</option>
            <option value="viewer">مستخدم عادي</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleCreateUser} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="ml-2" />
                جاري الإنشاء...
              </>
            ) : (
              "إنشاء مستخدم جديد"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleTestLogin}
            disabled={loading}
          >
            اختبار تسجيل الدخول
          </Button>
          <Button variant="secondary" onClick={handleShowUsers}>
            عرض المستخدمين
          </Button>
        </div>

        {testResult && (
          <div
            className={`mt-4 p-4 rounded-md ${testResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            <h3 className="font-semibold mb-2">نتيجة الاختبار:</h3>
            {testResult.message && <p>{testResult.message}</p>}

            {testResult.mockAuthUsers && (
              <div className="mt-4">
                <h4 className="font-semibold">مستخدمي المصادقة:</h4>
                <pre
                  className="bg-black/5 p-2 rounded mt-2 overflow-auto text-xs"
                  dir="ltr"
                >
                  {JSON.stringify(testResult.mockAuthUsers, null, 2)}
                </pre>
              </div>
            )}

            {testResult.users && (
              <div className="mt-4">
                <h4 className="font-semibold">المستخدمين:</h4>
                <pre
                  className="bg-black/5 p-2 rounded mt-2 overflow-auto text-xs"
                  dir="ltr"
                >
                  {JSON.stringify(testResult.users, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
