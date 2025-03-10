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
      console.log("Login form submission for:", data.email);
      console.log("Supabase available:", !!supabase);

      // Try direct Supabase login first if available
      if (supabase) {
        console.log("Attempting direct Supabase login");
        try {
          const { data: authData, error } =
            await supabase.auth.signInWithPassword({
              email: data.email,
              password: data.password,
            });

          if (error) {
            console.error("Direct Supabase login error:", error);
            console.log("Falling back to useAuth login method");
          } else if (authData.user) {
            console.log("Direct Supabase login successful", authData.user);

            // Import auth utils to ensure user is in public table
            const { ensureUserInPublicTable } = await import(
              "@/lib/auth-utils"
            );
            const userData = await ensureUserInPublicTable(authData.user);

            if (userData) {
              // Set user in localStorage to maintain session
              localStorage.setItem(
                "auth_user",
                JSON.stringify({
                  id: userData.id,
                  email: userData.email,
                  role: userData.role,
                  name: userData.name,
                  avatar: userData.avatar,
                  permissions: userData.permissions,
                }),
              );
            } else {
              // Fallback if user data couldn't be retrieved
              localStorage.setItem(
                "auth_user",
                JSON.stringify({
                  id: authData.user.id,
                  email: authData.user.email,
                  name:
                    authData.user.user_metadata?.name ||
                    authData.user.email.split("@")[0],
                  role: authData.user.user_metadata?.role || "viewer",
                }),
              );
            }

            toast({
              title: "تم تسجيل الدخول بنجاح",
              description: "مرحباً بك في نظام إدارة الرواتب",
            });

            // Force navigation and page reload to ensure auth state is recognized
            window.location.href = "/";
            return;
          }
        } catch (directLoginError) {
          console.error(
            "Exception during direct Supabase login:",
            directLoginError,
          );
          console.log("Falling back to useAuth login method");
        }
      }

      // Fall back to the login function from useAuth
      console.log("Using useAuth login method");
      const success = await login(data.email, data.password);

      if (success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة الرواتب",
        });
        // Force navigation and page reload to ensure auth state is recognized
        window.location.href = "/";
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
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/5 to-muted/20"
      dir="rtl"
    >
      <Card className="w-full max-w-md p-8 shadow-lg border-t-4 border-t-primary animate-fadeIn">
        <div className="text-center mb-8 animate-fadeIn">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=B&backgroundColor=0891b2"
            alt="Logo"
            className="h-20 w-20 mx-auto mb-4 rounded-xl shadow-md transition-transform hover:scale-105 duration-300"
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

          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:shadow-md"
            disabled={isLoading}
          >
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
      </Card>
    </div>
  );
}
