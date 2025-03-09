import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة الرواتب",
        });
        navigate("/");
      } else {
        setError("root", {
          message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", {
        message: "حدث خطأ أثناء تسجيل الدخول",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-muted/20"
      dir="rtl"
    >
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=شركتك&backgroundColor=0891b2"
            alt="Logo"
            className="h-16 w-16 mx-auto mb-4 rounded-xl shadow-md"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
            نظام إدارة الرواتب
          </h1>
          <p className="text-muted-foreground mt-2">
            تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              className="text-right"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
              className="text-right"
              dir="ltr"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {errors.root.message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="ml-2" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>بيانات الدخول الافتراضية:</p>
          <p>البريد الإلكتروني: admin@example.com</p>
          <p>كلمة المرور: password123</p>
        </div>
      </Card>
    </div>
  );
}
